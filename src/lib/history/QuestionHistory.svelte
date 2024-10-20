<script lang="ts">
    import type {pageRatingOptions} from "$lib/viewModel/paramHelper";

    export let stateTagList: pageRatingOptions | undefined;
    export let currentItem: string | undefined;

</script>

{#if stateTagList && currentItem}

<div class="history">
    <h6>Geschiedenis:</h6>
    Je hebt een geschiedenis, het eerste is meest recent:
    <div class="history-grid">
        <div>{currentItem}:</div>
        <div>...</div>
        {#each stateTagList.questionHistory.reverse() as hisItem}
            <div>{hisItem.question}:</div>
            <div>
                {["Zeker B", "Waarschijnlijk B", "Mogelijks B", "Onzeker",
                    "Mogelijks A", "Waarschijnlijk A", "Zeker A"][hisItem.voting + 3]}
            </div>
        {/each}
    </div>
</div>
{/if}

<style>
    div {
        width: 100%;
    }
    .history {
        display: grid;
        grid-template-rows: auto auto 1fr;
        overflow: hidden;
    }
    .history-grid {
        display: grid;
        grid-template-columns: auto auto;
        align-content: flex-start;
        column-gap: 20px;
        width: 100%;
    }
</style>
