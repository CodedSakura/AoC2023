const { readFileSync, writeFileSync } = require("fs");

const contents = readFileSync("input.txt", { encoding: "utf-8" })
	.split("\n")
	.map(r => r.split(" "))
	.map(([d, n, c]) => [d, Number(n)]);

const trench = [[ true ]];
const pos = [0, 0];

for (const [dir, num] of contents) {
	switch (dir) {
	case "U":
		if (pos[1]-num < 0) {
			const d = -(pos[1]-num);
			trench.unshift(...new Array(d).fill(0).map(_ => []));
			pos[1] += d;
		}
		for (let i = 0; i <= num; i++) {
			trench[pos[1]-i][pos[0]] = true;
		}
		pos[1] -= num;
		break;
	case "D":
		// if (trench.length < pos[1] + num) {
		// 	trench.push(...new Array(num - (trench.length - pos[1])).fill(0).map(_ => []));
		// }
		for (let i = 0; i <= num; i++) {
			if (!trench[pos[1]+i]) {
				trench[pos[1]+i] = [];
			}
			trench[pos[1]+i][pos[0]] = true;
		}
		pos[1] += num;
		break;

	case "R":
		// if (trench[pos[1]].length < pos[0] + num) {
		// 	trench[pos[1]].push(...new Array(num - (trench[pos[1]].length - pos[0])).fill(true))
		// }
		for (let i = 0; i <= num; i++) {
			trench[pos[1]][pos[0]+i] = true;
		}
		pos[0] += num;
		break;

	case "L":
		if (pos[0]-num < 0) {
			const d = -(pos[0]-num);
			for (let y = 0; y < trench.length; y++) {
				trench[y].unshift(...new Array(d));
			}
			pos[0] += d;
		}
		for (let i = 0; i <= num; i++) {
			trench[pos[1]][pos[0]-i] = true;
		}
		pos[0] -= num;
		break;

	}

	// let height = trench.length, width = Math.max(...trench.map(v => v.length));
	// let grid = "";
	// for (let y = 0; y < height; y++) {
	// 	for (let x = 0; x < width; x++) {
	// 		if (pos[0] === x && pos[1] === y) {
	// 			grid += "*";
	// 		} else if (trench[y][x]) {
	// 			grid += "#";
	// 		} else {
	// 			grid += ".";
	// 		}
	// 	}
	// 	grid += "\n";
	// }
	// console.log(grid);
	// console.log();
}
let height = trench.length, width = Math.max(...trench.map(v => v.length));
// let grid = "";
let prev = [];
let count = 0;
for (let y = 0; y < height; y++) {
	let inside = false;
	for (let x = 0; x < width; x++) {
		const c = trench[y][x];
		if (c) { 
			if (prev[x]) {
				inside = !inside; 
			}
		}

		if (pos[0] === x && pos[1] === y) {
			count += 1;
			// grid += "*";
		} else if (trench[y][x]) {
			count += 1;
			// grid += "#";
		} else if (inside) {
			count += 1;
			// grid += "@"
		}/* else {
			grid += ".";
		}*/
	}
	prev = trench[y];
	// grid += "\n";
}
// writeFileSync("./img.txt", grid);

console.log(count)
// console.log(contents)
// 36319 - wrong
// 11149 - wrong
// 36806 - wrong??