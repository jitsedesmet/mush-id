<script lang="ts">
    let { title, text, url }: { title: string; text: string; url: string } = $props();

    let copied = $state(false);
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function share() {
        // The system share sheet on phones (and Windows/macOS); copy the link elsewhere.
        if (navigator.share) {
            try {
                await navigator.share({ title, text, url });
            } catch {
                // Closed without sharing.
            }
            return;
        }
        try {
            await navigator.clipboard.writeText(url);
            copied = true;
            clearTimeout(timer);
            timer = setTimeout(() => copied = false, 2500);
        } catch {
            // Clipboard refused (e.g. no permission): nothing sensible left to do.
        }
    }
</script>

<button type="button" class="share" onclick={share}>
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <span aria-live="polite">{copied ? "Link gekopieerd" : "Delen"}</span>
</button>

<style>
    .share {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-height: 36px;
        padding: 0 12px;
        font: inherit;
        font-size: 0.88em;
        color: var(--c-primary);
        background: var(--c-surface);
        border: 1px solid var(--c-primary-border);
        border-radius: var(--radius-md);
        cursor: pointer;
        white-space: nowrap;
        -webkit-tap-highlight-color: transparent;
    }

    .share:hover,
    .share:focus-visible {
        color: var(--c-primary-dark);
        background: var(--c-primary-pale);
    }
</style>
