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

function processWorkflow(wf, lo = {x: 1, m: 1, a: 1, s: 1}, hi = {x: 4000, m: 4000, a: 4000, s: 4000}) {
	// console.log(wf, lo, hi);
	let accepted = 0;
	const total = (hi.x - lo.x + 1) * (hi.m - lo.m + 1) * (hi.a - lo.a + 1) * (hi.s - lo.s + 1);

	if (wf === "A") {
		return [total, total];
	} else if (wf === "R") {
		return [0, total];
	}

	for (const w of contents.workflows[wf]) {
		if (typeof w === "string") {
			const [acc] = processWorkflow(w, lo, hi);
			accepted += acc;
			continue;
		}

		const { var: name, compare, count, workflow: ww } = w;
		const blo = {...hi};
		const bhi = {...lo};
		if (compare === "<") {
			if (count < hi[name]) bhi[name] = count;
			if (count > lo[name]) blo[name] = count-1;
			const [acc] = processWorkflow(ww, lo, blo);
			accepted += acc;
			lo = bhi;
		} else {
			if (count < hi[name]) bhi[name] = count+1;
			if (count > lo[name]) blo[name] = count;
			const [acc] = processWorkflow(ww, bhi, hi);
			accepted += acc;
			hi = blo;
		}
	}

	return [accepted, total];
}

console.log(processWorkflow("in")[0])
