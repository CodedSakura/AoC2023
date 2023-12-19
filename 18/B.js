const { readFileSync, writeFileSync } = require("fs");

const contents = readFileSync("input.txt", { encoding: "utf-8" })
	.split("\n")
	.map(r => r.split(" "))
	.map(([, , c]) => [.../^\(#(.{5})(.)\)$/.exec(c)])
	.map(([, n, d]) => ["RDLU"[Number(d)], parseInt(n, 16)]);

// console.log(contents)

const pos = [0, 0];
const trench = [[...pos]];

for (const [dir, num] of contents) {
	switch (dir) {
	case "U":
		pos[1] -= num;
		break;

	case "D":
		pos[1] += num;
		break;

	case "R":
		pos[0] += num;
		break;

	case "L":
		pos[0] -= num;
		break;
	}
	trench.push([...pos]);
}

// https://www.mathopenref.com/coordpolygonarea.html
let areax2 = 0n;
for (let i = 0; i < trench.length; i++) {
	const j = (i + 1) % trench.length;
	const [ax, ay] = trench[i];
	const [bx, by] = trench[j];
	areax2 += BigInt(ax * by - ay * bx);
}
console.log(areax2 / 2n + BigInt(contents.map(([, n]) => n).reduce((a, v) => a + v) / 2 + 1));
