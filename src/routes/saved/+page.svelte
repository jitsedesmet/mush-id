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
        return `${toTwoDigits(date.getHours())}:${toTwoDigits(date.getMinutes())} ${toTwoDigits(date.getDate())}/${toTwoDigits(date.getMonth())}/${date.getFullYear()}`;
    }
</script>

<div class="page">
<div class="content">

<h2>
    Saved Searches
</h2>

<div class="complete-saved">
{#each sortedSavedHistory as item}
    {@const date = new Date(item.creationDate)}
    {@const state = computeTagListUnsafe(new URL(item.link).searchParams)}
    {@const currentMushroom = state.currentQuestion}
    <div class="saved-item">
        <div class="picture-wrapper">
            <OneZoomPicture credits={false} mushroom={data.parsedMushrooms[currentMushroom]} />
        </div>

        <div class="item-text">
            <a class="item-title" href={`https://www.google.com/search?tbm=isch&q=${state.currentQuestion}`}>
                {state.currentQuestion}
            </a>

            <div class="time">
                {formatDate(date)}
            </div>

            <a class="view-search" href={item.link}>
                Ga verder met zoeken
            </a>
        </div>
    </div>
{/each}
</div>
</div>

<div class="home-wrapper">
    <FancyButton color="primary" href="/">
        HOME
    </FancyButton>
</div>

</div>

<style>
    .home-wrapper {
        position: -webkit-sticky;
        position: sticky;
        width: min(calc(1000px - 40px), calc(100svw - 60px));
        height: min-content;
        min-height: min-content;
        background: white;
        padding: 20px 20px 5px 20px;
        bottom: 0;
        align-content: center;
        align-self: flex-end;
        margin: auto;
        z-index: 999;
    }
    .content {
        flex: 1 1 0;
        width: 100%;
    }
    .page {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        min-height: calc(100dvh - 20px);
    }
    .complete-saved {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 10px 0;
    }
    .saved-item {
        display: flex;
        flex-direction: row;
        /*border: black 1px solid;*/
        gap: 10px;
        height: 100px;
    }
    .item-text {
        display: flex;
        flex-direction: column;
        gap: 7px;
        height: 100%;
    }
    .item-title {
        font-size: 20px;
        color: black;
    }
    .picture-wrapper {
        height: 100%;
        aspect-ratio: 1 / 1;
    }

</style>
