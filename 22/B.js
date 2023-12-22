const { readFileSync } = require("fs");

const contents = readFileSync("input.txt", { encoding: "utf-8" })
	.split("\n")
	.map(v => v.split("~").map(w => w.split(",").map(n => Number(n))))
	.map(([[ sx, sy, sz ], [ ex, ey, ez ]]) => [[ sx, sy, sz ], [ ex-sx, ey-sy, ez-sz ]])
	.sort(([[,,az]],[[,,bz]]) => az-bz);
// console.log(contents)
// console.log(contents.every(([,[x,y,z]])=>x>=0&&y>=0&&z>=0))

let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
contents.forEach(([[x,y,z],[dx,dy,dz]])=>{maxX=Math.max(maxX,x,x+dx);maxY=Math.max(maxY,y,y+dy);maxZ=Math.max(maxZ,z,z+dz)});
// console.log(maxX,maxY,maxZ);

const spaceTaken = new Array(maxZ+1).fill(0).map((_,z)=> new Array(maxY+1).fill(0).map(_=> new Array(maxX+1).fill(z===0?-1:0)));
// console.log(spaceTaken)

const supportedBy = new Map();

let index = 1;
for (const block of contents) {
	let [[ x, y, z ], [ dx, dy, dz ]] = block;
	// console.log(">", x, y, z, ">", dx, dy, dz)
	let canFall = true;
	while (canFall) {
		// only one of these will loop more than once
		outer:
		for (let oz = z; oz <= z+dz; oz++) {
		for (let oy = y; oy <= y+dy; oy++) {
		for (let ox = x; ox <= x+dx; ox++) {
			// console.log(ox, oy, oz);
			if (spaceTaken[oz-1][oy][ox]) {
				canFall = false;
				break outer;
			}
		}
		}
		}

		if (canFall) {
			z--;
		}
	}

	const indexUnder = new Set();

	// only one of these will loop more than once
	for (let oz = z; oz <= z+dz; oz++) {
	for (let oy = y; oy <= y+dy; oy++) {
	for (let ox = x; ox <= x+dx; ox++) {
		spaceTaken[oz][oy][ox] = index;
		indexUnder.add(spaceTaken[oz-1][oy][ox]);
	}
	}
	}
	block[0][2] = z;
	supportedBy.set(index, [...indexUnder].filter(v => v !== 0 && v !== index));
	index++;
	// console.log("<", x, y, z, ">", dx, dy, dz);
	// console.log()
}
// console.log(spaceTaken);
// console.log(supportedBy);

const supportedByEntries = [...supportedBy.entries()];

const supports = new Array(index-1)
	.fill(0)
	.map((_,i) => i)
	.map(n => supportedByEntries.filter(([,b]) => b.includes(n)).map(([k]) => k));
// console.log(supports);

console.log(supports
	.map((b,i) => b.length === 0 || b.every(n => supportedBy.get(n).some(n => n != i)))
	.map((v,i) => [v, i])
	.filter(([v]) => !v)
	.map(([_,n]) => {
		// console.log(n);
		const fallen = new Set([n]);
		const processed = new Set();
		const queue = [n];
		while (queue.length > 0) {
			const nn = queue.shift();
			if (processed.has(nn)) continue;

			const b = supports[nn] ?? [];
			// const s = supportedBy.get(nn)//.some(n => n != i)
			processed.add(nn);
			// console.log(">", n, nn, b)
			for (const bb of b) {
				if (processed.has(bb)) continue;
				if (supportedBy.get(bb).every(v => fallen.has(v))) {
					// console.log(">>>", bb)
					queue.push(bb);
					fallen.add(bb);
				}
			// 	if (processed.has(bb)) continue;
			// 	;
			}
		}
		// return count;
		return fallen.size - 1;
	})
	.reduce((a,v)=>a+v)
);
