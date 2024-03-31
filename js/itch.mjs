import { showMessage } from "./ui/messageBox.mjs";

export const isItchApp = SITE == "itch" && !location.protocol.startsWith("http");

if (SITE == "itch") {
	if (!isItchApp) {
		let base = document.createElement("base");
		base.target = "_blank";
		document.head.append(base);
		if (navigator.userAgent.includes("Mobile")) {
			// itch.io launched the app in a fullscreen iframe, we can't control it
			document.querySelector("#fullscreen").disabled = true;
		}
	} else {
		if (navigator.userAgent.includes(" itch/25")) {
			let stylesheet = new CSSStyleSheet();
			stylesheet.insertRule(".disableFocusRing :focus { outline: none; }");
			document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
			let bodyClasses = document.body.classList;
			document.addEventListener("pointerdown", () => bodyClasses.add("disableFocusRing"));
			document.addEventListener("keydown", () => bodyClasses.remove("disableFocusRing"));
			document.addEventListener("click", (event) => {
				let {target} = event;
				if (!(target instanceof HTMLAnchorElement)) {return;}
				event.preventDefault();
				navigator.clipboard.writeText(target.href);
				showMessage(`This link's URL has been copied to your clipboard. Paste it your browser's address bar!`)
			});
		}
	}
}