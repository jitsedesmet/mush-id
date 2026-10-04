/// <reference types="@sveltejs/kit" />

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { immutable, assets, prerendered } from '$app/manifest';
import { version } from '$app/env';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

// Files in `static` the app itself never loads: install icons for each OS
// (fetched by the OS from the network when installing), the social preview
// image and the Google site verification file. Caching them only costs space.
const NOT_PRECACHED = /^(android|ios|windows11)\/|^og-image\.png$|^google[0-9a-f]+\.html$/;

// Manifest paths are relative to the base path; turn them into absolute
// pathnames so they can be compared against `url.pathname` below.
// Deduplicated: `prerendered` repeats static files fetched during prerendering,
// and `cache.addAll` rejects the whole install on duplicate requests.
const ASSETS = [...new Set([
    ...immutable,  // the app itself
    ...assets.filter((asset) => !NOT_PRECACHED.test(asset.path)), // `static`
    ...prerendered // prerendered pages such as `/`
].map(({ path }) => new URL(path, self.registration.scope).pathname))];

// SPA shell from adapter-static (`fallback: '404.html'`). It can render any
// route, so it is served for page loads that are not cached while offline.
const FALLBACK = new URL('404.html', self.registration.scope).pathname;

// OneZoom photos and the API answers that point to them. Kept across
// deployments so species you looked at before still have a photo offline.
// Images are cross-origin without CORS, so they are stored as opaque responses.
const PHOTOS = 'onezoom-photos';
const MAX_PHOTO_ENTRIES = 400;
const ONEZOOM = 'https://www.onezoom.org';

async function trimPhotos(cache) {
    const keys = await cache.keys(); // oldest first
    for (const request of keys.slice(0, Math.max(0, keys.length - MAX_PHOTO_ENTRIES))) {
        await cache.delete(request);
    }
}

async function respondOneZoom(event, url) {
    const cache = await caches.open(PHOTOS);
    const isImage = url.pathname.startsWith('/OZtree/static/');

    // Photos never change for a given URL: use the cached one if we have it.
    if (isImage) {
        const cached = await cache.match(event.request);
        if (cached) return cached;
    }

    try {
        const response = await fetch(event.request);
        if (response.ok || response.type === 'opaque') {
            event.waitUntil(cache.put(event.request, response.clone()).then(() => trimPhotos(cache)));
        }
        return response;
    } catch (error) {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        throw error;
    }
}

self.addEventListener('install', (event) => {
    // Create a new cache and add all files to it
    async function addFilesToCache() {
        const cache = await caches.open(CACHE);
        await cache.addAll([...ASSETS, FALLBACK]);
    }

    event.waitUntil(addFilesToCache());
});

// Sent by the update banner (src/lib/UpdateBanner.svelte) when the user
// chooses to load the new version.
self.addEventListener('message', (event) => {
    if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Remove previous cached data from disk
    async function deleteOldCaches() {
        for (const key of await caches.keys()) {
            if (key !== CACHE && key !== PHOTOS) await caches.delete(key);
        }
    }

    event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
    // ignore POST requests etc
    if (event.request.method !== 'GET') return;

    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin === ONEZOOM) {
        event.respondWith(respondOneZoom(event, requestUrl));
        return;
    }

    async function respond() {
        const url = new URL(event.request.url);
        const cache = await caches.open(CACHE);

        // `build`/`files` can always be served from the cache
        if (ASSETS.includes(url.pathname)) {
            return cache.match(url.pathname);
        }

        // for everything else, try the network first, but
        // fall back to the cache if we're offline
        try {
            const response = await fetch(event.request);

            if (response.status === 200) {
                cache.put(event.request, response.clone());
            }

            return response;
        } catch (error) {
            const cached = await cache.match(event.request);
            if (cached) return cached;

            // Offline load of a page we never cached (e.g. a reload on a
            // question with a new `?state=`): let the SPA shell render it.
            if (event.request.mode === 'navigate') {
                const fallback = await cache.match(FALLBACK);
                if (fallback) return fallback;
            }

            throw error;
        }
    }

    event.respondWith(respond());
});
