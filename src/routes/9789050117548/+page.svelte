<svelte:head>
    <title>Paddenstoelen 1 sleutel | Mush ID</title>
    <meta name="description" content="Vragenlijst paddenstoelen 1">
</svelte:head>

<script lang="ts">
    import type { PageData } from './$types';
    import Rater from "$lib/Rater.svelte";
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";
    import MushroomDenyButton from "$lib/MushroomDenyButton.svelte";
    import {computeLimitedQuestions, computeTagList} from "$lib/viewModel/paramHelper";
    import OneZoomPicture from "$lib/OneZoomPicture.svelte";
    import QuestionHistory from "$lib/history/QuestionHistory.svelte";
    import MarkdownQuestion from "$lib/MarkdownQuestion.svelte";
    import InfoIcon from "$lib/heroicons/InfoIcon.svelte";

    export let data: PageData;

    $: stateTagList = computeTagList($page.url.searchParams);
    $: limitedQuestions = computeLimitedQuestions($page.url.searchParams, data.parsedQuestions);

    $: if (!stateTagList) {
        goto(`?state=${limitedQuestions.start}`, {
            replaceState: true,
        })
    }

    $: scopedSubKeys = $page.url.searchParams.get("keys")?.split(";") || [];

    $: currentItem = stateTagList?.currentQuestion
    $: currentQuestion = limitedQuestions.complete[currentItem!]
    $: currentMushroom = data.parsedMushrooms[currentItem!]
</script>

<div class="page">
<div class="content">
<h2>Vragenlijst Veldgids Paddenstoelen 1</h2>
{#if scopedSubKeys.length > 0}
    <span>Vragenlijst gefocust op deelsleutels: {scopedSubKeys.map(x => x.substring(0, x.length -1)).join(", ")}</span>
{/if}

<div id="focus-point">
    {#if currentQuestion}
    <div id="question-listing">
        <h6>Vraag:</h6>
        <MarkdownQuestion markdownText={"**A:** " + currentQuestion.first_option} link={currentQuestion.first_link} />
        of
        <MarkdownQuestion markdownText={"**B:** " + currentQuestion.second_option} link={currentQuestion.second_link} />
    </div>
    {/if}

    {#if currentMushroom}
    <div id="mushroom-listing">
    <h6>Mogelijk resultaat:</h6>
    <div>
        Je antwoorden wijzen aan dat de gezochte zwam vermoedelijk <a href={`https://www.google.com/search?q=${currentMushroom.id}`}>{currentMushroom.id}</a> is.
        <br/>
        Je kan verschillende bronnen raadplegen om je bevinding te evalueren.
        <div class="mushroom-info">
            <a href={`https://www.google.com/search?tbm=isch&q=${currentMushroom.id}`}>
                <InfoIcon/>
                Google afbeeldingen</a>
            <a href={`https://en.wikipedia.org/w/index.php?search=${currentMushroom.id}&title=Special:Search`}>
                <InfoIcon/>
                Engelse Wikipedia</a>
            <a href={`https://nl.wikipedia.org/w/index.php?search=${currentMushroom.id}&title=Special:Search`}>
                <InfoIcon/>
                Nederlandse Wikipedia</a>
            {#if currentMushroom.OToLId}
                <a href={`https://tree.opentreeoflife.org/opentree/argus/ottol@${currentMushroom.OToLId}/`}>
                    <InfoIcon/>
                    Open Tree of Life</a>
                <a href={`https://www.onezoom.org/life/@=${currentMushroom.OToLId}`}>
                    <InfoIcon/>
                    Visualizatie in OneZoom</a>
            {/if}
            {#if currentMushroom.lifeUrl}
                <a href={`https://eol.org/pages/${currentMushroom.lifeUrl}`}>
                    <InfoIcon/>
                    Encyclopedia of life</a>
            {/if}
            {#if currentMushroom.waarnemingId}
                <a href={`https://waarnemingen.be/species/${currentMushroom.waarnemingId}/`}>
                    <InfoIcon/>
                    Waarnemingen.be</a>
            {/if}
        </div>
        <div class="image-wrapper">
            <OneZoomPicture mushroom={currentMushroom} />
        </div>
    </div>
    </div>
    {/if}
</div>


<QuestionHistory stateTagList={stateTagList} currentItem={currentItem} />
</div>

<div class="navigationOptions">
    {#if currentQuestion}
        <h6>Antwoord:</h6>
        <Rater
                bind:currentQuestion={currentQuestion}/>
    {/if}
    {#if currentMushroom}
        {currentMushroom.id}
        <MushroomDenyButton />
    {/if}
</div>
</div>


<style>
    div {
        width: 100%;
    }
    .mushroom-info {
        display: grid;
        grid-template-columns: auto auto;
        width: 100%;
    }
    .page {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        min-height: calc(100dvh - 20px);
    }
    .content {
        flex: 1 1 0;
    }
    .navigationOptions {
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
/*    A clicked <a> does not change colors*/
    a:visited {
        color: blue;
    }
    .image-wrapper {
        margin: auto;
        max-width: 300px;
        max-height: 300px;
        padding: 20px
    }
</style>
