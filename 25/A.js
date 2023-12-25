const { readFileSync, writeFileSync } = require("fs");

const contents = readFileSync("input.txt", { encoding: "utf-8" })
	.trim()
	.split("\n")
	.map(r => r.split(": "))
	.map(([a, b]) => [a, b.split(" ")])
	.reduce((map, [a, b]) => {
		map.set(a, new Set([...(map.get(a) ?? []), ...b]));
		b.forEach(v => {
			map.set(v, new Set([...(map.get(v) ?? []), a]));
		})
		return map;
	}, new Map());

// visually from graphviz
const disconnect = [
	["mfs", "ffv"],
	["ljh", "tbg"],
	["qnv", "mnh"],
	// test:
	["hfx", "pzl"],
	["bvb", "cmg"],
	["nvd", "jqt"],
];

disconnect.forEach(([a,b]) => {
	contents.get(a)?.delete(b);
	contents.get(b)?.delete(a);
});

function findConnected(v) {
	const nodes = new Set([ v ]);
	const queue = [ v ];
	while (queue.length > 0) {
		const n = queue.shift();
		for (const nn of contents.get(n)) {
			if (!nodes.has(nn)) {
				nodes.add(nn);
				queue.push(nn);
			}
		}
	}
	return nodes;
}

for (const [a, b] of disconnect) {
	if (!contents.has(a) || !contents.has(b)) continue;

	const aNodes = findConnected(a);
	const bNodes = findConnected(b);

	console.log(aNodes.size * bNodes.size);

	break;
}

let graphviz = "digraph {layout=neato;edge[len=2]\n";
[...contents].forEach(([k,v])=>{
	graphviz += `${[...v].map(w=>`${k}->${w};`).join(" ")}\n`;
});
graphviz += "}";
writeFileSync("a.dot", graphviz);


// console.log(contents);
