<svelte:head>
    <title>Opgeslagen zoekopdrachten | Mush ID</title>
    <meta name="description" content="Lijst van opgeslagen zoekopdrachten in mush-id">
</svelte:head>

<script lang="ts">
    import type { PageData } from './$types';
    import {savedHistory} from "$lib/viewModel/viewModel.js";
    import {computeTagListUnsafe} from "$lib/viewModel/paramHelper";
    import FancyButton from "$lib/FancyButton.svelte";
    import OneZoomPicture from "$lib/OneZoomPicture.svelte";
    export let data: PageData;

    $: sortedSavedHistory = $savedHistory.links.toSorted((a, b) => b.creationDate.getTime() - a.creationDate.getTime());

    function toTwoDigits(num: number) {
        return num < 10 ? `0${num}` : num;
    }
    function formatDate(date: Date) {
        return `${toTwoDigits(date.getHours())}:${toTwoDigits(date.getMinutes())}  ${toTwoDigits(date.getDate())}/${toTwoDigits(date.getMonth())}/${date.getFullYear()}`;
    }
</script>

<div class="page">
<div class="content">

<h2>Opgeslagen zoekopdrachten</h2>

{#if sortedSavedHistory.length === 0}
    <div class="empty-state">
        <span class="empty-icon">🍄</span>
        <p>Nog niets opgeslagen. Identificeer een paddenstoel en sla de resultaten op!</p>
        <FancyButton color="primary" href="/">Beginnen</FancyButton>
    </div>
{:else}
<div class="complete-saved">
    {#each sortedSavedHistory as item (item.link)}
        {@const date = new Date(item.creationDate)}
        {@const state = computeTagListUnsafe(new URL(item.link).searchParams)}
        {@const currentMushroom = state.currentQuestion}
        <div class="saved-item">
            <div class="picture-wrapper">
                <OneZoomPicture credits={false} mushroom={data.parsedMushrooms[currentMushroom]} />
            </div>

            <div class="item-text">
                <a class="item-title"
                   href={`https://www.google.com/search?tbm=isch&q=${state.currentQuestion}`}
                   target="_blank" rel="noopener">
                    {state.currentQuestion}
                </a>
                <div class="item-time">{formatDate(date)}</div>
                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                <a class="item-continue" href={item.link}>
                    Ga verder →
                </a>
            </div>
        </div>
    {/each}
</div>
{/if}
</div>

<div class="home-wrapper">
    <FancyButton color="primary" href="/">
        HOME
    </FancyButton>
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

    /* ── Empty state ── */
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
        padding: 40px 20px;
        text-align: center;
        color: var(--c-text-muted);
    }

    .empty-icon {
        font-size: 3em;
    }

    /* ── Saved list ── */
    .complete-saved {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 8px 0;
        width: 100%;
    }

    .saved-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 14px;
        background: var(--c-surface);
        border: 1px solid var(--c-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: 12px;
        height: 100px;
    }

    .picture-wrapper {
        height: 76px;
        width: 76px;
        flex-shrink: 0;
        border-radius: var(--radius-md);
        overflow: hidden;
        background: var(--c-surface-alt);
    }

    .item-text {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
    }

    .item-title {
        font-size: 1.05em;
        font-weight: 600;
        font-style: italic;
        color: var(--c-primary-dark);
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .item-title:hover { text-decoration: underline; }

    .item-time {
        font-size: 0.8em;
        color: var(--c-text-muted);
    }

    .item-continue {
        font-size: 0.88em;
        font-weight: 600;
        color: var(--c-primary);
        text-decoration: none;
    }

    .item-continue:hover {
        color: var(--c-primary-dark);
        text-decoration: underline;
    }

    /* ── Sticky home button ── */
    .home-wrapper {
        position: -webkit-sticky;
        position: sticky;
        width: min(calc(1000px - 40px), calc(100svw - 24px));
        height: min-content;
        min-height: min-content;
        background: var(--c-surface);
        padding: 14px 16px 8px;
        bottom: 0;
        align-content: center;
        align-self: flex-end;
        margin: auto;
        z-index: 999;
        border-top: 1px solid var(--c-border);
        box-shadow: 0 -4px 16px rgba(0,0,0,.08);
        border-radius: var(--radius-lg) var(--radius-lg) 0 0;
        display: flex;
        justify-content: center;
    }
</style>
