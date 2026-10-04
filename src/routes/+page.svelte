<svelte:head>
    <title>Mush-ID — Paddenstoelen identificatie</title>
    <meta name="description" content="Identificeer paddenstoelen stap voor stap met behulp van binaire sleutels uit de Veldgids Paddenstoelen I van Nico Dam en Thomas W. Kuyper.">
    <link rel="canonical" href="https://mush-id.jitsedesmet.be/">
    <!-- Open Graph (overrides defaults in app.html) -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://mush-id.jitsedesmet.be/">
    <meta property="og:site_name" content="Mush-ID">
    <meta property="og:title" content="Mush-ID — Paddenstoelen identificatie">
    <meta property="og:description" content="Identificeer paddenstoelen stap voor stap met behulp van binaire sleutels uit de Veldgids Paddenstoelen I van Nico Dam en Thomas W. Kuyper.">
    <meta property="og:locale" content="nl_NL">
    <meta property="og:image" content="https://mush-id.jitsedesmet.be/og-image.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Mush-ID — Paddenstoelen identificatie">
    <!-- Twitter / X Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Mush-ID — Paddenstoelen identificatie">
    <meta name="twitter:description" content="Identificeer paddenstoelen stap voor stap met behulp van binaire sleutels uit de Veldgids Paddenstoelen I.">
    <meta name="twitter:image" content="https://mush-id.jitsedesmet.be/og-image.png">
</svelte:head>

<script lang="ts">
    import type { PageData } from './$types';
    import { preferredSubKeys } from "#lib/viewModel/viewModel.js";
    import {goto} from "$app/navigation";
    import {resolve} from "$app/paths";
    import FancyButton from "#lib/FancyButton.svelte";
    let { data }: { data: PageData } = $props();

    const keys = $derived(data.subKeys.map(val => ({
        value: val,
        name: val.substring(0,1).toUpperCase() + val.substring(1, val.length - 1),
    })));

    // Saved preferences may name sub-keys that no longer exist.
    let selectedKeys = $state(($preferredSubKeys || []).filter(x => data.subKeys.includes(x)));
</script>

<div vocab="https://schema.org/" typeof="WebApplication" class="home">
    <meta property="name" content="Mush-ID">
    <meta property="applicationCategory" content="UtilityApplication">
    <meta property="operatingSystem" content="All">
    <meta property="inLanguage" content="nl">
    <link property="url" href="https://mush-id.jitsedesmet.be/">

    <section class="intro">
        <h1>Paddenstoelen op naam brengen</h1>
        <p class="lead" property="description">
            Doorloop de tweedelige sleutel uit de Veldgids Paddenstoelen&nbsp;I, één vraag tegelijk.
            Twijfel je? Geef aan hoe zeker je bent, dan kan je later een ander pad proberen.
        </p>
        <p class="muted small">Zet de app op je thuisscherm om hem ook offline te gebruiken.</p>
    </section>

    <form method="POST" class="start" onsubmit={(event) => {
        event.preventDefault();
        preferredSubKeys.set(selectedKeys);

        if (selectedKeys.length > 0) {
            goto(resolve(`/9789050117548?keys=${selectedKeys.join(';')}`))
        } else {
            goto(resolve(`/9789050117548?state=start1`))
        }
    }}>
        <FancyButton color="primary">Start de sleutel</FancyButton>

        <details class="key-filter">
            <summary>
                Beperken tot deelsleutels
                <span class="muted">({selectedKeys.length === 0 ? "alle" : `${selectedKeys.length} gekozen`})</span>
            </summary>
            <div id='active_keys'>
                {#each keys as key (key.value)}
                <label class="key-option">
                    <input type="checkbox" value={key.value} name="keys" bind:group={selectedKeys}>
                    <span>{key.name}</span>
                </label>
                {/each}
            </div>
        </details>
    </form>

    <ul class="more">
        <li><a href={resolve("/9789050117548/soorten")}>Soorten per deelsleutel bekijken</a></li>
        <li><a href={resolve("/saved")}>Opgeslagen zoekopdrachten</a></li>
    </ul>

    <footer class="attribution" property="isBasedOn" typeof="Book">
        Sleutel ontleend aan de
        <a href="https://knnvuitgeverij.nl/artikel/veldgids-paddenstoelen-i-2.html" target="_blank" rel="noopener" property="url">
            <span property="name">Veldgids Paddenstoelen I</span></a>
        door <span property="author" typeof="Person"><span property="name">Nico Dam</span></span> &amp;
        <span property="author" typeof="Person"><span property="name">Thomas W. Kuyper</span></span>
        (<span property="publisher" typeof="Organization"><span property="name">KNNV Uitgeverij</span></span>,
        ISBN&nbsp;<span property="isbn">9789050117548</span>).
        Toestemming voor gebruik wordt nog aangevraagd.
    </footer>
</div>


<style>
    .home {
        display: flex;
        flex-direction: column;
        gap: 28px;
        flex: 1;
        max-width: 560px;
    }

    .intro h1 {
        margin-bottom: 12px;
    }

    .lead {
        font-size: 1.08em;
        margin: 0 0 8px;
    }

    .small {
        font-size: 0.88em;
        margin: 0;
    }

    .start {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .key-filter {
        width: 100%;
    }

    .key-filter summary {
        cursor: pointer;
        user-select: none;
        color: var(--c-primary);
    }

    .key-filter summary:hover {
        color: var(--c-primary-dark);
    }

    #active_keys {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(9em, 1fr));
        gap: 0 12px;
        margin-top: 10px;
        padding: 8px 12px;
        background: var(--c-surface);
        border: 1px solid var(--c-border);
        border-radius: var(--radius-md);
    }

    .key-option {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 5px 0;
        cursor: pointer;
    }

    .key-option input[type="checkbox"] {
        accent-color: var(--c-primary);
        width: 16px;
        height: 16px;
        margin: 0;
    }

    .more {
        list-style: none;
        margin: 0;
        padding: 0;
        border-top: 1px solid var(--c-border);
    }

    .more li {
        border-bottom: 1px solid var(--c-border);
    }

    .more a {
        display: block;
        padding: 12px 0;
        text-decoration: none;
    }

    .more a::after {
        content: " →";
    }

    .more a:hover {
        text-decoration: underline;
    }

    .attribution {
        margin-top: auto;
        padding: 16px 0 24px;
        font-size: 0.82em;
        color: var(--c-text-muted);
    }
</style>
