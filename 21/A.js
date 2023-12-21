const { readFileSync } = require("fs");

const contents = readFileSync("input.txt", { encoding: "utf-8" }).split("\n");

const width = contents[0].length;

let queue = [ contents.find(v => v.includes("S")).indexOf("S") + contents.findIndex(v => v.includes("S")) * width ];
const newQueue = new Set();

for (let i = 0; i < 64; i++) {
	queue.forEach(v => {
		const x = v % width, y = Math.floor(v / width);
		[[-1, 0], [1, 0], [0, -1], [0, 1]]
			.map(([dx, dy]) => [x+dx, y+dy])
			.filter(([nx, ny]) => nx >= 0 && nx < width && ny >= 0 && ny < contents.length)
			.filter(([nx, ny]) => contents[ny][nx] !== '#')
			.map(([nx, ny]) => nx + ny * width)
			.forEach(nv => newQueue.add(nv));
	});

	// console.log(contents.map((r, y) => r.split("").map((c, x) => newQueue.has(x+y*width) ? 'O' : c).join("")).join("\n"))
	// console.log()

	queue = [...newQueue];
	newQueue.clear();

}

console.log(queue.length);
