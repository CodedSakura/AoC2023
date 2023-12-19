const { readFileSync, writeFileSync } = require("fs");

const contents = readFileSync("input.txt", { encoding: "utf-8" })
	.split("\0")
	.map(v => v.split("\n\n").map(w => w.split("\n")))
	.map(([ workflows, parts ]) => ({
		workflows: workflows
			.map(r => [.../^(.+){(.+)}$/.exec(r)])
			.map(([, name, rules]) => ({ 
				name, 
				rules: rules
					.split(",")
					.map(v => v.includes(":") ? [.../^(.+)([<>])(\d+):(.+)$/.exec(v)] : [v])
					.map(([v, n, c, a, w]) => w ? {
						var: n,
						compare: c,
						count: Number(a),
						workflow: w,
					} : v),
			}))
			.reduce((acc, { name, rules }) => { acc[name] = rules; return acc; }, {}),
		parts: parts
			.map(r => r.substring(1, r.length - 1).split(",").map(b => b.split("=")))
			.map(p => p.reduce((a, [n, v]) => { a[n] = Number(v); return a; }, {})),
	}))[0];

function processPart(part, workflow="in") {
	// console.log(workflow, contents.workflows[workflow])
	if (workflow === "A") {
		return true;
	} else if (workflow === "R") {
		return false;
	}
	for (const w of contents.workflows[workflow]) {
		if (typeof w === "string") {
			return processPart(part, w);
		}

		const { var: name, compare, count, workflow: ww } = w;
		const val = part[name];
		if (compare == ">") {
			if (val > count) {
				return processPart(part, ww);
			}
		} else {
			if (val < count) {
				return processPart(part, ww);
			}
		}
	}
	console.log(part);
}

console.log(contents.parts.filter(v => processPart(v)).reduce((a, v) => a + v.x + v.m + v.a + v.s, 0));
