import { quadrantWidth, quadrantHeight, SVGCSSUnitRatio } from "./displayFitting.mjs";
import { svgElem, sign, randomColor } from "./utils.mjs";
import { animate } from "animejs";

const LINE_WIDTH = 3;

/**
 * Creates & animates a ripple. See displayFitting.mjs for how SVG units relate to CSS pixels.
 * @param {string} color - May be any CSS color value
 * @param {number} speed - Written in SVG units per millisecond. Values under 1 are recommended.
 * @param {Object} details
 * @param {number} details.x - Written in SVG units, 0 = center, increasing = rightwards
 * @param {number} details.y - Written in SVG units, 0 = center, increasing = downwards
 * @param {number} [details.delay] - Written in milliseconds
 * @returns {import("animejs").JSAnimation} The ripple's Anime.js animation
 */
export function createRipple(color, speed, { x, y, delay = 0 }) {
	// Calculate the greatest size that the ripple can be and still be partially visible
	var oppositeCornerX = sign(x) * -1 * quadrantWidth;
	var oppositeCornerY = sign(y) * -1 * quadrantHeight;
	var maxRadius = Math.sqrt( Math.pow(oppositeCornerX - x, 2) + Math.pow(oppositeCornerY - y, 2) )
		+ LINE_WIDTH / 2;

	// Now to create & animate the ripple!
	var ripple = svgElem("circle");
	ripple.setAttribute("cx", x); ripple.setAttribute("cy", y);
	ripple.style.fill = "none"; ripple.style.stroke = color;
	ripple.style.strokeWidth = LINE_WIDTH;
	document.querySelector("#puddle").appendChild(ripple);
	var time = maxRadius / speed;
	return animate(ripple, {
		r: maxRadius, duration: time, ease: "linear", delay, onComplete() { ripple.remove(); },
	});
}

document.addEventListener("pointerdown", function (event) {
	createRipple(randomColor(), 0.25, {
		x: event.clientX * SVGCSSUnitRatio - quadrantWidth,
		y: event.clientY * SVGCSSUnitRatio - quadrantHeight,
	});
});