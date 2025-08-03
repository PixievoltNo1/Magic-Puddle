import { createRipple } from "./ripples.mjs";
import { quadrantWidth, quadrantHeight } from "./displayFitting.mjs";
import * as surprises from "./surprises.mjs";
import { draw, randomColor } from "./utils.mjs";
import { utils as animejsUtils } from "animejs";

let surpriseList = [...Object.values(surprises)];

let maxAutomations = 3;
let delayRange = [300, 5100];
let surpriseChance = 1/12;

var automationsInProgress = 0;
/* Flow of auto-rippling:
	- After the initial delay, start an automation
	- If the maximum number of automations has not yet been reached, start another automation after a standard delay
	- When the maximum number of automations has been reached, wait for one of them to finish, then start another automation after a standard delay
*/
function startAutomation() {
	if (Math.random() < surpriseChance && surpriseList.length) {
		var sequenceBuilder = draw(surpriseList);
		runSurprise(sequenceBuilder).then( () => {
			surpriseList.push(sequenceBuilder);
			endAutomation();
		} );
	} else {
		let x = Math.random() * quadrantWidth * 2 - quadrantWidth;
		let y = Math.random() * quadrantHeight * 2 - quadrantHeight;
		createRipple(randomColor(), 0.1 + Math.random() * 0.4, {x, y}).then(endAutomation);
	}

	automationsInProgress++;
	if (automationsInProgress < maxAutomations) { automationAfterDelay() };
}
function endAutomation() {
	if (automationsInProgress == maxAutomations) { automationAfterDelay() };
	automationsInProgress--;
}
function automationAfterDelay() {
	setTimeout(startAutomation, animejsUtils.random(...delayRange));
}
setTimeout(startAutomation, animejsUtils.random(100, 500));

export function runSurprise(surprise) {
	let waitTime = 0, completions = [];
	surprise(function ripple(color, speed, {x, y, delay = 0}) {
		delay += waitTime;
		let animation = createRipple(color, speed, {x, y, delay});
		completions.push(animation);
		return animation;
	}, function wait(time) {
		waitTime += time;
	});
	return Promise.all(completions);
}
export const getBusyness = window.getBusyness = function getBusyness() {
	return {maxAutomations, delayRange, surpriseChance};
}
export const setBusyness = window.setBusyness = function setBusyness(values) {
	let oldValues = getBusyness();
	({maxAutomations, delayRange, surpriseChance} = {...oldValues, ...values});
	if (oldValues.maxAutomations == automationsInProgress && maxAutomations > automationsInProgress) {
		automationAfterDelay();
	}
}

let surprisesGlobal = window.surprises = {};
for (let [name, surprise] in Object.entries(surprises)) {
	surprisesGlobal[name] = () => runSurprise(surprise);
}