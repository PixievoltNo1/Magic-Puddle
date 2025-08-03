import { animate } from "animejs";
import { optionsVisible } from "./options.mjs";

let titleCard = document.querySelector("#titleCard");

let toLoad = [document.fonts.ready];
toLoad.push( fetch("titleCardButtons.v1.svg").then( (response) => response.text() ) );
Promise.all(toLoad).then( () => {
	let titleCardHolder = document.querySelector("#titleCardHolder");
	let {width, height} = titleCard.getBoundingClientRect();
	titleCardHolder.setAttribute("width", width);
	titleCardHolder.setAttribute("height", height);
	titleCardHolder.setAttribute("viewBox", `0 0 ${width} ${height}`);
	titleCardHolder.querySelector("foreignObject").append(titleCard);
	titleCard.style.visibility = null;
} );

var titleCardVisibility = "visible";
let titleCardTimeout;
function setTitleCardTimeout() {
	if (titleCardTimeout) {
		clearTimeout(titleCardTimeout);
	}
	titleCardTimeout = setTimeout(function () {
		if (titleCardVisibility != "visible" || optionsVisible) { return; }
		titleCardVisibility = "invisible";
		animate(titleCard, { opacity: 0, duration: 400, ease: "inOutQuad" });
	}, 5500);
}
setTitleCardTimeout();
function wakeTitleCard() {
	if (titleCardVisibility == "invisible") {
		titleCardVisibility = "appearing";
		animate(titleCard, {
			opacity: 1,
			duration: 300,
			ease: "inOutQuad",
			complete() {
				titleCardVisibility = "visible";
				setTitleCardTimeout();
			},
		});
	}
	if (titleCardVisibility == "visible") {
		setTitleCardTimeout();
	}
}
document.addEventListener("pointermove", wakeTitleCard);
document.addEventListener("pointerdown", wakeTitleCard);
document.addEventListener("keydown", wakeTitleCard);

// #optionsButton handled in options.mjs

let fullscreenButton = document.querySelector("#fullscreen");
fullscreenButton.addEventListener("click", () => {
	if (!document.fullscreenElement) {
		document.body.requestFullscreen();
	} else {
		document.exitFullscreen();
	}
});
document.addEventListener("fullscreenchange", () => {
	fullscreenButton.ariaPressed = Boolean(document.fullscreenElement);
});