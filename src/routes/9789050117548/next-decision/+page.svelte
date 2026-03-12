<svelte:head>
    <title>Alternatieve paden | Mush ID</title>
    <meta name="description" content="Lijst van alternatieve paden vanuit huidige zoekopdracht">
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

    $: minConfidence = questionsByConfidence ? Math.abs(questionsByConfidence[0].voting) : 0;
    $: maxConfidence = questionsByConfidence ? Math.abs(questionsByConfidence[questionsByConfidence.length - 1].voting) : 0;
</script>


<h2>Alternatieve paden</h2>

<p class="intro">
    Kies het punt waarvan je wenst verder te zoeken.
    De vragen zijn gesorteerd op zekerheid — het meest onzekere antwoord staat bovenaan.
</p>

<div class="history">
    <div class="color-gradient"
         style={`background-image: linear-gradient(0deg, hsl(142, 40%, ${30 + maxConfidence*30}%), hsl(142, 40%, ${60 + minConfidence*20}%) 100%);`}
    ></div>
    <div class="question-list">
        {#each questionsByConfidence as question (question.question)}
            <AlternativeItem question={limitedQuestions.complete[question.question]} vote={question.voting}/>
        {/each}
    </div>
</div>



<style>
    .intro {
        color: var(--c-text-muted);
        font-size: 0.95em;
        margin: 0 0 20px;
        line-height: 1.6;
    }

    .history {
        display: grid;
        grid-template-columns: 8px 1fr;
        gap: 12px;
        width: 100%;
    }

    .color-gradient {
        height: 100%;
        width: 8px;
        border-radius: 4px;
    }

    .question-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
</style>
