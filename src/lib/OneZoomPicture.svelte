<script lang="ts">
    import type {Mushroom} from "$lib/viewModel/parser";
    export let credits: boolean = true;
    /** When true, renders the credit text as a translucent overlay at the
     *  bottom of the image instead of below it. Useful inside fixed-size
     *  containers where a figcaption below the image would overflow. */
    export let creditsOverlay: boolean = false;
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
<div class="image-div" class:overlay-credits={creditsOverlay}>
    {#await fetchOneZoomPic(mushroom.OToLId)}
    {:then res}
        <figure>
            <img
                    id="image1"
                    class="fit-picture"
                    src={res.url}
                    alt={`Geverifieerde foto van ${mushroom.id} gebracht door OneZoom`} />
            {#if credits && !creditsOverlay}
            <figcaption>{res.by}</figcaption>
            {/if}
            {#if credits && creditsOverlay}
            <figcaption class="overlay">{res.by}</figcaption>
            {/if}
        </figure>
    {:catch}
        <p>Er kan geen foto worden opgehaald</p>
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
    .image-div.overlay-credits {
        position: relative;
    }
    figure {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        position: relative;
    }
    figure figcaption {
        caption-side: bottom;
        margin: 5px auto;
        font-size: 0.75em;
        color: var(--c-text-muted, #888);
        text-align: center;
    }
    figure figcaption.overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0;
        padding: 2px 4px;
        background: rgba(0, 0, 0, 0.45);
        color: #fff;
        font-size: 0.65em;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    img {
        width: 100%;
        max-height: 220px;
        object-fit: contain;
    }
</style>
