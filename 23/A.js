const { readFileSync } = require("fs");

const contents = readFileSync("input.txt", { encoding: "utf-8" });

const grid = contents.split("\n");
const list = grid.join("");

const width = grid[0].length;
const height = grid.length;

const start = grid[0].indexOf(".") + 0 * width;
const end = grid[height-1].indexOf(".") + (height-1) * width;


// const neighbors = v => [v-1, v+1, v-width, v+width].filter(v => v >= 0 && v < width * height && list[v] != "#");

function *neighbors(v) {
	if (v-1 >= 0 				&& ".<".includes(list[v-1])) 		yield v-1;
	if (v+1 < width*height 		&& ".>".includes(list[v+1])) 		yield v+1;
	if (v-width >= 0 			&& ".^".includes(list[v-width])) 	yield v-width;
	if (v+width < width*height 	&& ".v".includes(list[v+width])) 	yield v+width;
}

function bfs(p, visited) {
	let n = [...neighbors(p)].filter(v => !visited.has(v));
	while (n.length === 1) {
		visited.add(p);
		p = n[0];
		n = [...neighbors(p)].filter(v => !visited.has(v));
	}
	visited.add(p);
	// console.log(c, n, p, visited);
	let maxNested = 0;
	for (const x of n) {
		// const newSet = new Set(visited);
		maxNested = Math.max(maxNested, bfs(x, new Set([p])));
	}
	return visited.size-1 + maxNested;
}

console.log(bfs(start, new Set()));