const { readFileSync } = require("fs");

const contents = readFileSync("input.alt.txt", { encoding: "utf-8" }).split("\n")
// 601441063166538

// const contents = `
// .......
// .......
// .......
// ...S...
// ......#
// #......
// ..#....
// `.trim().split("\n");

function pmod(a, b) {
	return (b + (a % b)) % b;
}

function taxicab(x1, y1, x2, y2) {
	return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

// observation: input has diamond shape of gardens
// after 65 iterations, the path fills it perfectly
// step count (26501365) mod 131 (width & height) is 65
// after 65+131 steps, it fills the diamond perfectly again
// so total after step count should be inner squares + diamond n times

// if floor(steps / 131) == 2:
//    ^
//   / \
//  /   \
// <  O12>
//  \ 12/
//   \2/
//    v
// 2 + 2 diamonds + 4 even + 9 odd

// 1 4 9 16 25 whAT ????? (count of odd/even for each diamond layer cummulative)

const height = contents.length;
const width = contents[0].length;

// console.log("wh", width, height)

const startX = contents.find(v => v.includes("S")).indexOf("S");
const startY = contents.findIndex(v => v.includes("S"));

let odd = 0, even = 0, diamond = 0, invDiamond = 0, leftDiamond = 0;
contents.forEach((r, y) => r.split("").forEach((c, x) => {
	if (c === '#') return;

	if ((x+y) % 2 === 0) even++;
	else odd++;

	if (taxicab(x, y, startX, startY) < width / 2) {
		if ((x+y) % 2 === 1) diamond++;
	} else {
		if ((x+y) % 2 === 1) leftDiamond++;
		else invDiamond++;
	}
}));
// const even = contents.flatMap((v, y) => v.split("").filter((c, x) => c !== '#' && (x+y) % 2 === 0)).length;
// const odd = contents.flatMap((v, y) => v.split("").filter((c, x) => c !== '#' && (x+y) % 2 === 1)).length;

// console.log("eo", even, odd, contents.join("\n").match(/#/g).length, width*height - contents.join("\n").match(/#/g).length)

// let queue = [ contents.find(v => v.includes("S")).indexOf("S") + contents.findIndex(v => v.includes("S")) * width ];
// let queue = [ [startX, startY] ];
// let newQueue = [];
// const newQueueItems = new Set();

// for (let i = 0; i < Math.floor(width/2); i++) {
// 	queue.forEach(([x, y]) => {
// 	// queue.forEach(v => {
// 		// const x = v % width, y = Math.floor(v / width);
// 		[[-1, 0], [1, 0], [0, -1], [0, 1]]
// 			.map(([dx, dy]) => [x+dx, y+dy])
// 			.filter(([nx, ny]) => nx >= 0 && nx < width && ny >= 0 && ny < contents.length)
// 			// .filter(([nx, ny]) => taxicab(startX, startY, nx, ny) >= taxicab(startX, startY, x, y))
// 			.filter(([nx, ny]) => contents[pmod(ny, height)][pmod(nx, width)] !== '#')
// 			// .map(([nx, ny]) => nx + ny * width)
// 			.filter(([nx, ny]) => !newQueueItems.has(""+nx+"_"+ny))
// 			.forEach(nv => { newQueue.push(nv); newQueueItems.add(""+nv[0]+"_"+nv[1]); });
// 	});

// 	queue = [...newQueue];
// 	// newQueue.clear();
// 	newQueue = [];
// 	newQueueItems.clear();

// 	// console.log(i)
// 	// console.log(contents.map((r, y) => r.split("").map((c, x) => queue.some(([qx, qy]) => pmod(qx, width)===x&&pmod(qy, height)===y) ? 'O' : c).join("")).join("\n"))
// 	// console.log()
// }
// const diamond = queue.length;
// console.log(contents.map((r, y) => r.split("").map((c, x) => queue.some(([qx, qy]) => pmod(qx, width)===x&&pmod(qy, height)===y) ? 'O' : c).join("")).join("\n"))
// console.log()

// queue = [[0, 0], [width-1, 0], [0, height-1], [width-1, height-1]];
// for (let i = 0; i < Math.floor(width/2)-1; i++) {
// 	queue.forEach(([x, y]) => {
// 		[[-1, 0], [1, 0], [0, -1], [0, 1]]
// 			.map(([dx, dy]) => [x+dx, y+dy])
// 			.filter(([nx, ny]) => nx >= 0 && nx < width && ny >= 0 && ny < contents.length)
// 			.filter(([nx, ny]) => contents[pmod(ny, height)][pmod(nx, width)] !== '#')
// 			.filter(([nx, ny]) => !newQueueItems.has(""+nx+"_"+ny))
// 			.forEach(nv => { newQueue.push(nv); newQueueItems.add(""+nv[0]+"_"+nv[1]); });
// 	});

// 	queue = [...newQueue];
// 	newQueue = [];
// 	newQueueItems.clear();
// }
// const invDiamond = queue.length;
// console.log(contents.map((r, y) => r.split("").map((c, x) => queue.some(([qx, qy]) => pmod(qx, width)===x&&pmod(qy, height)===y) ? 'O' : c).join("")).join("\n"))
// console.log()

// const leftDiamond = odd - diamond;


// const n = Math.floor(18 / 7) - 1;
const n = Math.floor(26501365 / 131) - 1;

console.log(`o=${odd}, e=${even}, d=${diamond}, i=${invDiamond}, l=${leftDiamond}, n=${n}`);

// const evenN = n ** 2, oddN = (n-1) ** 2;

// console.log(oddN, evenN, oddN + evenN, n);

// console.log(oddN * odd, evenN * even, (2 + n * 4) * diamond)
// console.log(oddN * odd + evenN * even + 2 * diamond + 2 * odd + 2 * odd * n)
// console.log(oddN * odd + evenN * even + (n+1) * diamond + n * invDiamond + 3 * n * odd);
const parts = [
	(n-0)**2 * odd,
	(n+1)**2 * even,
	n*4*odd, -n*leftDiamond,
	2 * odd, 2 * diamond,
	(n+1)*invDiamond,
	// n * invDiamond,
	// 3 * (n-1) * odd + (n-1) * diamond,
];
console.log(parts.reduce((v,a)=>v+a));
console.log(...parts);

// console.log(contents.map((r, y) => r.split("").map((c, x) => queue.some(([qx, qy]) => pmod(qx, width)===x&&pmod(qy, height)===y) ? 'O' : c).join("")).join("\n"))
// console.log()

// console.log(queue.length);
