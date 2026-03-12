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
    import { preferredSubKeys } from "$lib/viewModel/viewModel";
    import {goto} from "$app/navigation";
    import {resolve} from "$app/paths";
    import {questionLimiter} from "$lib/viewModel/paramHelper";
    import FancyButton from "$lib/FancyButton.svelte";
    export let data: PageData;

    $: keys = data.subKeys.map(val => ({
        value: val,
        name: val.substring(0,1).toUpperCase() + val.substring(1, val.length - 1),
    })) || [];

    let selectedKeys = $preferredSubKeys || [];
</script>

<div vocab="https://schema.org/" typeof="WebApplication" class="home-wrapper">
    <meta property="name" content="Mush-ID">
    <meta property="applicationCategory" content="UtilityApplication">
    <meta property="operatingSystem" content="All">
    <meta property="inLanguage" content="nl">
    <link property="url" href="https://mush-id.jitsedesmet.be/">
    <!-- Hero section -->
    <section class="hero">
        <h1>Welkom bij Mush-ID</h1>
        <p class="subtitle" property="description">
            Identificeer paddenstoelen stap voor stap met behulp van binaire sleutels.
            Installeer de app op je thuisscherm — ook offline beschikbaar!
        </p>
    </section>

    <!-- Start form card -->
    <section class="card start-card">
        <form method="POST" on:submit|preventDefault={() => {
            const limiter = questionLimiter(data.parsedQuestions, selectedKeys);
            preferredSubKeys.set(selectedKeys);

            if (selectedKeys.length > 0) {
                goto(resolve(`/9789050117548?keys=${selectedKeys.join(';')}&state=${limiter.start}`))
            } else {
                goto(resolve(`/9789050117548?state=start1`))
            }
        }}>
            <div class="start-btn-row">
                <FancyButton color="primary">START DE SLEUTEL</FancyButton>
            </div>

            <details class="key-filter">
                <summary>Deelsleutels filteren
                    <span class="badge">{selectedKeys.length === 0 ? "alle" : String(selectedKeys.length)}</span>
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

        <div class="saved-row">
            <FancyButton color="secondary" href="/saved">Opgeslagen zoekopdrachten</FancyButton>
        </div>
    </section>

    <!-- Attribution -->
    <p class="attribution" property="isBasedOn" typeof="Book">
        Sleutel ontleend aan de
        <a href="https://knnvuitgeverij.nl/artikel/veldgids-paddenstoelen-i-2.html" target="_blank" rel="noopener" property="url">
            <span property="name">Veldgids Paddenstoelen I</span>
        </a>
        door <span property="author" typeof="Person"><span property="name">Nico Dam</span></span> &amp;
        <span property="author" typeof="Person"><span property="name">Thomas W. Kuyper</span></span>
        (<span property="publisher" typeof="Organization"><span property="name">KNNV Uitgeverij</span></span>,
        ISBN&nbsp;<span property="isbn">9789050117548</span>).
        Toestemming voor gebruik wordt nog aangevraagd.
    </p>
</div>


<style>
    .home-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        padding: 8px 0 32px;
        width: 100%;
    }

    /* ── Hero ── */
    .hero {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 8px;
        width: 100%;
    }

    .subtitle {
        color: var(--c-text-muted);
        font-size: 1em;
        max-width: 480px;
        line-height: 1.6;
        margin: 0;
    }

    /* ── Card ── */
    .card {
        background: var(--c-surface);
        border: 1px solid var(--c-border);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-sm);
        padding: 24px;
        width: 100%;
        max-width: 480px;
    }

    .start-btn-row {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

    /* ── Key filter ── */
    .key-filter {
        border: 1px solid var(--c-border);
        border-radius: var(--radius-md);
        padding: 0;
        overflow: hidden;
    }

    .key-filter summary {
        cursor: pointer;
        user-select: none;
        padding: 10px 14px;
        font-weight: 500;
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--c-surface-alt);
        color: var(--c-primary-dark);
    }

    .key-filter summary::-webkit-details-marker { display: none; }

    .key-filter[open] summary {
        border-bottom: 1px solid var(--c-border);
    }

    .badge {
        background: var(--c-primary);
        color: #fff;
        font-size: 0.78em;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 99px;
        min-width: 2em;
        text-align: center;
    }

    #active_keys {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px 8px;
        padding: 12px 14px;
    }

    .key-option {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 0.95em;
        cursor: pointer;
        padding: 4px 2px;
        border-radius: var(--radius-sm);
    }

    .key-option:hover {
        background: var(--c-primary-pale);
    }

    .key-option input[type="checkbox"] {
        accent-color: var(--c-primary);
        width: 16px;
        height: 16px;
    }

    /* ── Saved row ── */
    .saved-row {
        margin-top: 16px;
        display: flex;
        justify-content: center;
    }

    /* ── Attribution ── */
    .attribution {
        font-size: 0.82em;
        color: var(--c-text-muted);
        text-align: center;
        max-width: 480px;
        line-height: 1.6;
        margin: 0;
    }
</style>
