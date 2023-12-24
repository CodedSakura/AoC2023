const { readFileSync } = require("fs");

const contents = readFileSync("input.txt", { encoding: "utf-8" })
	.split("\n")
	.map(v => v.split("@").map(v => v.trim().split(",").map(v => Number(v.trim()))));
// const testArea = [ [ 7, 7 ], [ 27, 27 ] ];
const testArea = [ [ 200000000000000, 200000000000000 ], [ 400000000000000, 400000000000000 ] ];

let count = 0;
contents.forEach((h1, i) => {
	for (let k = i+1; k < contents.length; k++) {
		const h2 = contents[k];

		const inter = getRaysIntersection(...h1, ...h2);
		if (!inter) continue;

		if (inter[0] >= testArea[0][0] && inter[0] <= testArea[1][0] &&
			inter[1] >= testArea[0][1] && inter[1] <= testArea[1][1]) {
			count++;
		}
	}
});
console.log(count);

// https://stackoverflow.com/a/67142908/8672525
function getRaysIntersection(p0, n0, p1, n1) {
  const dx = p1[0] - p0[0];
  const dy = p1[1] - p0[1];
  const det = n1[0] * n0[1] - n1[1] * n0[0];
  const u = (dy * n1[0] - dx * n1[1]) / det;
  const v = (dy * n0[0] - dx * n0[1]) / det;
  if (u < 0 || v < 0) return undefined; // Might intersect as lines, but as rays.

  const m0 = n0[1] / n0[0];
  const m1 = n1[1] / n1[0];
  const b0 = p0[1] - m0 * p0[0];
  const b1 = p1[1] - m1 * p1[0];
  const x = (b1 - b0) / (m0 - m1);
  const y = m0 * x + b0;

  return Number.isFinite(x) ? [x, y] : undefined;
}

// console.log(contents);