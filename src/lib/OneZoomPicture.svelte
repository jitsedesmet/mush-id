<script lang="ts">
    import type {Mushroom} from "$lib/viewModel/parser";
    export let credits: boolean = true;
    interface OneZoomImage {
        name: string;
        url: string;
        by: string;
        licence: string;
    }

    async function fetchOneZoomPic(mushId: string): Promise<OneZoomImage> {
        const web = await fetch(`https://www.onezoom.org/API/node_images?key=0&otts=${mushId}&type=verified`);
        const parsed = await web.json()
        const imageObject = parsed["images"][mushId]
        return {
            name: imageObject[0],
            url: imageObject[1],
            by: imageObject[2],
            licence: imageObject[3],
        }
    }

    export let mushroom: Mushroom | null;
</script>

{#if mushroom && mushroom.OToLId}
<div class="image-div">
    {#await fetchOneZoomPic(mushroom.OToLId)}
    {:then res}
        <figure>
            <img
                    id="image1"
                    class="fit-picture"
                    src={res.url}
                    alt={`Geverifieerde foto van ${mushroom.id} gebracht door OneZoom`} />
            {#if credits}
            <figcaption>{res.by}</figcaption>
            {/if}
        </figure>
    {:catch _}
        <p>Er kan geen foto worden opgehaald</p>
    {/await}
</div>
{/if}


<style>
    .image-div {
        width: 100%;
        height: 100%;
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
        height: 100%;
        width: 100%;
    }
    figure figcaption {
        caption-side: bottom;
        margin: 5px auto;
    }
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>
