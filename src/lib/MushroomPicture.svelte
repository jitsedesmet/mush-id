<script lang="ts">
    import type {Mushroom} from "$lib/viewModel/parser";
    import WaarnemingPicture from "$lib/WaarnemingPicture.svelte";
    import OneZoomPicture from "$lib/OneZoomPicture.svelte";

    export let mushroom: Mushroom | null;
    export let credits: boolean = true;
</script>

{#if mushroom}
    {#if mushroom.OToLId}
        <OneZoomPicture {mushroom} {credits} />
    {:else if mushroom.waarnemingId}
        <WaarnemingPicture {mushroom} {credits} />
    {/if}
{/if}
