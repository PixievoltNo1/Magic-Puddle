import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import copy from "@guanghechen/rollup-plugin-copy";
import {injectManifest, getManifest} from "workbox-build";

/** @type {import("rollup").PluginImpl} */
function serviceWorkerPlugin() {
	return {
		name: "service-worker",
		buildStart() { this.addWatchFile("js/serviceWorker.js"); },
		async writeBundle(options) {
			let buildDir = options.dir;
			let rollupEntries = (await getManifest({
				globDirectory: buildDir,
				globPatterns: ["magicPuddle.js"],
			})).manifestEntries;
			let homeRollupPlugin = options.plugins.find( ({name}) => name == "homeRollup" );
			if (homeRollupPlugin) {
				rollupEntries.push(...homeRollupPlugin.api.externalFileUrls);
			}
			await injectManifest({
				swSrc: "js/serviceWorker.js",
				swDest: buildDir + "/serviceWorker.js",
				globDirectory: ".",
				globPatterns: ["*.{html,woff,svg,css}", "app.webmanifest"],
				dontCacheBustURLsMatching: /\.v\d/,
				manifestTransforms: [(manifest) => {
					let htmlEntry = manifest.find( ({url}) => url.includes("MagicPuddle.html") );
					htmlEntry.url = ".";
					return {manifest};
				}],
				additionalManifestEntries: rollupEntries,
			});
		},
	}
}

export default async function buildJs({configSite: site}) {
	/** @type {import('rollup').RollupOptions} */
	var rollupOptions = {
		input: "js/magicPuddle.mjs",
		plugins: [
			(site == "home") && (await import("../../homeRollup.mjs")).default(),
			nodeResolve({ browser: true }),
			replace({SITE: `"${site}"`}),
			(site != "home") && copy({targets: [
				{ src: "MagicPuddle.html", rename: "index.html", dest: "build" },
				{ src: ["*.{woff,svg,css}"], dest: "build" }
			]}),
			(site == "glitch") && copy({targets: [
				{ src: ["app.webmanifest", "screenshot.png"], dest: "build" }
			]}),
			terser(),
			(site != "itch") && serviceWorkerPlugin(),
		],
		output: {
			dir: (site == "home") ? "." : "build",
			sourcemap: site != "itch",
			sourcemapExcludeSources: true,
			generatedCode: "es2015",
		},
	};
	return rollupOptions;
}