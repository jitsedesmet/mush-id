<script lang="ts">
    import {page} from "$app/stores";
    import FancyButton from "$lib/FancyButton.svelte";
    import {savedHistory} from "$lib/viewModel/viewModel";
    import {goto} from "$app/navigation";

    $: nextOptionUrl = `${$page.route.id!}/next-decision${$page.url.search}`;
</script>


<div class="container">
    <FancyButton id="not-that" style="grid-column: span 2"
                 href={nextOptionUrl}>Niet deze
    </FancyButton>

    <form method="POST" on:submit|preventDefault={() => {
        savedHistory.set({
            ...$savedHistory,
            links: $savedHistory.links.concat([{ creationDate: new Date(Date.now()), link: $page.url.href }])
        });
        goto(`/saved`)
    }}>
        <FancyButton class="outlined" color="secondary">
            Da is em! Save
        </FancyButton>
    </form>

    <FancyButton class="outlined" color="secondary"
                 href="/">Stoppen?
    </FancyButton>
</div>
<label for="not-that">Bekijk je geschiedenis en kies een punt om verder te gaan.</label>


<style>
    .container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 20px;
        row-gap: 5px;
    }
    form {
        margin: 0;
        padding: 0;
        display: contents;
    }
</style>
