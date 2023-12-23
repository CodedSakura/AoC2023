const { readFileSync, writeFileSync } = require("fs");

const contents = readFileSync("input.txt", { encoding: "utf-8" });

const grid = contents.split("\n");
const list = grid.join("");

const width = grid[0].length;
const height = grid.length;

const start = grid[0].indexOf(".") + 0 * width;
const end = grid[height-1].indexOf(".") + (height-1) * width;


// const neighbors = v => [v-1, v+1, v-width, v+width].filter(v => v >= 0 && v < width * height && list[v] != "#");

function *neighbors(v) {
	if (v-1 >= 0 				&& list[v-1] != "#")		yield v-1;
	if (v+1 < width*height 		&& list[v+1] != "#")		yield v+1;
	if (v-width >= 0 			&& list[v-width] != "#")	yield v-width;
	if (v+width < width*height 	&& list[v+width] != "#")	yield v+width;
}

/*function bfs(p, visited, o = 0) {
	let n = [...neighbors(p)].filter(v => !visited.has(v));
	while (n.length === 1) {
		visited.add(p);
		p = n[0];
		n = [...neighbors(p)].filter(v => !visited.has(v));
	}
	visited.add(p);
	if (n.length === 0) return visited.size-o-1;
	// console.log(c, n, p, visited);
	// console.log(p, n, visited.size - o)
	// let maxNested = 0;
	let deep = n.map(x => bfs(x, new Set(visited), visited.size+1));
	// console.log(deep, visited.size-o)
	// for (const x of n) {
	// 	// const newSet = new Set(visited);
	// 	maxNested = Math.max(maxNested, bfs(x, new Set(visited), visited.size));
	// }
	const res = visited.size-o + Math.max(0, ...deep);
	return res;
}
console.log(bfs(start, new Set()));*/

function makeGraph() {
	const visited = new Set();
	const queue = [ [ start, 0 ] ];
	const edges = [ [ start, -1, 0 ] ];

	while (queue.length > 0) {
		const [ v, i ] = queue.shift();
		const n = [...neighbors(v)].filter(w => !visited.has(w));
		visited.add(v);
		if (n.length === 1) {
			edges[i][1] = n[0];
			edges[i][2]++;
			queue.unshift([ n[0], i ]);
			continue;
		} else if (n.length > 1) {
			for (const nn of n) {
				edges.push([ v, nn, 1 ]);
				queue.push([ nn, edges.length - 1 ]);
			}
		}
	}

	// collapse
	while (edges.some(([,,w]) => w === 1)) {
		const ei = edges.findIndex(([,,w]) => w === 1);
		const [ s, e ] = edges[ei];

		// always end node has exactly 2 connections, but sanity check:
		if (edges.filter(([vs, ve]) => vs === e || ve === e).length !== 2) {
			console.log(edges);
			break;
		}

		const oi = edges.findIndex(([ns, ne]) => ns !== s && ne === e);
		edges[oi][2]++;
		edges[oi][1] = s;

		edges.splice(ei, 1);
		// edges[ei][2]--;
	}

	// construct graph
	const graph = new Map();

	edges.forEach(([s, e, w]) => {
		graph.set(s, (graph.get(s) ?? []).concat({ e, w }));
		graph.set(e, (graph.get(e) ?? []).concat({ e: s, w }));
	});

	return graph;
}

const graph = makeGraph();
// console.log(graph);

function bfs(n, visited) {
	let edges = graph.get(n).filter(({ e }) => !visited.has(e));
	return Math.max(0, ...edges.map(({ e, w }) => w + bfs(e, new Set([...visited, n]))));
}
console.log(bfs(start, new Set()));

// graphviz
const toPos=n=>`${n%width};${Math.floor(n/width)}`
let graphviz = "graph {layout=neato; model=mds; edge [len=2]\n";
for (const [n, e] of graph) {
	graphviz += `${n} [label="${toPos(n)}\\n${n}"]; ${e.filter(({ e }) => e > n).map(({ e, w }) => `${n} -- ${e} [label=${w}];`).join(" ")}\n`;
}
graphviz += "}";
writeFileSync("B.dot", graphviz);
/*
const vertices = new Set(edges.flatMap(([s, e]) => [s, e]));
console.log(grid.map((r, y) => r.split("").map((c, x) => vertices.has(x+y*width) ? "X" : c).join("")).join("\n"));*/