<script lang="ts">
    import { page } from "$app/stores";
    import { resolve } from "$app/paths";

    $: isHome = $page.url.pathname === "/";
    const homeUrl = resolve("/");
</script>

<header class="site-header">
    <div class="header-inner">
        <a href={homeUrl} class="brand" aria-label="Mush ID home">
            <span class="brand-icon" aria-hidden="true">🍄</span>
            <span class="brand-name">Mush ID</span>
        </a>
        {#if !isHome}
            <a href={homeUrl} class="nav-home">Home</a>
        {/if}
    </div>
</header>

<slot />

<style>
    .site-header {
        position: sticky;
        top: 0;
        z-index: 1000;
        background: var(--c-primary-dark);
        box-shadow: 0 2px 8px rgba(0,0,0,.25);
        margin: -10px -12px 16px;
        padding: 0 12px;
    }

    .header-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 52px;
        max-width: 976px;
        margin: 0 auto;
    }

    .brand {
        display: flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        color: #fff;
    }

    .brand-icon {
        font-size: 1.5em;
        line-height: 1;
    }

    .brand-name {
        font-size: 1.2em;
        font-weight: 700;
        letter-spacing: 0.02em;
        color: #fff;
    }

    .nav-home {
        font-size: 0.9em;
        font-weight: 500;
        color: var(--c-primary-pale);
        text-decoration: none;
        padding: 6px 14px;
        border: 1px solid var(--c-primary-light);
        border-radius: var(--radius-sm);
        transition: background 0.15s, color 0.15s;
    }

    .nav-home:hover {
        background: var(--c-primary-mid);
        color: #fff;
    }
</style>
