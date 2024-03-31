import anime from "animejs";

var messageBox = document.querySelector("#messageBox");
export function showMessage(messageHtml) {
	document.querySelector("#message").innerHTML = messageHtml;
	messageBox.hidden = false;
	let distanceToOffscreen =
		document.documentElement.clientHeight - messageBox.getBoundingClientRect().y;
	messageBox.style.transform = `translateY(${distanceToOffscreen}px)`;
	anime({ targets: messageBox, translateY: 0, duration: 400, easing: "easeOutCubic" });
	// preventScroll prevents unneeded scrolling in the itch.io embed
	document.querySelector("#dismissMessage").focus({ preventScroll: true });
}
document.querySelector("#dismissMessage").addEventListener("click", () => {
	let distanceToOffscreen =
		document.documentElement.clientHeight - messageBox.getBoundingClientRect().y;
	anime({
		targets: messageBox, translateY: distanceToOffscreen, duration: 400, easing: "easeOutCubic",
		complete() {
			messageBox.hidden = true;
			messageBox.style.transform = "";
		},
	});
});
