export function svgElem(name) {
	return document.createElementNS("http://www.w3.org/2000/svg", name);
}

// This returns 1 for 0 for consistency's sake
export function sign(num) {
	return (num < 0 ? -1 : 1);
}

// Draws from an array as though it were a shuffled deck of cards
export function draw(array) {
	return (array.splice(Math.floor(Math.random() * array.length), 1))[0];
}

export function randomColor() {
	return hsl(Math.random() * 360, 100, 64);
}

export function hsl(H, S, L) {
	return `hsl(${H}, ${S}%, ${L}%)`;
};