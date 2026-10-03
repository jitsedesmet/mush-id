<svelte:head>
    <title>Alternatieve paden | Mush ID</title>
    <meta name="description" content="Lijst van alternatieve paden vanuit huidige zoekopdracht">
    <meta name="robots" content="noindex, nofollow">
</svelte:head>

<script lang="ts">
    import type { PageData } from './$types';
    import {page} from "$app/state";
    import {goto} from "$app/navigation";
    import {computeCombinedScore} from "#lib/viewModel/viewModel.js";
    import {computeLimitedQuestions, computeTagList} from "#lib/viewModel/paramHelper.js";
    import AlternativeItem from "#lib/history/AlternativeItem.svelte";
    import {resolve} from "$app/paths";

    let { data }: { data: PageData } = $props();

    const stateTagList = $derived(computeTagList(page.url.searchParams));
    const limitedQuestions = $derived(computeLimitedQuestions(page.url.searchParams, data.parsedQuestions));

    $effect(() => {
        if (!stateTagList) {
            goto(resolve(`/9789050117548?state=${limitedQuestions.start}`), {
                replaceState: true,
            })
        }
    });

    const questionsByConfidence = $derived(stateTagList?.questionHistory
        .filter(x => limitedQuestions.complete[x.question] !== undefined)
        .map(x => ({ voting: computeCombinedScore(x.question, x.voting, limitedQuestions.complete), question: x.question }))
        .toSorted((a, b) => Math.abs(a.voting) - Math.abs(b.voting)) ?? []);

    // normalised: 0 = most uncertain (top), 1 = most certain (bottom)
    const questionsWithConfidence = $derived(questionsByConfidence.map((q, i) => ({
        ...q,
        confidence: questionsByConfidence.length > 1 ? i / (questionsByConfidence.length - 1) : 0,
    })));
</script>


<h2>Ander pad proberen</h2>

<p class="intro">
    Kies een eerdere stap en volg daar de andere mogelijkheid.
    De antwoorden waar je het minst zeker van was staan bovenaan.
</p>

<ol class="question-list">
    {#each questionsWithConfidence as question (question.question)}
        <AlternativeItem
            question={limitedQuestions.complete[question.question]}
            vote={question.voting}
            confidence={question.confidence}
        />
    {/each}
</ol>


<style>
    .intro {
        color: var(--c-text-muted);
        margin: 0 0 20px;
    }

    .question-list {
        list-style: none;
        margin: 0 0 32px;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
</style>
