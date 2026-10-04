<svelte:head>
    <title>Opgeslagen zoekopdrachten | Mush-ID</title>
    <meta name="description" content="Lijst van opgeslagen zoekopdrachten in mush-id">
    <meta name="robots" content="noindex">
</svelte:head>

<script lang="ts">
    import type { PageData } from './$types';
    import {removeSavedLink, savedHistory} from "#lib/viewModel/viewModel.js";
    import {computeTagListUnsafe} from "#lib/viewModel/paramHelper.js";
    import FancyButton from "#lib/FancyButton.svelte";
    import OneZoomPicture from "#lib/OneZoomPicture.svelte";
    import {resolve} from "$app/paths";
    let { data }: { data: PageData } = $props();

    const sortedSavedHistory = $derived($savedHistory.links.toSorted((a, b) => b.creationDate.getTime() - a.creationDate.getTime()));

    function toTwoDigits(num: number) {
        return num < 10 ? `0${num}` : num;
    }
    function formatDate(date: Date) {
        return `${toTwoDigits(date.getDate())}/${toTwoDigits(date.getMonth() + 1)}/${date.getFullYear()} om ${toTwoDigits(date.getHours())}:${toTwoDigits(date.getMinutes())}`;
    }
</script>

<h1>Opgeslagen zoekopdrachten</h1>

{#if sortedSavedHistory.length === 0}
    <div class="empty-state">
        <p>Je hebt nog niets opgeslagen. Kom je in de sleutel bij een soort uit die klopt, kies dan <em>Da is em! Opslaan</em>.</p>
        <FancyButton color="primary" href={resolve("/")}>Naar de sleutel</FancyButton>
    </div>
{:else}
<ul class="complete-saved">
    {#each sortedSavedHistory as item (item.link)}
        {@const date = new Date(item.creationDate)}
        {@const state = computeTagListUnsafe(new URL(item.link).searchParams)}
        {@const currentMushroom = state.currentQuestion}
        <li class="saved-item">
            <div class="picture-wrapper">
                <OneZoomPicture mushroom={data.parsedMushrooms[currentMushroom]} />
            </div>

            <div class="item-text">
                <a class="item-title"
                   href={`https://www.google.com/search?tbm=isch&q=${state.currentQuestion}`}
                   target="_blank" rel="noopener">{state.currentQuestion}</a>
                <span class="item-time">{formatDate(date)}</span>
                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                <a class="item-continue" href={item.link}>Verder zoeken vanaf hier →</a>
            </div>

            <button type="button" class="item-remove" onclick={() => removeSavedLink(item.link)}
                    aria-label={`${state.currentQuestion} verwijderen`}>Verwijderen</button>
        </li>
    {/each}
</ul>
{/if}

<style>
    h1 {
        font-size: 1.6em;
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
        max-width: 480px;
        color: var(--c-text-muted);
    }

    .empty-state p {
        margin: 0;
    }

    .complete-saved {
        list-style: none;
        margin: 0 0 32px;
        padding: 0;
        border-top: 1px solid var(--c-border);
    }

    .saved-item {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 0;
        border-bottom: 1px solid var(--c-border);
    }

    .picture-wrapper {
        height: 72px;
        width: 72px;
        flex-shrink: 0;
        border-radius: var(--radius-sm);
        overflow: hidden;
        background: var(--c-surface-alt);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .picture-wrapper :global(img) {
        height: 72px;
        object-fit: cover;
    }

    .item-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
        flex: 1;
    }

    .item-remove {
        align-self: center;
        flex-shrink: 0;
        min-height: 44px;
        padding: 0 4px;
        border: none;
        background: none;
        font-size: 0.85em;
        color: var(--c-text-muted);
        text-decoration: underline;
        cursor: pointer;
    }

    .item-remove:hover {
        color: #9B2C1F;
    }

    .item-title {
        font-family: var(--font-serif);
        font-size: 1.1em;
        font-style: italic;
        color: var(--c-text);
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .item-title:hover { text-decoration: underline; }

    .item-time {
        font-size: 0.85em;
        color: var(--c-text-muted);
    }

    .item-continue {
        font-size: 0.92em;
        text-decoration: none;
    }

    .item-continue:hover {
        text-decoration: underline;
    }
</style>
