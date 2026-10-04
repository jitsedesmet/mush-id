<script lang="ts">
    import type {Mushroom} from "#lib/viewModel/parser.js";

    interface OneZoomImage {
        name: string;
        url: string;
        by: string;
        licence: string;
    }

    let { mushroom, creditsOverlay = false }: {
        mushroom: Mushroom | null;
        /** When true, renders the photographer credit as a translucent overlay
         *  pinned to the bottom of the image. */
        creditsOverlay?: boolean;
    } = $props();

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

    const picture = $derived(mushroom?.OToLId ? fetchOneZoomPic(mushroom.OToLId) : null);

    // The API answer can be cached while the image itself is not (or fails).
    let failedUrl: string | null = $state(null);
</script>

{#snippet noPhoto()}
    <p class="no-photo">{typeof navigator !== "undefined" && !navigator.onLine ? "Geen foto (offline)" : "Geen foto"}</p>
{/snippet}

{#if picture}
<div class="image-div">
    {#await picture}
        <div class="loading" aria-label="Foto laden" role="img"></div>
    {:then res}
        {#if failedUrl === res.url}
            {@render noPhoto()}
        {:else}
        <figure>
            <img
                    class="fit-picture"
                    src={res.url}
                    onerror={() => failedUrl = res.url}
                    alt={`Geverifieerde foto van ${mushroom!.id} gebracht door OneZoom`} />
            {#if creditsOverlay}
            <figcaption class="overlay">{res.by}</figcaption>
            {/if}
        </figure>
        {/if}
    {:catch}
        {@render noPhoto()}
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
        position: relative;
    }
    figure figcaption.overlay {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: 0;
        padding: 2px 4px;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-size: 0.65em;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .loading {
        width: 100%;
        aspect-ratio: 3 / 2;
        max-height: 220px;
        border-radius: var(--radius-sm);
        background: var(--c-surface-alt);
        animation: pulse 1.4s ease-in-out infinite;
    }
    @keyframes pulse {
        50% { opacity: 0.5; }
    }
    @media (prefers-reduced-motion: reduce) {
        .loading { animation: none; }
    }
    .no-photo {
        margin: 0;
        font-size: 0.75em;
        color: var(--c-text-muted);
        text-align: center;
    }
    img {
        width: 100%;
        max-height: 220px;
        object-fit: contain;
    }
</style>
