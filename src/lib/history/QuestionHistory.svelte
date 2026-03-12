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
        <div class="hist-row current">
            <span class="hist-question">{currentItem}</span>
            <span class="hist-vote">…</span>
        </div>
        {#each stateTagList.questionHistory.toReversed() as hisItem (hisItem.question)}
            <div class="hist-row">
                <span class="hist-question">{hisItem.question}</span>
                <span class="hist-vote">{labels[hisItem.voting + 3]}</span>
            </div>
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
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-top: 8px;
        background: var(--c-surface);
        border: 1px solid var(--c-border);
        border-radius: var(--radius-md);
        overflow: hidden;
    }

    .hist-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        padding: 6px 10px;
        border-bottom: 1px solid var(--c-border);
    }

    .hist-row:last-child {
        border-bottom: none;
    }

    .hist-question {
        font-size: 0.88em;
        flex: 1 1 0;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .hist-vote {
        font-size: 0.88em;
        color: var(--c-text-muted);
        white-space: nowrap;
    }

    .current {
        font-weight: 600;
        background: var(--c-surface-alt);
        color: var(--c-primary-dark);
    }
</style>
