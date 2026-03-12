<script lang="ts">
    import {page} from "$app/stores";
    import FancyButton from "$lib/FancyButton.svelte";
    import {savedHistory} from "$lib/viewModel/viewModel";
    import {goto} from "$app/navigation";
    import {resolve} from "$app/paths";

    $: nextOptionUrl = `${$page.route.id!}/next-decision${$page.url.search}`;
</script>

<div class="deny-container">
    <FancyButton id="not-that" color="primary"
                 href={nextOptionUrl}>Niet deze
    </FancyButton>

    <form method="POST" on:submit|preventDefault={() => {
        savedHistory.set({
            ...$savedHistory,
            links: $savedHistory.links.concat([{ creationDate: new Date(Date.now()), link: $page.url.href }])
        });
        goto(resolve(`/saved`))
    }}>
        <FancyButton color="secondary">
            Da is em! Opslaan
        </FancyButton>
    </form>

    <FancyButton color="secondary"
                 href="/">Stoppen
    </FancyButton>
</div>
<p class="deny-hint">Bekijk je geschiedenis en kies een punt om verder te gaan.</p>


<style>
    .deny-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        width: 100%;
    }

    .deny-container :global(.button.primary) {
        grid-column: span 2;
    }

    form {
        margin: 0;
        padding: 0;
        display: contents;
    }

    .deny-hint {
        font-size: 0.8em;
        color: var(--c-text-muted);
        margin: 6px 0 0;
        text-align: center;
    }
</style>
