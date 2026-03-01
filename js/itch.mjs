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
		// Ensure links clicked open in the default browser, not the game window
		if (navigator.userAgent.includes(" itch/26.1.9")) {
			// Itch v26.1.9 opens only itch.io links in the game window, with no way to change this
			document.querySelector("#donate").href = "https://tinyurl.com/MagicPuddleDonate";
		} else { // Assume latest Itch version, v26.6.0
			// Itch v26.6.0 opens all links in the game window, but lets us change this
			let base = document.createElement("base");
			base.target = "_blank";
			document.head.append(base);
		}
	}
}