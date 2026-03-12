<script lang="ts">
    import type {Mushroom} from "$lib/viewModel/parser";
    export let credits: boolean = true;

    interface WaarnemingPhoto {
        url: string;
        by: string;
    }

    async function fetchWaarnemingPic(waarnemingId: string): Promise<WaarnemingPhoto> {
        const response = await fetch(
            `https://waarnemingen.be/api/v1/species/${waarnemingId}/photos/?format=json&page_size=1`
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const parsed = await response.json();
        const photo = parsed?.results?.[0]?.photo;
        if (!photo) throw new Error("No photo found");
        return {
            url: photo.file ?? photo.file_medium ?? photo.file_thumbnail,
            by: parsed.results[0].user?.name ?? "",
        };
    }

    export let mushroom: Mushroom | null;
</script>

{#if mushroom && mushroom.waarnemingId}
<div class="image-div">
    {#await fetchWaarnemingPic(mushroom.waarnemingId)}
        <!-- loading -->
    {:then res}
        <figure>
            <img
                    class="fit-picture"
                    src={res.url}
                    alt={`Foto van ${mushroom.id} via Waarnemingen.be`} />
            {#if credits && res.by}
            <figcaption>{res.by}</figcaption>
            {/if}
        </figure>
    {:catch}
        <!-- no image available -->
    {/await}
</div>
{/if}


<style>
    .image-div {
        width: 100%;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
    }
    figure {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 100%;
    }
    figure figcaption {
        caption-side: bottom;
        margin: 5px auto;
        font-size: 0.75em;
        color: var(--c-text-muted, #888);
        text-align: center;
    }
    img {
        width: 100%;
        max-height: 220px;
        object-fit: contain;
    }
</style>
