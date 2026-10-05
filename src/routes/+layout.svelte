<script lang="ts">
    import type { Snippet } from "svelte";
    import { page } from "$app/state";
    import { asset, resolve } from "$app/paths";
    import UpdateBanner from "#lib/UpdateBanner.svelte";
    // Starts listening for the browser's install prompt as soon as the app loads.
    import "#lib/install.svelte.js";

    let { children }: { children: Snippet } = $props();

    const path = $derived(page.url.pathname);
</script>

<header class="site-header">
    <div class="header-inner">
        <a href={resolve("/")} class="brand" aria-label="Mush-ID home">
            <img src={asset('logo.png')} class="brand-logo" alt="" />
            <span class="brand-name">Mush-ID</span>
        </a>
        <nav>
            <a href={resolve("/9789050117548/soorten")}
               aria-current={path.startsWith("/9789050117548/soorten") ? "page" : undefined}>Soorten</a>
            <a href={resolve("/saved")}
               aria-current={path.startsWith("/saved") ? "page" : undefined}>Opgeslagen</a>
        </nav>
    </div>
    <UpdateBanner />
</header>

<main>
    {@render children()}
</main>

<style>
    .site-header {
        position: sticky;
        top: 0;
        z-index: 1000;
        background: var(--c-bg);
        border-bottom: 1px solid var(--c-border);
        padding: 0 16px;
        padding-top: env(safe-area-inset-top, 0px);
    }

    .header-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        height: 52px;
        max-width: 720px;
        margin: 0 auto;
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 44px;
        text-decoration: none;
        color: var(--c-primary-dark);
    }

    .brand-logo {
        width: 28px;
        height: 28px;
        object-fit: contain;
    }

    .brand-name {
        font-family: var(--font-serif);
        font-size: 1.2em;
        font-weight: 600;
    }

    nav {
        display: flex;
        gap: 10px;
    }

    nav a {
        display: inline-flex;
        align-items: center;
        min-height: 44px;
        padding: 0 4px;
        font-size: 0.92em;
        color: var(--c-text-muted);
        text-decoration: none;
    }

    nav a:hover,
    nav a[aria-current="page"] {
        color: var(--c-primary-dark);
        text-decoration: underline;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 752px;
        margin: 0 auto;
        padding: 24px 16px 0;
    }
</style>
