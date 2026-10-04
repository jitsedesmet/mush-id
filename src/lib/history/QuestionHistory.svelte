<script lang="ts">
    import type {pageRatingOptions} from "#lib/viewModel/paramHelper.js";

    export let stateTagList: pageRatingOptions | undefined;
    export let currentItem: string | undefined;

    const labels = ["zeker b", "waarschijnlijk b", "mogelijks b", "onzeker",
        "mogelijks a", "waarschijnlijk a", "zeker a"];
</script>

{#if stateTagList && currentItem && stateTagList.questionHistory.length > 0}
<details class="history">
    <summary>Gekozen pad ({stateTagList.questionHistory.length} {stateTagList.questionHistory.length === 1 ? "stap" : "stappen"})</summary>
    <ol class="history-list">
        {#each stateTagList.questionHistory as hisItem (hisItem.question)}
            <li>
                <span class="hist-question">{hisItem.question}</span>
                <span class="hist-vote">{labels[hisItem.voting + 3]}</span>
            </li>
        {/each}
        <li class="current">
            <span class="hist-question">{currentItem}</span>
            <span class="hist-vote">nu</span>
        </li>
    </ol>
</details>
{/if}

<style>
    .history {
        margin-top: 24px;
        font-size: 0.92em;
    }

    summary {
        cursor: pointer;
        color: var(--c-text-muted);
    }

    .history-list {
        margin: 8px 0 0;
        padding: 0;
        list-style: none;
        border-top: 1px solid var(--c-border);
    }

    li {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        padding: 6px 0;
        border-bottom: 1px solid var(--c-border);
    }

    .hist-question {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .hist-vote {
        color: var(--c-text-muted);
        white-space: nowrap;
    }

    .current {
        font-weight: 600;
    }
</style>
