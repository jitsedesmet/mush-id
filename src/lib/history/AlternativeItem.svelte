<script lang="ts">
    import MarkdownQuestion from "#lib/MarkdownQuestion.svelte";
    import TryOtherButton from "#lib/history/TryOtherButton.svelte";
    import {page} from "$app/state";
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

    // Saturation: 18% (very uncertain) → 65% (very certain)
    // Lightness:  75% (very uncertain) → 35% (very certain)
    const borderColor = $derived(`hsl(142, ${Math.round(18 + confidence * 47)}%, ${Math.round(75 - confidence * 40)}%)`);
    const isLeastCertain = $derived(confidence === 0);
</script>

{#if !page.url.searchParams.has(alternativeOption)}
    <div class="alt-item" style="border-left-color: {borderColor}">
        {#if isLeastCertain}
            <span class="uncertainty-badge">Meest onzeker</span>
        {/if}
        <div class="chosen">
            <span class="chosen-label">Gekozen:</span>
            <MarkdownQuestion markdownText={chosenQuestion} renderDetails={false}/>
        </div>
        <div class="alternative">
            <span class="alt-label">Alternatief:</span>
            <MarkdownQuestion markdownText={alternativeQuestion} renderDetails={false}/>
            <TryOtherButton alternative={alternativeOption}/>
        </div>
    </div>
{/if}

<style>
    .alt-item {
        background: var(--c-surface);
        border: 1px solid var(--c-border);
        border-left: 5px solid var(--c-primary-light); /* overridden by inline style */
        border-radius: var(--radius-md);
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .uncertainty-badge {
        display: inline-block;
        font-size: 0.72em;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        background: var(--c-primary-pale);
        color: var(--c-primary-dark);
        border: 1px solid var(--c-primary-light);
        border-radius: 99px;
        padding: 2px 10px;
        align-self: flex-start;
    }

    .chosen {
        font-size: 0.9em;
        color: var(--c-text-muted);
        display: flex;
        gap: 6px;
        align-items: flex-start;
    }

    .alternative {
        padding: 8px 10px;
        background: var(--c-surface-alt);
        border: 1px solid var(--c-border);
        border-radius: var(--radius-sm);
        font-size: 0.9em;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .chosen-label,
    .alt-label {
        font-weight: 700;
        font-size: 0.8em;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        white-space: nowrap;
        padding-top: 2px;
    }

    .alt-label { color: var(--c-primary-dark); }
</style>
