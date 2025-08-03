import { animate } from "animejs";

var messageBox = document.querySelector("#messageBox");
export function showMessage(messageHtml) {
	document.querySelector("#message").innerHTML = messageHtml;
	messageBox.hidden = false;
	let distanceToOffscreen =
		document.documentElement.clientHeight - messageBox.getBoundingClientRect().y;
	animate(messageBox, { translateY: {from: distanceToOffscreen, to: 0}, duration: 400, ease: "outCubic" });
	// preventScroll prevents unneeded scrolling in the itch.io embed
	document.querySelector("#dismissMessage").focus({ preventScroll: true });
}
document.querySelector("#dismissMessage").addEventListener("click", () => {
	let distanceToOffscreen =
		document.documentElement.clientHeight - messageBox.getBoundingClientRect().y;
	animate(messageBox, {
		translateY: distanceToOffscreen,
		duration: 400,
		ease: "outCubic",
		onComplete() {
			messageBox.hidden = true;
			messageBox.style.transform = "";
		},
	});
});
