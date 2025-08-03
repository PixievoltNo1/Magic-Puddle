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
		// Work around Itch v26 opening the donate page in the same window with no way back
		document.querySelector("#donate").href = "https://tinyurl.com/MagicPuddleDonate";
	}
}