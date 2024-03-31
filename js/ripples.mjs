import { quadrantWidth, quadrantHeight, SVGCSSUnitRatio } from "./displayFitting.mjs";
import { svgElem, sign, randomColor } from "./utils.mjs";
import anime from "animejs";

const LINE_WIDTH = 3;

/**
 * - color may be any CSS color
 * - speed, x, and y are specified in SVG units; see displayFitting.mjs for the nitty-gritty
 * - delay is in ms
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
	return anime({
		targets: ripple, r: maxRadius,
		duration: time, easing: "linear", delay,
		complete() { document.querySelector("#puddle").removeChild(ripple) },
	});
}

document.addEventListener("pointerdown", function (event) {
	createRipple(randomColor(), 0.25, {
		x: event.clientX * SVGCSSUnitRatio - quadrantWidth,
		y: event.clientY * SVGCSSUnitRatio - quadrantHeight,
	});
});