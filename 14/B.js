

const { readFileSync } = require("fs");

const contents = readFileSync("input.txt", { encoding: "utf-8" })
	.split("\n");

function transpose(arr) {
	return Array.from(arr[0], (_, i) => arr.map(row => row[i]).join(""));
}

const northMap = new Map();
const southMap = new Map();
const eastMap = new Map();
const westMap = new Map();
const cycleMap = new Map();
const cycleShortcutMap = new Map();
const cycleShortcutSet = new Set();

function sortRow(r) {
	return r.split("").sort((a, b) => a == 'O' ? -1 : 1).join("");
}
function sortRowReverse(r) {
	return r.split("").sort((a, b) => a == 'O' ? 1 : -1).join("");
}

function tiltNorth(arr) {
	const key = arr.join();

	if (northMap.has(key)) {
		return northMap.get(key);
	}

	const res = transpose(
		transpose(arr)
			.map(v => v.split("#").map(sortRow).join("#"))
	);

	northMap.set(key, res);
	return res;
}

function tiltSouth(arr) {
	const key = arr.join();

	if (southMap.has(key)) {
		return southMap.get(key);
	}

	const res = transpose(
		transpose(arr)
			.map(v => v.split("#").map(sortRowReverse).join("#"))
	);
	
	southMap.set(key, res);
	return res;
}

function tiltEast(arr) {
	const key = arr.join();

	if (eastMap.has(key)) {
		return eastMap.get(key);
	}

	const res = arr.map(v => v.split("#").map(sortRowReverse).join("#"));
	
	eastMap.set(key, res);
	return res;
}

function tiltWest(arr) {
	const key = arr.join();

	if (westMap.has(key)) {
		return westMap.get(key);
	}

	const res = arr.map(v => v.split("#").map(sortRow).join("#"));
	
	westMap.set(key, res);
	return res;
}

let n = 1000000000;
function cycle(arr) {
	const key = arr.join();

	if (cycleShortcutMap.has(key)) {
		return cycleShortcut(key);
	}

	if (cycleMap.has(key)) {
		return cycleMap.get(key);
	}

	const res = tiltEast(tiltSouth(tiltWest(tiltNorth(arr))));

	cycleMap.set(key, res);
	cycleShortcutMap.set(key, res.join());
	n -= 1;
	return res;
}

function cycleShortcut(key) {
	let pKey = key;
	while (cycleShortcutMap.has(key) && n > 0) {
		pKey = key;
		key = cycleShortcutMap.get(key);
		n -= 1;

		if (cycleShortcutSet.has(key)) {
			while (n > cycleShortcutSet.size) {
				n -= cycleShortcutSet.size;
			}
		}
		cycleShortcutSet.add(key);
	}
	return cycleMap.get(pKey);
}

function calcWeight(arr) {
	return arr
		.map((v, i) => (arr.length - i) * (v.match(/O/g) ?? []).length)
		.reduce((a, b) => a + b, 0);
}

let arr = [...contents];
while (n > 0) {
	arr = cycle(arr);
}

// console.log(arr.join("\n"))
console.log(calcWeight(arr))
