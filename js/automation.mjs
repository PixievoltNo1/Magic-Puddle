import { createRipple } from "./ripples.mjs";
import { quadrantWidth, quadrantHeight } from "./displayFitting.mjs";
import * as surprises from "./surprises.mjs";
import { draw, randomColor } from "./utils.mjs";

let surpriseList = [...Object.values(surprises)];

var automationsInProgress = 0;
/* Flow of auto-rippling:
	- After the initial delay, start an automation
	- If the maximum number of automations has not yet been reached, start another automation after a standard delay
	- When the maximum number of automations has been reached, wait for one of them to finish, then start another automation after a standard delay
*/
function startAutomation() {
	if (Math.random() > 0.9) {
		var sequenceBuilder = draw(surpriseList);
		runSurprise(sequenceBuilder).then( () => {
			surpriseList.push(sequenceBuilder);
			endAutomation();
		} );
	} else {
		let x = Math.random() * quadrantWidth * 2 - quadrantWidth;
		let y = Math.random() * quadrantHeight * 2 - quadrantHeight;
		createRipple(randomColor(), 0.1 + Math.random() * 0.4, {x, y}).finished.then(endAutomation);
	}

	automationsInProgress++;
	if (automationsInProgress < 2) { automationAfterDelay() };
}
function endAutomation() {
	if (automationsInProgress == 2) { automationAfterDelay() };
	automationsInProgress--;
}
function automationAfterDelay() {
	setTimeout(startAutomation, 500 + Math.random() * 5000);
}
setTimeout(startAutomation, 100 + Math.random() * 400);

export function runSurprise(surprise) {
	let waitTime = 0, completions = [];
	surprise(function ripple(color, speed, {x, y, delay = 0}) {
		delay += waitTime;
		let animation = createRipple(color, speed, {x, y, delay});
		completions.push(animation.finished);
	}, function wait(time) {
		waitTime += time;
	});
	return Promise.all(completions);
}

let surprisesGlobal = window.surprises = {};
for (let [name, surprise] in Object.entries(surprises)) {
	surprisesGlobal[name] = () => runSurprise(surprise);
}