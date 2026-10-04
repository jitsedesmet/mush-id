<svelte:head>
    <title>Paddenstoelen 1 sleutel | Mush-ID</title>
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
    import {isNotCovered, notCoveredGroupName} from "#lib/viewModel/parser.js";
    import {resolve} from "$app/paths";
    import {SvelteURLSearchParams} from "svelte/reactivity";

    let { data }: { data: PageData } = $props();

    const stateTagList = $derived(computeTagList(page.url.searchParams));
    const limitedQuestions = $derived(computeLimitedQuestions(page.url.searchParams, data.parsedQuestions));

    // No step in the URL yet (e.g. coming from the home page): start at the
    // first step of the chosen sub-keys, keeping `keys` and the other params.
    $effect(() => {
        if (!stateTagList) {
            const params = new SvelteURLSearchParams(page.url.search);
            params.set("state", limitedQuestions.start);
            goto(`?${params}`, {
                replaceState: true,
            })
        }
    });

    const scopedSubKeys = $derived(limitedQuestions.scopedSubKeys);

    const currentItem = $derived(stateTagList?.currentQuestion)
    const currentQuestion = $derived(limitedQuestions.complete[currentItem!])
    const currentMushroom = $derived(data.parsedMushrooms[currentItem!])
    const notCovered = $derived(currentMushroom ? isNotCovered(currentMushroom) : false);
    const unknownStep = $derived(stateTagList !== undefined && !currentQuestion && !currentMushroom);

    // Same URL with the last step removed, for a link back out of an unknown step.
    const previousStepUrl = $derived.by(() => {
        const params = new SvelteURLSearchParams(page.url.search);
        const states = (params.get("state") ?? "").split(";").slice(0, -1);
        if (states.length === 0) {
            params.set("state", limitedQuestions.start);
        } else {
            params.set("state", states.join(";"));
            params.delete(states[states.length - 1]);
        }
        return `${resolve("/9789050117548")}?${params}`;
    });
</script>

<div class="content">
    <div class="context muted">
        <h1>
            Veldgids Paddenstoelen I
            {#if currentItem}· <span class="code">{currentItem}</span>{/if}
        </h1>
        {#if scopedSubKeys.length > 0}
            <p>Beperkt tot: {scopedSubKeys.map(x => x.substring(0, x.length - 1)).join(", ")}</p>
        {/if}
    </div>

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

        {#if unknownStep}
        <section class="notice">
            <h2>Deze stap bestaat niet</h2>
            <p>
                De link verwijst naar <span class="code">{currentItem}</span>, maar die stap staat niet in de sleutel.
                Misschien is de link onvolledig of komt hij uit een oudere versie van de app.
            </p>
            <p class="notice-links">
                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                <a href={previousStepUrl}>← Terug naar de vorige stap</a>
                <a href={resolve("/")}>Opnieuw beginnen</a>
            </p>
        </section>
        {/if}

        {#if currentMushroom && notCovered}
        <section class="result">
            <p class="muted result-intro">Je antwoorden wijzen op een groep die niet in deze gids staat</p>
            <h2>{notCoveredGroupName(currentMushroom)}</h2>
            <p>
                De Veldgids Paddenstoelen I behandelt deze groep niet, dus de sleutel stopt hier.
                Twijfel je aan een eerder antwoord? Kies dan <em>Niet deze</em> om een ander pad te proberen.
            </p>
        </section>
        {:else if currentMushroom}
        <section class="result">
            <p class="muted result-intro">Je antwoorden wijzen op</p>
            <h2 class="species">
                <a href={`https://www.google.com/search?q=${currentMushroom.id}`}>{currentMushroom.id}</a>
            </h2>
            <div class="image-wrapper">
                <OneZoomPicture mushroom={currentMushroom} creditsOverlay={true} />
            </div>
            <h3 class="sources-title">Meer over deze soort</h3>
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

{#if currentQuestion || currentMushroom}
<div class="action-bar">
    {#if currentQuestion}
        <Rater currentQuestion={currentQuestion}/>
    {/if}
    {#if currentMushroom}
        <MushroomDenyButton canSave={!notCovered} />
    {/if}
</div>
{/if}


<style>
    .content {
        padding-bottom: 24px;
    }

    .context {
        font-size: 0.88em;
        margin: 0 0 12px;
    }

    /* The page heading is the step you are on; it stays as quiet as the line it replaced. */
    .context h1,
    .context p {
        font: inherit;
        color: inherit;
        margin: 0;
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

    /* ── Unknown step ── */
    .notice-links {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 20px;
    }

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

    .sources-title {
        font-family: var(--font-sans);
        font-size: 1em;
        color: var(--c-text);
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
