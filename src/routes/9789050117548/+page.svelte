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
        // eslint-disable-next-line svelte/no-navigation-without-resolve
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
    <h2>Veldgids Paddenstoelen 1</h2>

    {#if scopedSubKeys.length > 0}
        <p class="scope-notice">
            Gefocust op deelsleutels:
            <strong>{scopedSubKeys.map(x => x.substring(0, x.length - 1)).join(", ")}</strong>
        </p>
    {/if}

    <div id="focus-point">
        {#if currentQuestion}
        <div class="card question-card">
            <p class="card-label">Vraag</p>
            <div class="option option-a">
                <span class="option-badge option-badge-a">A</span>
                <MarkdownQuestion markdownText={currentQuestion.first_option} link={currentQuestion.first_link} />
            </div>
            <div class="option-divider">of</div>
            <div class="option option-b">
                <span class="option-badge option-badge-b">B</span>
                <MarkdownQuestion markdownText={currentQuestion.second_option} link={currentQuestion.second_link} />
            </div>
        </div>
        {/if}

        {#if currentMushroom}
        <div class="card mushroom-card">
            <p class="card-label">Mogelijk resultaat</p>
            <p class="mushroom-name">
                Je antwoorden wijzen op:
                <a href={`https://www.google.com/search?q=${currentMushroom.id}`}
                   class="mushroom-link">{currentMushroom.id}</a>
            </p>
            <div class="image-wrapper">
                <OneZoomPicture mushroom={currentMushroom} />
            </div>
            <p class="sources-label">Raadpleeg bronnen:</p>
            <div class="mushroom-info">
                <a href={`https://www.google.com/search?tbm=isch&q=${currentMushroom.id}`}>
                    <InfoIcon/>Google afbeeldingen</a>
                <a href={`https://en.wikipedia.org/w/index.php?search=${currentMushroom.id}&title=Special:Search`}>
                    <InfoIcon/>Engelse Wikipedia</a>
                <a href={`https://nl.wikipedia.org/w/index.php?search=${currentMushroom.id}&title=Special:Search`}>
                    <InfoIcon/>Nederlandse Wikipedia</a>
                {#if currentMushroom.OToLId}
                    <a href={`https://tree.opentreeoflife.org/opentree/argus/ottol@${currentMushroom.OToLId}/`}>
                        <InfoIcon/>Open Tree of Life</a>
                    <a href={`https://www.onezoom.org/life/@=${currentMushroom.OToLId}`}>
                        <InfoIcon/>OneZoom visualisatie</a>
                {/if}
                {#if currentMushroom.lifeUrl}
                    <a href={`https://eol.org/pages/${currentMushroom.lifeUrl}`}>
                        <InfoIcon/>Encyclopedia of Life</a>
                {/if}
                {#if currentMushroom.waarnemingId}
                    <a href={`https://waarnemingen.be/species/${currentMushroom.waarnemingId}/`}>
                        <InfoIcon/>Waarnemingen.be</a>
                {/if}
            </div>
        </div>
        {/if}
    </div>

    <QuestionHistory stateTagList={stateTagList} currentItem={currentItem} />
</div>

<div class="navigationOptions">
    {#if currentQuestion}
        <p class="nav-label">Jouw antwoord:</p>
        <Rater currentQuestion={currentQuestion}/>
    {/if}
    {#if currentMushroom}
        <p class="nav-mushroom-name">{currentMushroom.id}</p>
        <MushroomDenyButton />
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
    }

    .content {
        flex: 1 1 0;
        width: 100%;
    }

    .scope-notice {
        text-align: center;
        font-size: 0.9em;
        color: var(--c-text-muted);
        margin: 0 0 12px;
    }

    /* ── Cards ── */
    .card {
        background: var(--c-surface);
        border: 1px solid var(--c-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: 16px 18px;
        margin-bottom: 16px;
        width: 100%;
    }

    .card-label {
        font-size: 0.78em;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--c-text-muted);
        margin: 0 0 10px;
    }

    /* ── Question card ── */
    .option {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 10px 12px;
        border-radius: var(--radius-md);
    }

    .option-a { background: var(--c-primary-pale); }
    .option-b { background: var(--c-amber-pale); }

    .option-badge {
        flex-shrink: 0;
        font-size: 0.85em;
        font-weight: 700;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 1px;
    }

    .option-badge-a {
        background: var(--c-primary);
        color: #fff;
    }

    .option-badge-b {
        background: var(--c-amber);
        color: #fff;
    }

    .option-divider {
        text-align: center;
        font-size: 0.85em;
        color: var(--c-text-muted);
        font-style: italic;
        padding: 4px 0;
    }

    /* ── Mushroom card ── */
    .mushroom-name {
        margin: 0 0 12px;
        font-size: 1em;
    }

    .mushroom-link {
        font-weight: 600;
        font-style: italic;
    }

    .image-wrapper {
        margin: 0 auto 14px;
        max-width: 260px;
    }

    .sources-label {
        font-size: 0.85em;
        font-weight: 600;
        color: var(--c-text-muted);
        margin: 0 0 8px;
    }

    .mushroom-info {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
        width: 100%;
    }

    .mushroom-info a {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 0.88em;
        padding: 6px 8px;
        border-radius: var(--radius-sm);
        background: var(--c-surface-alt);
        border: 1px solid var(--c-border);
        text-decoration: none;
        transition: background 0.15s;
    }

    .mushroom-info a:hover {
        background: var(--c-primary-pale);
    }

    /* ── Sticky navigation ── */
    .navigationOptions {
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
    }

    .nav-label {
        font-size: 0.85em;
        font-weight: 600;
        color: var(--c-text-muted);
        margin: 0 0 8px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .nav-mushroom-name {
        font-weight: 600;
        font-style: italic;
        font-size: 1em;
        margin: 0 0 8px;
    }
</style>
