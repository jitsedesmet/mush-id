<script lang="ts">
    import type {pageRatingOptions} from "$lib/viewModel/paramHelper";

    export let stateTagList: pageRatingOptions | undefined;
    export let currentItem: string | undefined;

    const labels = ["Zeker B", "Waarschijnlijk B", "Mogelijks B", "Onzeker",
        "Mogelijks A", "Waarschijnlijk A", "Zeker A"];
</script>

{#if stateTagList && currentItem}
<div class="history">
    <h6>Geschiedenis</h6>
    <div class="history-grid">
        <div class="hist-question current">{currentItem}</div>
        <div class="hist-vote current">…</div>
        {#each stateTagList.questionHistory.toReversed() as hisItem (hisItem.question)}
            <div class="hist-question">{hisItem.question}</div>
            <div class="hist-vote">{labels[hisItem.voting + 3]}</div>
        {/each}
    </div>
</div>
{/if}

<style>
    .history {
        width: 100%;
        margin-top: 16px;
    }

    .history-grid {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 2px 16px;
        width: 100%;
        margin-top: 8px;
        background: var(--c-surface);
        border: 1px solid var(--c-border);
        border-radius: var(--radius-md);
        overflow: hidden;
    }

    .hist-question,
    .hist-vote {
        padding: 6px 10px;
        font-size: 0.88em;
        border-bottom: 1px solid var(--c-border);
    }

    .hist-question:last-of-type,
    .hist-vote:last-of-type {
        border-bottom: none;
    }

    .hist-vote {
        color: var(--c-text-muted);
        white-space: nowrap;
        text-align: right;
    }

    .current {
        font-weight: 600;
        background: var(--c-surface-alt);
        color: var(--c-primary-dark);
    }
</style>
