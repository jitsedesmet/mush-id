<script lang="ts">
    import MarkdownQuestion from "#lib/MarkdownQuestion.svelte";
    import TryOtherButton from "#lib/history/TryOtherButton.svelte";
    import type {ParsedQuestion} from "#lib/viewModel/parser.js";

    let { question, vote, confidence = 0 }: {
        question: ParsedQuestion;
        vote: number;
        /** 0 = most uncertain (top of list), 1 = most certain (bottom of list) */
        confidence?: number;
    } = $props();

    const chosenQuestion = $derived((vote > 0) ? question.first_option : question.second_option);
    const alternativeQuestion = $derived((vote > 0) ? question.second_option : question.first_option);
    const alternativeOption = $derived((vote > 0) ? question.second_link : question.first_link);

    // Less certain answers get a stronger marker: they are the best places to branch off.
    const borderColor = $derived(`color-mix(in srgb, var(--c-amber) ${Math.round((1 - confidence) * 100)}%, var(--c-border))`);
    const isLeastCertain = $derived(confidence === 0);
</script>

<li class="alt-item" style="border-left-color: {borderColor}">
    <div class="chosen">
        <span class="label">Gekozen{#if isLeastCertain}<em class="least">(minst zeker)</em>{/if}</span>
        <MarkdownQuestion markdownText={chosenQuestion} renderDetails={false}/>
    </div>
    <div class="alternative">
        <span class="label">Andere mogelijkheid</span>
        <MarkdownQuestion markdownText={alternativeQuestion} renderDetails={false}/>
    </div>
    <TryOtherButton alternative={alternativeOption}/>
</li>

<style>
    .alt-item {
        background: var(--c-surface);
        border: 1px solid var(--c-border);
        border-left-width: 4px;
        border-radius: var(--radius-md);
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .label {
        display: block;
        font-size: 0.82em;
        color: var(--c-text-muted);
        margin-bottom: 2px;
    }

    .least {
        margin-left: 0.3em;
    }

    .chosen {
        color: var(--c-text-muted);
    }
</style>
