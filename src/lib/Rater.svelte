<script lang="ts">
    import {page} from "$app/state";
    import {resolve} from "$app/paths";
    import type {ParsedQuestion} from "#lib/viewModel/parser.js";

    let { currentQuestion }: { currentQuestion: ParsedQuestion } = $props();

    const otherOptions = $derived([...page.url.searchParams.entries()]
        .filter(([key]) => key !== "state")
        .map(([key, value]) => `${key}=${value}`).join("&"));
    const fillIn = $derived(otherOptions.length > 0 ? "&" : "");
    const baseRoute = $derived(resolve(page.route.id!));
    const firstUrl = $derived(`${baseRoute}?${otherOptions}${fillIn}state=${page.url.searchParams.get("state") || ""};${currentQuestion.first_link}`);
    const secondUrl = $derived(`${baseRoute}?${otherOptions}${fillIn}state=${page.url.searchParams.get("state") || ""};${currentQuestion.second_link}`);
    const qId = $derived(currentQuestion.id);
</script>

<div class="rater" role="group" aria-label="Kies a of b en hoe zeker je bent">
    <!-- Column headers; screen readers get the lead in each button's label instead -->
    <div class="col-header col-a" aria-hidden="true"><span class="mark">a</span></div>
    <div class="col-header col-b" aria-hidden="true"><span class="mark">b</span></div>

    <!-- Confidence rows -->
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a class="answer-btn a-low"  href={`${firstUrl}&${qId}=1`} aria-label="a, mogelijks">Mogelijks</a>
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a class="answer-btn b-low"  href={`${secondUrl}&${qId}=-1`} aria-label="b, mogelijks">Mogelijks</a>

    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a class="answer-btn a-mid"  href={`${firstUrl}&${qId}=2`} aria-label="a, waarschijnlijk">Waarschijnlijk</a>
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a class="answer-btn b-mid"  href={`${secondUrl}&${qId}=-2`} aria-label="b, waarschijnlijk">Waarschijnlijk</a>

    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a class="answer-btn a-high" href={`${firstUrl}&${qId}=3`} aria-label="a, zeker">Zeker</a>
    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
    <a class="answer-btn b-high" href={`${secondUrl}&${qId}=-3`} aria-label="b, zeker">Zeker</a>
</div>


<style>
    .rater {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 6px 10px;
        width: 100%;
    }

    .col-header {
        text-align: center;
        font-size: 0.88em;
        color: var(--c-text-muted);
    }

    .mark {
        font-family: var(--font-serif);
        font-weight: 700;
        font-size: 1.2em;
    }

    .col-a .mark { color: var(--c-primary); }
    .col-b .mark { color: var(--c-amber); }

    .answer-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 9px 6px;
        border-radius: var(--radius-md);
        border: 1px solid;
        font-weight: 500;
        font-size: 0.92em;
        text-decoration: none;
        text-align: center;
        transition: background 0.12s;
        -webkit-tap-highlight-color: transparent;
    }

    /* Confidence increases top to bottom: outline → tint → solid. */
    .a-low  { border-color: var(--c-primary-light); background: var(--c-surface);      color: var(--c-primary-dark); }
    .a-mid  { border-color: var(--c-primary-light); background: var(--c-primary-pale); color: var(--c-primary-dark); }
    .a-high { border-color: var(--c-primary);       background: var(--c-primary);      color: #fff; }

    .b-low  { border-color: var(--c-amber-light);   background: var(--c-surface);      color: #5E3D1D; }
    .b-mid  { border-color: var(--c-amber-light);   background: var(--c-amber-pale);   color: #5E3D1D; }
    .b-high { border-color: var(--c-amber);         background: var(--c-amber);        color: #fff; }

    .a-low:hover, .a-mid:hover { background: #D5E3D9; color: var(--c-primary-dark); }
    .b-low:hover, .b-mid:hover { background: #EADBC8; color: #5E3D1D; }
    .a-high:hover { background: var(--c-primary-dark); color: #fff; }
    .b-high:hover { background: #6E4620; color: #fff; }
</style>
