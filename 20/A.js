const { readFileSync } = require("fs");

const contents = readFileSync("input.txt", { encoding: "utf-8" })
	.split("\n")
	.map(v => v.split(" -> "))
	.map(([ name, dest ]) => ([ "%&".includes(name[0]) ? [ name[0], name.substring(1) ] : [ "", name ], dest.split(", ") ]))
	.reduce((acc, [ [ type, name ], dest ]) => { acc[name] = { type, dest }; return acc; }, {});

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

function pushButton() {
	let lowCount = 0, highCount = 0;
	const pendingPulses = [ [ "broadcaster", false, "button" ] ];
	while (pendingPulses.length > 0) {
		const [ dest, isHigh, src ] = pendingPulses.shift();
		const mod = contents[dest];

		// console.log(`${src} -${isHigh ? "high" : "low"}-> ${dest}`);
		if (isHigh) {
			highCount++;
		} else {
			lowCount++;
		}

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

	return { lowCount, highCount };
}

function isReset() {
	return [...flipFlopState.values()].every(v => !v) &&
		[...conjunctionMemory.values()].every(m => Object.values(m).every(v => !v));
}

let loopSize = 0;
let lowCount = 0, highCount = 0;
do {
	// console.log("processing push", loopSize);
	const res = pushButton();
	lowCount += res.lowCount;
	highCount += res.highCount;
	loopSize++;
} while (!isReset() && loopSize < 1000);

// console.log(loopSize, 1000 / loopSize)
console.log(lowCount * 1000 / loopSize * highCount * 1000 / loopSize);

