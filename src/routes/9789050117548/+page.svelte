<svelte:head>
    <title>Paddenstoelen 1 sleutel | Mush ID</title>
    <meta name="description" content="Vragenlijst paddenstoelen 1">
    <meta name="robots" content="noindex, nofollow">
</svelte:head>

<script lang="ts">
    import type { PageData } from './$types';
    import Rater from "#lib/Rater.svelte";
    import {page} from "$app/state";
    import {goto} from "$app/navigation";
    import MushroomDenyButton from "#lib/MushroomDenyButton.svelte";
    import {computeLimitedQuestions, computeTagList} from "#lib/viewModel/paramHelper.js";
    import OneZoomPicture from "#lib/OneZoomPicture.svelte";
    import QuestionHistory from "#lib/history/QuestionHistory.svelte";
    import MarkdownQuestion from "#lib/MarkdownQuestion.svelte";

    let { data }: { data: PageData } = $props();

    const stateTagList = $derived(computeTagList(page.url.searchParams));
    const limitedQuestions = $derived(computeLimitedQuestions(page.url.searchParams, data.parsedQuestions));

    $effect(() => {
        if (!stateTagList) {
            goto(`?state=${limitedQuestions.start}`, {
                replaceState: true,
            })
        }
    });

    const scopedSubKeys = $derived(page.url.searchParams.get("keys")?.split(";") || []);

    const currentItem = $derived(stateTagList?.currentQuestion)
    const currentQuestion = $derived(limitedQuestions.complete[currentItem!])
    const currentMushroom = $derived(data.parsedMushrooms[currentItem!])
</script>

<div class="content">
    <p class="context muted">
        Veldgids Paddenstoelen I
        {#if currentItem}· <span class="code">{currentItem}</span>{/if}
        {#if scopedSubKeys.length > 0}
            <br>Beperkt tot: {scopedSubKeys.map(x => x.substring(0, x.length - 1)).join(", ")}
        {/if}
    </p>

    <div id="focus-point">
        {#if currentQuestion}
        <ol class="couplet">
            <li class="lead lead-a">
                <span class="lead-mark">a</span>
                <MarkdownQuestion markdownText={currentQuestion.first_option} link={currentQuestion.first_link} />
            </li>
            <li class="lead lead-b">
                <span class="lead-mark">b</span>
                <MarkdownQuestion markdownText={currentQuestion.second_option} link={currentQuestion.second_link} />
            </li>
        </ol>
        {/if}

        {#if currentMushroom}
        <section class="result">
            <p class="muted result-intro">Je antwoorden wijzen op</p>
            <h2 class="species">
                <a href={`https://www.google.com/search?q=${currentMushroom.id}`}>{currentMushroom.id}</a>
            </h2>
            <div class="image-wrapper">
                <OneZoomPicture mushroom={currentMushroom} creditsOverlay={true} />
            </div>
            <h4>Meer over deze soort</h4>
            <ul class="sources">
                <li><a href={`https://www.google.com/search?tbm=isch&q=${currentMushroom.id}`}>Google afbeeldingen</a></li>
                <li><a href={`https://nl.wikipedia.org/w/index.php?search=${currentMushroom.id}&title=Special:Search`}>Wikipedia (NL)</a></li>
                <li><a href={`https://en.wikipedia.org/w/index.php?search=${currentMushroom.id}&title=Special:Search`}>Wikipedia (EN)</a></li>
                {#if currentMushroom.waarnemingId}
                    <li><a href={`https://waarnemingen.be/species/${currentMushroom.waarnemingId}/`}>Waarnemingen.be</a></li>
                {/if}
                {#if currentMushroom.OToLId}
                    <li><a href={`https://tree.opentreeoflife.org/opentree/argus/ottol@${currentMushroom.OToLId}/`}>Open Tree of Life</a></li>
                    <li><a href={`https://www.onezoom.org/life/@=${currentMushroom.OToLId}`}>OneZoom</a></li>
                {/if}
                {#if currentMushroom.lifeUrl}
                    <li><a href={`https://eol.org/pages/${currentMushroom.lifeUrl}`}>Encyclopedia of Life</a></li>
                {/if}
            </ul>
        </section>
        {/if}
    </div>

    <QuestionHistory stateTagList={stateTagList} currentItem={currentItem} />
</div>

<div class="action-bar">
    {#if currentQuestion}
        <Rater currentQuestion={currentQuestion}/>
    {/if}
    {#if currentMushroom}
        <MushroomDenyButton />
    {/if}
</div>


<style>
    .content {
        padding-bottom: 24px;
    }

    .context {
        font-size: 0.88em;
        margin: 0 0 12px;
    }

    .code {
        font-variant-numeric: tabular-nums;
    }

    /* ── Couplet: the two leads of a key step ── */
    .couplet {
        list-style: none;
        margin: 0;
        padding: 0;
        background: var(--c-surface);
        border: 1px solid var(--c-border);
        border-radius: var(--radius-lg);
    }

    .lead {
        display: flex;
        align-items: baseline;
        gap: 12px;
        padding: 14px 16px;
        font-size: 1.05em;
    }

    .lead + .lead {
        border-top: 1px solid var(--c-border);
    }

    .lead > :global(div) {
        flex: 1;
        min-width: 0;
    }

    .lead-mark {
        flex-shrink: 0;
        font-family: var(--font-serif);
        font-weight: 700;
        font-size: 1.15em;
        width: 1ch;
    }

    .lead-a .lead-mark { color: var(--c-primary); }
    .lead-b .lead-mark { color: var(--c-amber); }

    /* ── Result ── */
    .result-intro {
        margin: 0;
        font-size: 0.92em;
    }

    .species {
        font-style: italic;
        margin: 2px 0 16px;
    }

    .species a {
        color: inherit;
        text-decoration: none;
    }

    .species a:hover {
        text-decoration: underline;
    }

    .image-wrapper {
        max-width: 320px;
        margin-bottom: 20px;
    }

    .image-wrapper:empty {
        display: none;
    }

    .sources {
        margin: 0;
        padding: 0;
        list-style: none;
        columns: 2;
        column-gap: 24px;
    }

    .sources li {
        padding: 3px 0;
        break-inside: avoid;
    }
</style>
