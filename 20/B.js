const { readFileSync, writeFileSync } = require("fs");

const contents = readFileSync("input.txt", { encoding: "utf-8" })
	.split("\n")
	.map(v => v.split(" -> "))
	.map(([ name, dest ]) => ([ "%&".includes(name[0]) ? [ name[0], name.substring(1) ] : [ "", name ], dest.split(", ") ]))
	.reduce((acc, [ [ type, name ], dest ]) => { acc[name] = { type, dest }; return acc; }, {});

// let graph = "digraph {\n  broadcaster [color=green];\n  rx [color=red];\n";
// for (const n in contents) {
// 	const { type, dest } = contents[n];
// 	graph += `  ${n} [label="${type}${n}"];\n`;
// 	for (const m of dest) {
// 		graph += `  ${n} -> ${m};\n`;
// 	}
// }
// graph += "}"
// writeFileSync("B.dot", graph);

const exit = Object.entries(contents).find(([, { dest } ]) => dest.includes("rx"))[0];

const preExit = Object.entries(contents).filter(([, { dest } ]) => dest.includes(exit)).map(([ name ]) => name);
preExit.forEach(n => contents[n].dest = []);

// const bigOnes = Object.entries(contents)
// 		.filter(([, { type }]) => type === "&")
// 		.filter(([, { dest: { length } }]) => length > 1)
// 		.map(([ name, { dest } ]) => ({ name, entry: dest.find(d => contents["broadcaster"].dest.includes(d)) }));

const flipFlopState = new Map(Object.entries(contents)
	.filter(([, { type }]) => type === "%")
	.map(([name]) => [ name, false ]));

const conjunctionMemory = new Map(Object.entries(contents)
	.filter(([, { type }]) => type === "&")
	.map(([name]) => [ 
		name, 
		Object.entries(contents)
			.filter(([, { dest }]) => dest.includes(name))
			.reduce((acc, [ name ]) => { acc[name] = false; return acc; }, {}),
		]));

function pushButton(modules = contents) {
	const pendingPulses = [ [ "broadcaster", false, "button" ] ];
	while (pendingPulses.length > 0) {
		const [ dest, isHigh, src ] = pendingPulses.shift();
		const mod = modules[dest];

		if (!mod) {
			continue;
		}

		if (mod.type === "") {
			for (const p of mod.dest) {
				pendingPulses.push([ p, isHigh, dest ]);
			}
			continue;
		} 
		if (mod.type === "%") {
			if (isHigh) {
				continue;
			}

			flipFlopState.set(dest, !flipFlopState.get(dest));
			for (const p of mod.dest) {
				pendingPulses.push([ p, flipFlopState.get(dest), dest ]);
			}
			continue;
		}
		if (mod.type === "&") {
			const mem = conjunctionMemory.get(dest);
			mem[src] = isHigh;
			const allHigh = Object.values(mem).every(v => v);
			conjunctionMemory.set(dest, mem);

			for (const p of mod.dest) {
				pendingPulses.push([ p, !allHigh, dest ]);
			}
		}
	}
}

function isReset() {
	return [...flipFlopState.values()].every(v => !v) &&
		[...conjunctionMemory.values()].every(m => Object.values(m).every(v => !v));
}

function stateToString() {
	// body...
	return [...flipFlopState.values()].map(v => v ? "+" : "-").join("") + ";" +
		[...conjunctionMemory.values()].map(m => Object.values(m).map(v => v ? "+" : "-").join("")).join(",");
}

// https://stackoverflow.com/a/34955386/8672525
function gcd(a, b) {
	if (!b) return b === 0 ? a : NaN;
	return gcd(b, a % b);
}

const broadcastDests = [...contents["broadcaster"].dest];

console.log(broadcastDests
	.map(d => {
		const queue = [ d ];
		const visited = new Set();
		const out = { "broadcaster": {...contents["broadcaster"]} };
		out["broadcaster"].dest = [ d ];
		while (queue.length > 0) {
			const n = queue.shift();
			out[n] = contents[n];
			visited.add(n);
			queue.push(...contents[n].dest.filter(v => !visited.has(v)));
		}
		return out;
	})
	.map(d => {
		const seenStates = new Map([ [ stateToString(), 0 ] ]);
		let n = 0;
		do {
			pushButton(d);
			const state = stateToString();
			n++;
			if (seenStates.has(state)) {
				n -= seenStates.get(state);
				break;
			}
			seenStates.set(state, n);
			if (n % 100000 === 0) console.log(`${n} ${stateToString()}`);
		} while (!isReset());
		return n;
	})
	.reduce((acc, val) => {
		return acc * val / gcd(acc, val);
	})
);
