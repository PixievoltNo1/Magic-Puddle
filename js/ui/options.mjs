import { animate } from "animejs";
import * as idb from "idb-keyval";

let optionsButton = document.querySelector("#optionsButton");
let optionsLayer = document.querySelector("#optionsLayer");
optionsButton.addEventListener("click", toggleOptions);
export let optionsVisible = false;
function toggleOptions() {
	optionsVisible = optionsButton.ariaPressed = (optionsButton.ariaPressed != "true");
	optionsLayer.hidden = false;
	let distanceToOffscreen =
		document.documentElement.clientHeight - optionsLayer.getBoundingClientRect().y;
	if (optionsVisible) {
		animate(optionsLayer, {
			translateY: {from: distanceToOffscreen, to: 0},
			duration: 400,
			ease: "outCubic",
			onComplete() { optionsLayer.inert = false; }
		});
	} else {
		optionsLayer.inert = true;
		animate(optionsLayer, {
			translateY: distanceToOffscreen,
			duration: 400,
			ease: "outCubic",
			onComplete() {
				optionsLayer.hidden = true;
				optionsLayer.style.transform = "";
			}
		});
	}
}
document.querySelector("#closeOptions").addEventListener("click", toggleOptions);

let prefsStore = idb.createStore("MagicPuddle", "prefs");
document.querySelector("#blackBg").addEventListener("input", (event) => {
	document.body.classList.toggle("blackBg", event.target.checked);
	idb.set("blackBg", event.target.checked, prefsStore);
});
idb.get("blackBg", prefsStore).then((wantsBlackBg) => {
	if (wantsBlackBg) {
		document.body.classList.add("blackBg");
		document.querySelector("#blackBg").checked = true;
	}
});

// #offline is handled in offlineReadiness.mjs