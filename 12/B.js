// B.hs was taking infinite time, due to bad memoization
// so i gave up and used JS

const { readFileSync } = require("fs");

const contents = readFileSync("input.txt", { encoding: "utf-8" }).split("\n");

const data = contents
	.map(v => v.split(" "))
	.map(([springs, numbers]) => [Array(5).fill(springs).join("?"), Array(5).fill(numbers).join(",")])
	.map(([springs, numbers]) => [springs, numbers.split(",").map(Number)])


function dpKey(s, l, c) {
	return s + l.join() + (c ? "t" : "f");
}


const dpMap = new Map();

function go(s, l, c = false) {
	const key = dpKey(s, l, c);
	if (dpMap.has(key)) {
		return dpMap.get(key);
	}

	let res = 0;
	if (s.length === 0) {
		if (l.length === 0) {
			res = 1;
		} else if (l.length === 1 && l[0] === 0) {
			res = 1;
		}
	} else if (s[0] === "?") {
		res = (go("."+s.substring(1), l, c))
			+ (go("#"+s.substring(1), l, c));
	} else if (s[0] === "#") {
		if (l.length === 0 || l[0] === 0) {
			res = 0;
		} else {
			res = go(s.substring(1), [l[0]-1, ...l.slice(1)], true);
		}
	} else {
		if (l.length === 0) {
			res = go(s.substring(1), l, false);
		} else if (l[0] === 0) {
			res = go(s.substring(1), l.slice(1), false);
		} else if (!c) {
			res = go(s.substring(1), l, false);
		}
	}
	dpMap.set(key, res);
	return res;
}

console.log(data.map(([s, l]) => go(s, l)).reduce((a, v) => a + v, 0));
