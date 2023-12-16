
const { readFileSync } = require("fs");

const contents = readFileSync("input.txt", { encoding: "utf-8" })
	.split("\n");

function move(d, x, y) {
	switch (d) {
		case 'r':
			return [d, x+1, y];
		case 'l':
			return [d, x-1, y];
		case 'u':
			return [d, x, y-1];
		case 'd':
			return [d, x, y+1];
	}
}

function reflectCW(d) {
	switch (d) {
		case 'r':
			return 'u';
		case 'l':
			return 'd';
		case 'u':
			return 'r';
		case 'd':
			return 'l';
	}
}

function reflectCCW(d) {
	switch (d) {
		case 'r':
			return 'd';
		case 'l':
			return 'u';
		case 'u':
			return 'l';
		case 'd':
			return 'r';
	}
}

function beam(sd, sx, sy) {
	const visited = new Set();
	const positions = [[sd, sx, sy]];

	while (positions.length > 0) {
		const [d, x, y] = positions.pop();

		if (x < 0 || y < 0 || x >= contents[0].length || y >= contents.length) {
			continue;
		}

		const key = d + x + "," + y;
		
		if (visited.has(key)) {
			continue;
		}

		switch (contents[y][x]) {
			case '.':
				positions.push(move(d, x, y));
				break;
			case '|':
				if ('rl'.includes(d)) {
					positions.push(move('u', x, y));
					positions.push(move('d', x, y));
				} else {
					positions.push(move(d, x, y));
				}
				break;
			case '-':
				if ('ud'.includes(d)) {
					positions.push(move('l', x, y));
					positions.push(move('r', x, y));
				} else {
					positions.push(move(d, x, y));
				}
				break;
			case '/':
				positions.push(move(reflectCW(d), x, y));
				break;
			case '\\':
				positions.push(move(reflectCCW(d), x, y));
				break;
		}

		visited.add(key);
	}

	return new Set([...visited].map(v => v.substring(1))).size;
}

let max = 0;
for (let x = 0; x < contents[0].length; x++) {
	max = Math.max(max, beam('u', x, contents.length-1), beam('d', x, 0));
}
for (let y = 0; y < contents.length; y++) {
	max = Math.max(max, beam('l', contents[0].length-1, y), beam('r', 0, y));
} 
console.log(max);
