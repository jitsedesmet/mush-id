<script lang="ts">
    import DOMPurify from "dompurify";
    import {marked} from "marked";

    export let markdownText = "";
    export let link: string | undefined = undefined;
    export let renderDetails = true;

    function removeImages(markdown : string): { markdown: string, details: {term: string, details: string}[], images: {src: string, alt: string}[] } {
        const images = [...markdown.matchAll(/<img alt="([^"]*)" src="([^"]+)">/g)];
        for (const image of images) {
            markdown = markdown.replace(image[0], "");
        }

        // Find tooltips
        const details = [...markdown.matchAll(/\[([^\]]*)\]\(([^)]*)\)/gu)];
        for (const detail of details) {
            markdown = markdown.replace(detail[0], detail[1]);
        }
        console.log(details);

        return {
            markdown,
            images: images.map(x => ({ src: x[2], alt: x[1]})),
            details: details.map(x => ({ term: x[1], details: x[2] }))
        };
    }

    $: parsedMarkdown =  DOMPurify.sanitize(marked.parseInline(markdownText, { gfm: true, breaks: true }));
    $: cleansed = removeImages(parsedMarkdown);
</script>

<div>

    {#if (cleansed.images.length === 0 && cleansed.details.length === 0) || !renderDetails}
        {@html cleansed.markdown} {#if link}-> {link}{/if}
    {:else}
        <details>
            <summary>{@html cleansed.markdown} <em>(<u>Meer info</u>)</em> {#if link}-> {link}{/if}</summary>

            <div class="term-definitions">
                {#each cleansed.details as detail}
                    <div>
                        <strong>{detail.term}</strong>: {detail.details}
                    </div>
                {/each}
            </div>

            <div class="image-div">
                {#each cleansed.images as image}
                    <div class="single-item">
                        <p>{image.alt}:</p>
                        <img src={image.src} alt={`caption: ${image.alt}`} />
                    </div>
                {/each}
            </div>
        </details>
    {/if}

</div>

<style>
    .image-div {
        margin: auto auto;
        padding: 10px 0;
        display: grid;
        grid-template-columns: 1fr 1fr ;
        gap: 10px;
        max-width: 80%;
    }
    .single-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .image-div img {
        max-width: 100%;
        max-height: 200px;
        object-fit: scale-down;
    }
    .image-div p {
        word-wrap: break-word;
        padding: 0;
        margin: 0;
    }
    @media (max-width: 800px) {
        .image-div {
            grid-template-columns: 1fr;
        }
    }
</style>
