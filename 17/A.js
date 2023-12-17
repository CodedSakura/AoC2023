const { readFileSync } = require("fs");

const contents = readFileSync("input.txt", { encoding: "utf-8" })
	.split("\n")
	.map(v => v.split("").map(w => Number(w)));

const width = contents[0].length,
	height = contents.length;

function dist(from, to) {
	function neigbors([x, y, d]) {
		return [
			[x+1, y, 0],
			[x+2, y, 0],
			[x+3, y, 0],
			[x-1, y, 1],
			[x-2, y, 1],
			[x-3, y, 1],
			[x, y+1, 2],
			[x, y+2, 2],
			[x, y+3, 2],
			[x, y-1, 3],
			[x, y-2, 3],
			[x, y-3, 3],
		]
			.filter(([,, nd]) => nd !== d && nd !== (d ^ 1))
			.filter(([x, y]) => x >= 0 && x < width && y >= 0 && y < height)
	}

	function weight(u, v) {
		let sum = 0;
		const [dx, dy] = [v[0]-u[0], v[1]-u[1]];
		for (let x = 0; x < Math.abs(dx); x++) {
			sum += contents[v[1]][v[0]-x*Math.sign(dx)];
		}
		for (let y = 0; y < Math.abs(dy); y++) {
			sum += contents[v[1]-y*Math.sign(dy)][v[0]];
		}
		return sum;
	}

	function dirToChar(d) {
		return "><v^"[d];
	}

	const dist = new Array(height).fill(0).map(_ => new Array(width).fill(0).map(_ => new Array(4).fill(Infinity)));
	const prev = new Array(height).fill(0).map(_ => new Array(width).fill(0).map(_ => new Array(4).fill(undefined)));
	let queue = new Array(width * height * 4).fill(0).map((_, i) => [Math.floor(i / 4) % height, Math.floor(i / height / 4), i % 4]);

	dist[from[1]][from[0]][0] = 0;
	dist[from[1]][from[0]][1] = 0;
	dist[from[1]][from[0]][2] = 0;
	dist[from[1]][from[0]][3] = 0;

	let lastStatus = 0;
	let lastQueue = queue.length;


	while (queue.length > 0) {
		let minDist = Infinity;
		let u = undefined;
		for (const [x, y, d] of queue) {
			if (dist[y][x][d] < minDist) {
				minDist = dist[y][x][d];
				u = [x, y, d];
			}
		}
		if (!u) {
			break;
		}
		queue = queue.filter(a => a[0] !== u[0] || a[1] !== u[1] || a[2] !== u[2]);

		if (lastStatus + 5000 < Date.now()) {
			console.log(new Date(), `queue: ${queue.length}, processed: ${lastQueue - queue.length} (approx ${(lastQueue - queue.length) / 5}/s or ${(5000/(lastQueue - queue.length)).toFixed(3)}ms/item)`);
			lastStatus = Date.now();
			lastQueue = queue.length;
		}

		for (const v of neigbors(u)) {
			if (!queue.some(a => a[0] === v[0] && a[1] === v[1] && a[2] === v[2])) {
				continue;
			}

			alt = dist[u[1]][u[0]][u[2]] + weight(u, v);
			if (alt < dist[v[1]][v[0]][v[2]]) {
				dist[v[1]][v[0]][v[2]] = alt;
				prev[v[1]][v[0]][v[2]] = u;
			}
		}
	}
	
	const path = [];
	let u = to;
	while (u) {
		path.unshift(u);
		u = prev[u[1]][u[0]][u[2]];
	}

	// console.log(path)

	// console.log(contents.map((row, y) => row.map((v, x) => {
	// 	const f = path.find(a => a[0] == x && a[1] == y);
	// 	return f ? dirToChar(f[2]) : v.toString()
	// }).join("")).join("\n"));
	// console.log(dist[to[1]][to[0]]);
	console.log(Math.min(...dist[to[1]][to[0]]));
}

dist([0, 0], [width-1, height-1, 2]);
