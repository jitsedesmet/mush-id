<svelte:head>
    <title>Alternatieve paden | Mush ID</title>
    <meta name="description" content="Lijst van alternatieve paden vanuit huidige zoekopdracht">
    <meta name="robots" content="noindex, nofollow">
</svelte:head>

<script lang="ts">
    import type { PageData } from './$types';
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";
    import {computeCombinedScore} from "$lib/viewModel/viewModel.js";
    import {computeLimitedQuestions, computeTagList} from "$lib/viewModel/paramHelper";
    import AlternativeItem from "$lib/history/AlternativeItem.svelte";
    import {resolve} from "$app/paths";

    export let data: PageData;

    $: stateTagList = computeTagList($page.url.searchParams);
    $: limitedQuestions = computeLimitedQuestions($page.url.searchParams, data.parsedQuestions);

    $: if (!stateTagList) {
        goto(resolve(`/9789050117548?state=${limitedQuestions.start}`), {
            replaceState: true,
        })
    }

    $: questionsByConfidence = stateTagList?.questionHistory
        .filter(x => limitedQuestions.complete[x.question] !== undefined)
        .map(x => ({ voting: computeCombinedScore(x.question, x.voting, limitedQuestions.complete), question: x.question }))
        .toSorted((a, b) => Math.abs(a.voting) - Math.abs(b.voting)) ?? [];

    // normalised: 0 = most uncertain (top), 1 = most certain (bottom)
    $: questionsWithConfidence = questionsByConfidence.map((q, i) => ({
        ...q,
        confidence: questionsByConfidence.length > 1 ? i / (questionsByConfidence.length - 1) : 0,
    }));
</script>


<h2>Alternatieve paden</h2>

<p class="intro">
    Kies het punt waarvan je wenst verder te zoeken.
    De vragen zijn gesorteerd op zekerheid — het meest onzekere antwoord staat bovenaan.
</p>

<div class="question-list">
        {#each questionsWithConfidence as question (question.question)}
            <AlternativeItem
                question={limitedQuestions.complete[question.question]}
                vote={question.voting}
                confidence={question.confidence}
            />
        {/each}
    </div>



<style>
    .intro {
        color: var(--c-text-muted);
        font-size: 0.95em;
        margin: 0 0 20px;
        line-height: 1.6;
    }

    .question-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
</style>
