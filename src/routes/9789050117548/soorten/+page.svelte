<svelte:head>
    {#if data.key}
    <title>{data.keyName} — Soortenoverzicht | Mush ID</title>
    <meta name="description" content="Overzicht van alle soorten in de deelsleutel {data.keyName}">
    {:else}
    <title>Paddenstoelen per deelsleutel | Mush ID</title>
    <meta name="description" content="Bekijk alle paddenstoelen per deelsleutel">
    {/if}
    <meta name="robots" content="noindex">
</svelte:head>

<script lang="ts">
    import type { PageData } from './$types';
    import MushroomPicture from "$lib/MushroomPicture.svelte";
    import InfoIcon from "$lib/heroicons/InfoIcon.svelte";
    import FancyButton from "$lib/FancyButton.svelte";

    export let data: PageData;

    $: displayName = data.keyName
        ? data.keyName.charAt(0).toUpperCase() + data.keyName.slice(1)
        : "";

    $: subKeyList = data.subKeys.map(val => ({
        value: val,
        name: val.charAt(0).toUpperCase() + val.substring(1, val.length - 1),
    }));
</script>

<div class="page">
<div class="content">
    {#if data.key && data.mushrooms}
        <!-- ── Species list for a single sub-key ── -->
        <a class="back-link" href="/9789050117548/soorten">← Alle deelsleutels</a>
        <h2>{displayName}</h2>
        <p class="subtitle">
            {data.mushrooms.length} soort{data.mushrooms.length === 1 ? "" : "en"} in deze deelsleutel
        </p>

        <div class="species-grid">
            {#each data.mushrooms as mushroom (mushroom.id)}
            <div class="species-card">
                <div class="picture-wrapper">
                    <MushroomPicture {mushroom} credits={false} />
                </div>
                <div class="species-info">
                    <a class="species-name"
                       href={`https://www.google.com/search?q=${encodeURIComponent(mushroom.id)}`}
                       target="_blank" rel="noopener">
                        {mushroom.id}
                    </a>
                    <div class="species-links">
                        {#if mushroom.waarnemingId}
                        <a href={`https://waarnemingen.be/species/${mushroom.waarnemingId}/`}
                           target="_blank" rel="noopener" class="species-link">
                            <InfoIcon/>Waarnemingen.be
                        </a>
                        {/if}
                        {#if mushroom.OToLId}
                        <a href={`https://www.onezoom.org/life/@=${mushroom.OToLId}`}
                           target="_blank" rel="noopener" class="species-link">
                            <InfoIcon/>OneZoom
                        </a>
                        {/if}
                    </div>
                </div>
            </div>
            {/each}
        </div>
    {:else}
        <!-- ── Sub-key index ── -->
        <h2>Paddenstoelen per deelsleutel</h2>
        <p class="subtitle">Kies een deelsleutel om alle bijbehorende soorten te bekijken.</p>

        <div class="subkey-grid">
            {#each subKeyList as key (key.value)}
            <a class="subkey-card" href={`/9789050117548/soorten?key=${key.value}`}>
                <span class="subkey-name">{key.name}</span>
                <span class="subkey-arrow">→</span>
            </a>
            {/each}
        </div>
    {/if}
</div>

<div class="nav-bar">
    <FancyButton color="secondary" href="/">Home</FancyButton>
    {#if data.key}
    <FancyButton color="primary" href={`/9789050117548?keys=${data.key}&state=${data.key}`}>
        Sleutel starten
    </FancyButton>
    {/if}
</div>
</div>


<style>
    .page {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        min-height: calc(100dvh - 20px);
        width: 100%;
    }

    .content {
        flex: 1 1 0;
        width: 100%;
    }

    h2 {
        margin: 0 0 4px;
        font-size: 1.5em;
    }

    .subtitle {
        font-size: 0.9em;
        color: var(--c-text-muted);
        margin: 0 0 20px;
    }

    .back-link {
        display: inline-block;
        font-size: 0.88em;
        color: var(--c-primary);
        text-decoration: none;
        margin-bottom: 10px;
    }

    .back-link:hover {
        text-decoration: underline;
    }

    /* ── Sub-key index ── */
    .subkey-grid {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
    }

    .subkey-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 18px;
        background: var(--c-surface);
        border: 1px solid var(--c-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        text-decoration: none;
        transition: background 0.15s, box-shadow 0.15s;
    }

    .subkey-card:hover {
        background: var(--c-primary-pale);
        box-shadow: var(--shadow-md);
    }

    .subkey-name {
        font-size: 1em;
        font-weight: 600;
        color: var(--c-primary-dark);
    }

    .subkey-arrow {
        font-size: 1em;
        color: var(--c-text-muted);
    }

    /* ── Species grid ── */
    .species-grid {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 100%;
    }

    .species-card {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 14px;
        background: var(--c-surface);
        border: 1px solid var(--c-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: 12px;
        min-height: 80px;
    }

    .picture-wrapper {
        height: 72px;
        width: 72px;
        flex-shrink: 0;
        border-radius: var(--radius-md);
        overflow: hidden;
        background: var(--c-surface-alt);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .species-info {
        display: flex;
        flex-direction: column;
        gap: 8px;
        min-width: 0;
        flex: 1;
    }

    .species-name {
        font-size: 1em;
        font-weight: 600;
        font-style: italic;
        color: var(--c-primary-dark);
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .species-name:hover {
        text-decoration: underline;
    }

    .species-links {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .species-link {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 0.8em;
        padding: 4px 8px;
        border-radius: var(--radius-sm);
        background: var(--c-surface-alt);
        border: 1px solid var(--c-border);
        text-decoration: none;
        color: var(--c-text);
        transition: background 0.15s;
        white-space: nowrap;
    }

    .species-link:hover {
        background: var(--c-primary-pale);
    }

    /* ── Sticky nav bar ── */
    .nav-bar {
        position: -webkit-sticky;
        position: sticky;
        width: min(calc(1000px - 40px), calc(100svw - 24px));
        height: min-content;
        min-height: min-content;
        background: var(--c-surface);
        padding: 14px 16px 8px;
        bottom: 0;
        align-self: center;
        z-index: 999;
        border-top: 1px solid var(--c-border);
        box-shadow: 0 -4px 16px rgba(0,0,0,.08);
        border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        display: flex;
        gap: 12px;
        justify-content: center;
    }
</style>

