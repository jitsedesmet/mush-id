<script lang="ts">
    import {page} from "$app/state";
    import {resolve} from "$app/paths";
    import FancyButton from "#lib/FancyButton.svelte";

    const notFound = $derived(page.status === 404);
</script>

<svelte:head>
    <title>{notFound ? "Niet gevonden" : "Er ging iets mis"} | Mush-ID</title>
    <meta name="robots" content="noindex">
</svelte:head>

<div class="error">
    <h1>{notFound ? "Deze pagina bestaat niet" : "Er ging iets mis"}</h1>

    {#if notFound}
        <p>
            {page.error?.message && page.error.message !== "Not Found" ? `${page.error.message}. ` : ""}
            Misschien is de link onvolledig of komt hij uit een oudere versie van de app.
        </p>
    {:else}
        <p>De pagina kon niet geladen worden. Probeer het opnieuw, of begin opnieuw aan de sleutel.</p>
        <p class="muted small">Foutcode {page.status}{page.error?.message ? `: ${page.error.message}` : ""}</p>
    {/if}

    <div class="actions">
        <FancyButton color="primary" href={resolve("/")}>Naar de sleutel</FancyButton>
        <FancyButton color="secondary" href={resolve("/9789050117548/soorten")}>Soorten bekijken</FancyButton>
    </div>
</div>

<style>
    .error {
        max-width: 560px;
        padding-bottom: 32px;
    }

    .small {
        font-size: 0.88em;
    }

    .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 20px;
    }
</style>
