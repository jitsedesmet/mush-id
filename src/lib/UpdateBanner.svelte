<script lang="ts">
    import { onMount } from "svelte";

    // A new service worker that is installed but waiting for this one to let go.
    let waiting: ServiceWorker | null = $state(null);
    let reloading = false;

    onMount(() => {
        if (!("serviceWorker" in navigator)) return;
        const sw = navigator.serviceWorker;

        function watch(registration: ServiceWorkerRegistration) {
            // Only an update when a worker already controls the page; the first install is not.
            if (registration.waiting && sw.controller) waiting = registration.waiting;
            registration.addEventListener("updatefound", () => {
                const installing = registration.installing;
                installing?.addEventListener("statechange", () => {
                    if (installing.state === "installed" && sw.controller) waiting = installing;
                });
            });
        }

        // An app left open never navigates, so the browser would not look for a
        // new version by itself. Check whenever it comes back to the foreground.
        function checkForUpdate() {
            if (document.visibilityState === "visible") sw.getRegistration().then(r => r?.update()).catch(() => {});
        }

        // Reload once the new worker has taken over, so page and cache match.
        function onControllerChange() {
            if (reloading) return;
            reloading = true;
            location.reload();
        }

        sw.ready.then(watch);
        sw.addEventListener("controllerchange", onControllerChange);
        document.addEventListener("visibilitychange", checkForUpdate);
        return () => {
            sw.removeEventListener("controllerchange", onControllerChange);
            document.removeEventListener("visibilitychange", checkForUpdate);
        };
    });

    function update() {
        waiting?.postMessage({ type: "SKIP_WAITING" });
    }
</script>

{#if waiting}
    <div class="update" role="status">
        <span>Nieuwe versie beschikbaar.</span>
        <button type="button" onclick={update}>Herladen</button>
    </div>
{/if}

<style>
    .update {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        max-width: 720px;
        margin: 0 auto;
        padding: 4px 0 8px;
        font-size: 0.92em;
    }

    button {
        min-height: 40px;
        padding: 0 14px;
        border: 1px solid var(--c-primary);
        border-radius: var(--radius-md);
        background: var(--c-primary);
        color: #fff;
        font-weight: 500;
        cursor: pointer;
    }

    button:hover {
        background: var(--c-primary-dark);
    }
</style>
