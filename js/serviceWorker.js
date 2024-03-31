"use strict";
const CACHE_MANIFEST = self.__WB_MANIFEST;
const CACHE_PREFIX = "MagicPuddle-";
let myCacheName = CACHE_PREFIX + CACHE_MANIFEST
	.map( (entry) => entry.revision ? entry.revision.slice(0, 8) : entry.url )
	.join("-");
async function setUpCache() {
	let requests = CACHE_MANIFEST.map( (entry) => {
		return new Request(entry.url, {cache: entry.revision ? "no-cache" : "force-cache"});
	} );
	let cache = await caches.open(myCacheName);
	await cache.addAll(requests);
}
self.addEventListener("install", (event) => {
	event.waitUntil( (async() => {
		let offlineEnabled = (await caches.keys()).some( (cacheName) => {
			return cacheName.startsWith(CACHE_PREFIX);
		} );
		if (offlineEnabled) {
			await setUpCache();
		}
	})() );
});
self.addEventListener("activate", (event) => {
	event.waitUntil( (async() => {
		await Promise.all( (await caches.keys()).map( (cacheName) => {
			if (cacheName.startsWith(CACHE_PREFIX) && cacheName != myCacheName) {
				return caches.delete(cacheName);
			}
		} ) );
	})() );
});
self.addEventListener("fetch", (event) => {
	event.respondWith( (async() => {
		if (!await caches.has(myCacheName)) { return fetch(event.request); }
		let cache = await caches.open(myCacheName);
		return cache.match(event.request);
	})() );
});
self.addEventListener("message", (event) => {
	event.waitUntil( (async() => {
		if ("setOfflineReadiness" in event.data) {
			if (event.data.setOfflineReadiness) {
				await setUpCache(); // TODO: Handle error
			} else {
				await caches.delete(myCacheName);
			}
			event.source.postMessage({offlineReadiness: event.data.setOfflineReadiness});
		}
		if ("goActive" in event.data) {
			self.skipWaiting();
		}
		if ("getState" in event.data) {
			event.source.postMessage({offlineReadiness: await caches.has(myCacheName)});
		}
	})() );
});