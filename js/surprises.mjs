import { quadrantWidth, quadrantHeight } from "./displayFitting.mjs";
import { hsl } from "./utils.mjs";

/**
 * Surprises are functions that create sequences of ripples. Export them from here to register them
 * for automatic random surprises. Registered surprises can also be run by entering
 * surprises.yourSurpriseName() in your browser's developer console.
 * @callback Surprise
 * @param {typeof import("./ripples.mjs").createRipple} ripple - Same as createRipple, but
 * associates the ripple with the surprise and applies any wait calls.
 * @param {function(number)} wait - Adds delay to future ripple calls until the surprise returns.
 */

/** @type {Surprise} */
export function vennRipple(ripple) {
	var centerX = Math.random() * (quadrantWidth * 2 - 400) - quadrantWidth + 200;
	var centerY = Math.random() * (quadrantHeight * 2 - 400) - quadrantHeight + 200;
	var angle = Math.random() * 2 * Math.PI;
	var {sin, cos} = Math;
	ripple(hsl(162, 100, 70), 0.2, {x: centerX + cos(angle) * 160, y: centerY + sin(angle) * 160});
	ripple(hsl(162, 100, 70), 0.2, {x: centerX - cos(angle) * 160, y: centerY - sin(angle) * 160});
	ripple(hsl(124, 100, 63), 0.2, {x: centerX, y: centerY, delay: 800});
}
/** @type {Surprise} */
export function sineSnake(ripple, wait) {
	// Possible future alteration: Replace this with something that creates ripples along an SVG path
	var x = (0 - quadrantWidth) + Math.random() * 120;
	var theta = Math.random() * 2 * Math.PI;
	do {
		ripple(hsl(302, 100, 56), 0.2, {x, y: Math.sin(theta) * quadrantHeight * 4 / 5});
		wait(400);
		x += 120;
		theta += Math.PI / 6;
	} while (x <= quadrantWidth);
}
/** @type {Surprise} */
export function rainbowBurst(ripple) {
	var x = Math.random() * (quadrantWidth * 2 - 200) - quadrantWidth + 100;
	var y = Math.random() * (quadrantHeight * 2 - 200) - quadrantHeight + 100;
	for (var i = 0; i < 12; ++i) {
		ripple(hsl(i * 30, 100, 60), 0.2, {x, y, delay: 150 * i});
	}
}
/** @type {Surprise} */
export function echoes(ripple, wait) {
	var startSide = Math.floor(Math.random() * 2) * 2 - 1;
	var offset = quadrantWidth * 4 / 3;
	for (var i = 0; i < 3; ++i) {
		ripple(hsl(29, 100, 70), quadrantWidth / 1000, {x: startSide * offset, y: 0});
		ripple(hsl(209, 100, 70), quadrantWidth / 1000, {x: -startSide * offset, y: 0, delay: 600});
		wait(1200);
	}
}