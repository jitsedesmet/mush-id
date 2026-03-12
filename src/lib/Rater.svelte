<script lang="ts">
    import {page} from "$app/stores";
    import {resolve} from "$app/paths";
    import type {ParsedQuestion} from "$lib/viewModel/parser";

    export let currentQuestion: ParsedQuestion;

    $: otherOptions = [...$page.url.searchParams.entries()]
        .filter(([key]) => key !== "state")
        .map(([key, value]) => `${key}=${value}`).join("&");
    $: fillIn = otherOptions.length > 0 ? "&" : "";
    $: baseRoute = resolve($page.route.id!);
    $: firstUrl = `${baseRoute}?${otherOptions}${fillIn}state=${$page.url.searchParams.get("state") || ""};${currentQuestion.first_link}`;
    $: secondUrl = `${baseRoute}?${otherOptions}${fillIn}state=${$page.url.searchParams.get("state") || ""};${currentQuestion.second_link}`;
    $: qId = currentQuestion.id;
</script>

<div class="rater">
    <!-- Column headers -->
    <div class="col-header col-a">Antwoord A</div>
    <div class="col-header col-b">Antwoord B</div>

    <!-- Confidence rows -->
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a class="answer-btn a-low"  href={`${firstUrl}&${qId}=1`}>Mogelijks</a>
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a class="answer-btn b-low"  href={`${secondUrl}&${qId}=-1`}>Mogelijks</a>

    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a class="answer-btn a-mid"  href={`${firstUrl}&${qId}=2`}>Waarschijnlijk</a>
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a class="answer-btn b-mid"  href={`${secondUrl}&${qId}=-2`}>Waarschijnlijk</a>

    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a class="answer-btn a-high" href={`${firstUrl}&${qId}=3`}>Zeker</a>
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a class="answer-btn b-high" href={`${secondUrl}&${qId}=-3`}>Zeker</a>
</div>


<style>
    .rater {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px;
        width: 100%;
    }

    .col-header {
        font-size: 0.78em;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        text-align: center;
        padding: 4px 0 2px;
        border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    }

    .col-a { color: var(--c-primary-dark); border-bottom: 2px solid var(--c-primary); }
    .col-b { color: #7C4A0A;               border-bottom: 2px solid var(--c-amber); }

    /* Shared answer button */
    .answer-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 6px;
        border-radius: var(--radius-md);
        font-weight: 600;
        font-size: 0.88em;
        text-decoration: none;
        text-align: center;
        transition: filter 0.15s, transform 0.1s, box-shadow 0.15s;
        box-shadow: var(--shadow-sm);
        -webkit-tap-highlight-color: transparent;
    }

    .answer-btn:hover  { filter: brightness(0.9); box-shadow: var(--shadow-md); }
    .answer-btn:active { transform: scale(0.96); }

    /* A column — green palette (light → dark = low → high confidence) */
    .a-low  { background: #B7E4C7; color: #1B4332; }
    .a-mid  { background: #52B788; color: #fff; }
    .a-high { background: #1B4332; color: #fff; }

    /* B column — amber palette */
    .b-low  { background: #FDEBD0; color: #7C4A0A; }
    .b-mid  { background: #E07B39; color: #fff; }
    .b-high { background: #7C4A0A; color: #fff; }
</style>
