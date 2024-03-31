export var quadrantWidth, quadrantHeight, SVGCSSUnitRatio;

/** The SVG canvas is set up with the (0,0) point in the center. Its area is based on the screen
 * size in CSS pixels and scaled according to these rules in order of precedence:
 * 1. Each dimension must be no less than 500 CSS pixels.
 * 2. The area must be no larger than 1,000,000 CSS pixels.
 */
const MAX_AREA = 1_000_000, MIN_QUADRANT_WIDTH = 500 / 2, MIN_QUADRANT_HEIGHT = 500 / 2;

function displaySetup() {
	var area = Math.min(window.innerWidth * window.innerHeight, MAX_AREA);
	var screenRatio = window.innerWidth / window.innerHeight;
	quadrantWidth = Math.sqrt(screenRatio) * Math.sqrt(area) / 2;
	quadrantHeight = Math.sqrt(1 / screenRatio) * Math.sqrt(area) / 2;

	if (quadrantWidth < MIN_QUADRANT_WIDTH) {
		quadrantHeight *= MIN_QUADRANT_WIDTH / quadrantWidth;
		quadrantWidth = MIN_QUADRANT_WIDTH;
	} else if (quadrantHeight < MIN_QUADRANT_HEIGHT) {
		quadrantWidth *= MIN_QUADRANT_HEIGHT / quadrantHeight;
		quadrantHeight = MIN_QUADRANT_HEIGHT;
	}

	// For translating lengths from SVG units into HTML/CSS pixels
	SVGCSSUnitRatio = quadrantWidth / (window.innerWidth / 2);

	// Now actually set up the display!
	document.querySelector("#puddle").setAttribute("viewBox",
		`${-quadrantWidth} ${-quadrantHeight} ${quadrantWidth * 2} ${quadrantHeight * 2}`);
}
displaySetup();
window.onresize = displaySetup;