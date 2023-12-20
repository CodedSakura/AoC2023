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
	const pendingPulses = [ [ "broadcaster", false, "button" ] ];
	while (pendingPulses.length > 0) {
		const [ dest, isHigh, src ] = pendingPulses.shift();
		const mod = contents[dest];

		// console.log(`${src} -${isHigh ? "high" : "low"}-> ${dest}`);
		if (dest === "rx" && !isHigh) {
			return true;
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

	return false;
}

let pushCount = 0;
while (!pushButton()) {
	if (pushCount % 100000 === 0) {
		console.log("processing push", pushCount);
	}
	pushCount++;
}

console.log(pushCount);
