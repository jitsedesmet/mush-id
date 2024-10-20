<svelte:head>
    <title>Alternatieve paded | Mush ID</title>
    <meta name="description" content="Lijst van alternatieve paden vanuit huidige zoekopdracht">
</svelte:head>

<script lang="ts">
    import type { PageData } from './$types';
    import {page} from "$app/stores";
    import {goto} from "$app/navigation";
    import {computeCombinedScore} from "$lib/viewModel/viewModel.js";
    import {computeLimitedQuestions, computeTagList} from "$lib/viewModel/paramHelper";
    import AlternativeItem from "$lib/history/AlternativeItem.svelte";

    export let data: PageData;

    $: stateTagList = computeTagList($page.url.searchParams);
    $: limitedQuestions = computeLimitedQuestions($page.url.searchParams, data.parsedQuestions);

    $: if (!stateTagList) {
        goto(`/9789050117548?state=${limitedQuestions.start}`, {
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


<h2>Vragenlijst Veldgids Paddenstoelen 1</h2>

Kies het punt waarvan je wenst verder te zoeken vertrekken.
Hieronder zie je een lijst van vragen die je al beantwoord hebt, maar waarvan je het alternatief nog niet geprobeert hebt.
De items zijn gesorteerd op hoe zeker het antwoord juist is.
Het meest onzeker antwoord staat bovenaan.


<div class="history">
    <div class="color-gradient"
         style={`background-image: linear-gradient(0deg, hsl(360, 100%, ${maxConfidence*100}%), hsl(360, 100%, ${minConfidence*100}%) 100%);`}
    />
    <div class="question-list">
        {#each questionsByConfidence as question}
            <AlternativeItem question={limitedQuestions.complete[question.question]} vote={question.voting}/>
        {/each}
    </div>
</div>



<style>
    div {
        width: 100%;
    }
    .history {
        display: grid;
        grid-template-columns: 10px 1fr;
        gap: 10px;
    }
    .color-gradient {
        height: 100%;
        width: 10px;
    }
</style>
