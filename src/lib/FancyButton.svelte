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
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        letter-spacing: 0.03em;
        border: none;
        text-decoration: none;
        cursor: pointer;
        border-radius: var(--radius-md);
        transition: background 0.18s, box-shadow 0.18s, transform 0.12s, color 0.18s;
        white-space: nowrap;
        -webkit-tap-highlight-color: transparent;
    }

    .button:active {
        transform: scale(0.97);
    }

    .primary {
        padding: 14px 32px;
        color: #fff;
        background: var(--c-primary);
        box-shadow: var(--shadow-sm);
    }

    .primary:hover,
    .primary:focus-visible {
        background: var(--c-primary-dark);
        box-shadow: var(--shadow-md);
    }

    .secondary {
        padding: 8px 20px;
        color: var(--c-primary-dark);
        background: var(--c-surface);
        border: 1.5px solid var(--c-border);
        box-shadow: var(--shadow-sm);
    }

    .secondary:hover,
    .secondary:focus-visible {
        background: var(--c-primary-pale);
        border-color: var(--c-primary-light);
        box-shadow: var(--shadow-md);
    }

    .outlined {
        /* already handled by .secondary; keep for legacy compatibility */
    }
</style>
