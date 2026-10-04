<svelte:head>
    <title>Alternatieve paden | Mush-ID</title>
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
    import FancyButton from "#lib/FancyButton.svelte";
    import {resolve} from "$app/paths";
    import {SvelteURLSearchParams} from "svelte/reactivity";

    let { data }: { data: PageData } = $props();

    const stateTagList = $derived(computeTagList(page.url.searchParams));
    const limitedQuestions = $derived(computeLimitedQuestions(page.url.searchParams, data.parsedQuestions));

    $effect(() => {
        if (!stateTagList) {
            const params = new SvelteURLSearchParams(page.url.search);
            params.set("state", limitedQuestions.start);
            goto(`${resolve("/9789050117548")}?${params}`, {
                replaceState: true,
            })
        }
    });

    // Steps whose other branch has not been tried yet (a tried branch has its own vote in the URL).
    const questionsByConfidence = $derived(stateTagList?.questionHistory
        .filter(x => limitedQuestions.complete[x.question] !== undefined)
        .map(x => ({ voting: computeCombinedScore(x.question, x.voting, limitedQuestions.complete), question: x.question }))
        .filter(x => {
            const question = limitedQuestions.complete[x.question];
            const alternative = x.voting > 0 ? question.second_link : question.first_link;
            return !page.url.searchParams.has(alternative);
        })
        .toSorted((a, b) => Math.abs(a.voting) - Math.abs(b.voting)) ?? []);

    // normalised: 0 = most uncertain (top), 1 = most certain (bottom)
    const questionsWithConfidence = $derived(questionsByConfidence.map((q, i) => ({
        ...q,
        confidence: questionsByConfidence.length > 1 ? i / (questionsByConfidence.length - 1) : 0,
    })));
</script>


<h1>Ander pad proberen</h1>

<p class="intro">
    Kies een eerdere stap en volg daar de andere mogelijkheid.
    De antwoorden waar je het minst zeker van was staan bovenaan.
</p>

{#if questionsWithConfidence.length === 0}
    <p class="empty">
        Er is geen eerdere stap meer met een ander pad om te proberen: je hebt overal beide mogelijkheden al gevolgd.
    </p>
    <div class="empty-actions">
        <FancyButton color="primary" href={resolve("/")}>Opnieuw beginnen</FancyButton>
        <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
        <FancyButton color="secondary" href={`${resolve("/9789050117548")}${page.url.search}`}>Terug naar het resultaat</FancyButton>
    </div>
{/if}

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
    h1 {
        font-size: 1.6em;
    }

    .intro {
        color: var(--c-text-muted);
        margin: 0 0 20px;
    }

    .empty {
        margin: 0 0 16px;
    }

    .empty-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
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
