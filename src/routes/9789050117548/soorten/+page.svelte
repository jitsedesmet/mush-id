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
    import OneZoomPicture from "#lib/OneZoomPicture.svelte";
    import FancyButton from "#lib/FancyButton.svelte";
    import {resolve} from "$app/paths";

    export let data: PageData;

    $: displayName = data.keyName
        ? data.keyName.charAt(0).toUpperCase() + data.keyName.slice(1)
        : "";

    $: subKeyList = data.subKeys.map(val => ({
        value: val,
        name: val.charAt(0).toUpperCase() + val.substring(1, val.length - 1),
    }));
</script>

<div class="content">
    {#if data.key && data.mushrooms}
        <a class="back-link" href={resolve("/9789050117548/soorten")}>← Alle deelsleutels</a>
        <h2>{displayName}</h2>
        <p class="subtitle">
            {data.mushrooms.length} soort{data.mushrooms.length === 1 ? "" : "en"} in deze deelsleutel
        </p>

        <ul class="species-list">
            {#each data.mushrooms as mushroom (mushroom.id)}
            <li class="species">
                <div class="picture-wrapper">
                    <OneZoomPicture {mushroom} />
                </div>
                <div class="species-info">
                    <a class="species-name"
                       href={`https://www.google.com/search?q=${encodeURIComponent(mushroom.id)}`}
                       target="_blank" rel="noopener">{mushroom.id}</a>
                    <div class="species-links">
                        <a href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(mushroom.id)}`}
                           target="_blank" rel="noopener">Afbeeldingen</a>
                        <a href={`https://nl.wikipedia.org/w/index.php?search=${encodeURIComponent(mushroom.id)}&title=Special:Search`}
                           target="_blank" rel="noopener">Wikipedia NL</a>
                        <a href={`https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(mushroom.id)}&title=Special:Search`}
                           target="_blank" rel="noopener">EN</a>
                        {#if mushroom.waarnemingId}
                        <a href={`https://waarnemingen.be/species/${mushroom.waarnemingId}/`}
                           target="_blank" rel="noopener">Waarnemingen.be</a>
                        {/if}
                        {#if mushroom.OToLId}
                        <a href={`https://tree.opentreeoflife.org/opentree/argus/ottol@${mushroom.OToLId}/`}
                           target="_blank" rel="noopener">Open Tree of Life</a>
                        <a href={`https://www.onezoom.org/life/@=${mushroom.OToLId}`}
                           target="_blank" rel="noopener">OneZoom</a>
                        {/if}
                        {#if mushroom.lifeUrl}
                        <a href={`https://eol.org/pages/${mushroom.lifeUrl}`}
                           target="_blank" rel="noopener">EoL</a>
                        {/if}
                    </div>
                </div>
            </li>
            {/each}
        </ul>
    {:else}
        <h2>Soorten per deelsleutel</h2>
        <p class="subtitle">Kies een deelsleutel om alle soorten erin te zien.</p>

        <ul class="subkey-list">
            {#each subKeyList as key (key.value)}
            <li>
                <a href={`${resolve("/9789050117548/soorten")}?key=${key.value}`}>{key.name}</a>
            </li>
            {/each}
        </ul>
    {/if}
</div>

{#if data.key}
<div class="action-bar">
    <FancyButton color="primary" href={`${resolve("/9789050117548")}?keys=${data.key}&state=${data.key}`}>
        Deze deelsleutel doorlopen
    </FancyButton>
</div>
{/if}


<style>
    .content {
        padding-bottom: 24px;
    }

    h2 {
        margin-bottom: 4px;
    }

    .subtitle {
        color: var(--c-text-muted);
        margin: 0 0 20px;
    }

    .back-link {
        display: inline-block;
        font-size: 0.92em;
        text-decoration: none;
        margin-bottom: 12px;
    }

    .back-link:hover {
        text-decoration: underline;
    }

    /* ── Sub-key index ── */
    .subkey-list {
        list-style: none;
        margin: 0;
        padding: 0;
        columns: 2 12em;
        column-gap: 32px;
    }

    .subkey-list li {
        break-inside: avoid;
        border-bottom: 1px solid var(--c-border);
    }

    .subkey-list a {
        display: block;
        padding: 9px 0;
        text-decoration: none;
        color: var(--c-text);
    }

    .subkey-list a:hover {
        color: var(--c-primary-dark);
        text-decoration: underline;
    }

    /* ── Species list ── */
    .species-list {
        list-style: none;
        margin: 0;
        padding: 0;
        border-top: 1px solid var(--c-border);
    }

    .species {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 0;
        border-bottom: 1px solid var(--c-border);
    }

    .picture-wrapper {
        height: 64px;
        width: 64px;
        flex-shrink: 0;
        border-radius: var(--radius-sm);
        overflow: hidden;
        background: var(--c-surface-alt);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .picture-wrapper :global(img) {
        height: 64px;
        object-fit: cover;
    }

    .species-info {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        flex: 1;
    }

    .species-name {
        font-family: var(--font-serif);
        font-size: 1.1em;
        font-style: italic;
        color: var(--c-text);
        text-decoration: none;
    }

    .species-name:hover {
        text-decoration: underline;
    }

    .species-links {
        display: flex;
        flex-wrap: wrap;
        gap: 0 12px;
        font-size: 0.85em;
    }

    .species-links a {
        padding: 4px 0;
        color: var(--c-text-muted);
    }

    .species-links a:hover {
        color: var(--c-primary-dark);
    }
</style>
