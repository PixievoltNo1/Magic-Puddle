import { showMessage } from "./ui/messageBox.mjs";
import { isItchApp } from "./itch.mjs";

let offlineCheckbox = document.querySelector("#offline");
if (SITE != "itch" && navigator.serviceWorker) {
	navigator.serviceWorker.register("./serviceWorker.js").then(async (reg) => {
		let offlineEnabled = (await caches.keys()).some( (cacheName) => {
			return cacheName.startsWith("MagicPuddle-");
		} );
		// If the service worker isn't serving our files, it doesn't matter if it updates
		if (!offlineEnabled) { return; }
		// If the service worker is updating and the app just started, update!
		if (!reg.active) { return; }
		function newWorkerSwitch() {
			let newWorker = reg.installing || reg.waiting;
			if (!newWorker) { return false; }
			newWorker.postMessage({goActive: true});
			document.querySelector("#updating").hidden = false;
			newWorker.addEventListener("statechange", () => {
				if (newWorker.state == "activated") {
					location.reload();
				} else if (newWorker.state == "redundant") {
					document.querySelector("#updating").hidden = true;
					showMessage(`Couldn't update, possibly due to an unstable Internet connection.`);
				}
			});
			return true;
		}
		let isSwitching = newWorkerSwitch();
		if (!isSwitching) {
			reg.addEventListener("updatefound", newWorkerSwitch);
			setTimeout(() => reg.removeEventListener("updatefound", newWorkerSwitch), 3000);
		}
	});
	navigator.serviceWorker.ready.then( (reg) => {
		reg.active.postMessage({getState: true});
	});
	navigator.serviceWorker.addEventListener("message", (event) => {
		if (event.data.offlineReadiness) {
			if (event.data.offlineReadiness === "error") {
				showMessage("Couldn't become offline-ready, possibly due to an unstable Internet connection.");
				offlineCheckbox.checked = false;
			} else {
				offlineCheckbox.checked = event.data.offlineReadiness;
			}
		}
	});
	offlineCheckbox.addEventListener("input", () => {
		setOfflineReadiness(offlineCheckbox.checked);
	});
	window.addEventListener("appinstalled", () => setOfflineReadiness(true));
} else if (SITE != "itch") { // window.navigator is missing
	offlineCheckbox.addEventListener("input", () => {
		showMessage(`Couldn't become offline-ready, possibly due to your browser's privacy settings.`);
		offlineCheckbox.checked = false;
	});
} else {
	// If we're running in the browser instead of the app
	if (!isItchApp) {
		offlineCheckbox.addEventListener("input", (event) => {
			event.target.checked = false;
			showMessage(`To enjoy Magic Puddle offline, download it with the <a href="https://itch.io/app">Itch app</a>, or open it on <a href="https://pixievoltno1.com/web/MagicPuddle/">pixievoltno1.com</a> or <a href="https://magic-puddle.glitch.me/">Glitch</a> and check "Make Available Offline" there.`);
		});
	} else {
		offlineCheckbox.closest("label").hidden = true;
	}
}

async function setOfflineReadiness(enable) {
	let swRegistration = await navigator.serviceWorker.getRegistration();
	if (!swRegistration) {
		showMessage(`Couldn't become offline-ready, possibly due to an unstable Internet connection.`);
		return;
	}
	swRegistration.installing?.postMessage({setOfflineReadiness: enable});
	swRegistration.waiting?.postMessage({setOfflineReadiness: enable});
	swRegistration.active?.postMessage({setOfflineReadiness: enable});
	if (enable) {
		offlineCheckbox.indeterminate = true;
		offlineCheckbox.closest("label").classList.add("busy");
		navigator.serviceWorker.addEventListener("message", function cleanup(event) {
			if (event.data.offlineReadiness) {
				offlineCheckbox.indeterminate = false;
				offlineCheckbox.closest("label").classList.remove("busy");
				navigator.serviceWorker.removeEventListener("message", cleanup);
			}
		});
	}
}