<script lang="ts">
    export let href : string | undefined = undefined;
    let className: string = "";
    export let color: "primary" | "secondary" = "primary";
    export let id: string | undefined = undefined;
    export let style: string | undefined = undefined;

    export { className as class };
</script>

{#if href}
    <a {id} class="button {className} {color}" href={href} {style}>
        <slot>
            No Content?
        </slot>
    </a>
{:else}
    <button {id} class="button {className} {color}" {style}>
        <slot>
            No Content?
        </slot>
    </button>
{/if}

<style>
    .button {
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;

        border: none;
        text-decoration: underline;
        cursor: pointer;
    }
    .primary {
        border-radius: 9px;
        padding: 16px 33px;
        color: white;
        background: red;
    }
    .secondary {
        border-radius: 5px;
        padding: 8px 33px;
        color: grey;
        background: white;
    }
    .outlined {
        border: 1px solid black;
    }
</style>
