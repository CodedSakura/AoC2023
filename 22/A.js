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
	.map((_,i) => i+1)
	.map(n => supportedByEntries.filter(([,b]) => b.includes(n)).map(([k]) => k));

console.log(supports
	.map((b,i) => b.length === 0 || b.every(n => supportedBy.get(n).some(n => n != i+1)))
	.filter(v => v).length
);
