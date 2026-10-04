<script lang="ts">
    import type {Snippet} from "svelte";

    let { href, class: className = "", color = "primary", id, style, children }: {
        href?: string;
        class?: string;
        color?: "primary" | "secondary";
        id?: string;
        style?: string;
        children: Snippet;
    } = $props();
</script>

{#if href}
    <a {id} class="button {className} {color}" {href} {style}>
        {@render children()}
    </a>
{:else}
    <button {id} class="button {className} {color}" {style}>
        {@render children()}
    </button>
{/if}

<style>
    .button {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 10px 18px;
        font-weight: 500;
        line-height: 1.3;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
        border-radius: var(--radius-md);
        border: 1px solid transparent;
        transition: background 0.12s, border-color 0.12s;
        -webkit-tap-highlight-color: transparent;
    }

    .primary {
        color: #fff;
        background: var(--c-primary);
    }

    .primary:hover,
    .primary:focus-visible {
        color: #fff;
        background: var(--c-primary-dark);
    }

    .secondary {
        color: var(--c-text);
        background: var(--c-surface);
        border-color: var(--c-border);
    }

    .secondary:hover,
    .secondary:focus-visible {
        color: var(--c-text);
        border-color: var(--c-primary-light);
        background: var(--c-primary-pale);
    }
</style>
