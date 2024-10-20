<svelte:head>
    <title>Mush ID</title>
    <meta name="description" content="paddenstoel identificatie applicatie">
</svelte:head>

<script lang="ts">
    import type { PageData } from './$types';
    import { preferredSubKeys } from "$lib/viewModel/viewModel";
    import Hex from "$lib/etc/Hex.svelte";
    import {goto} from "$app/navigation";
    import {questionLimiter} from "$lib/viewModel/paramHelper";
    import FancyButton from "$lib/FancyButton.svelte";
    export let data: PageData;

    $: keys = data.subKeys.map(val => ({
        value: val,
        name: val.substring(0,1).toUpperCase() + val.substring(1, val.length - 1),
    })) || [];

    let selectedKeys = $preferredSubKeys || [];
</script>

<h1>Welkom bij Mush-ID</h1>

In deze web applicatie helpen we jou doorheen binaire identificatie sleutels.<br/>
U kan deze applicatie zelf installeren, toevoegen aan je thuis scherm, je hebt voor het gebruik niet eens internet nodig!
<br/>

<form method="POST" on:submit|preventDefault={() => {
    console.log(selectedKeys)
    const limiter = questionLimiter(data.parsedQuestions, selectedKeys);
    preferredSubKeys.set(selectedKeys);

    if (selectedKeys.length > 0) {
        goto(`/9789050117548/?keys=${selectedKeys.join(';')}&state=${limiter.start}`)
    } else {
        goto(`/9789050117548/?state=start1`)
    }
}}>
    <div class="button-wrapper">
        <FancyButton color="primary">START DE TEST</FancyButton>
    </div>

    <details>
        <summary>Kies actieve deelsleutels ({selectedKeys.length === 0 ? "alle" : String(selectedKeys.length)})</summary>
        <div id='active_keys'>
            {#each keys as key}
            <span>
                <input type="checkbox" id={key.value} value={key.value} name="keys" bind:group={selectedKeys}>
                <label for={key.value}>{key.name}</label>
            </span>
            {/each}
        </div>
    </details>
</form>

De sleutel is afkomstig van de <a href="https://knnvuitgeverij.nl/artikel/veldgids-paddenstoelen-i-2.html">Veldgids Paddenstoelen I</a>
geschreven door Nico Dam en Thomas W. Kuyper, uitgegeven door KNNV Uitgeverij, ISBN: 9789050117548.
Voor het gebruik van de sleutel moet ik nog de toestemming vragen.

<div>
    <FancyButton color="secondary" class="outlined"
                href="/saved">Saved</FancyButton>
</div>


<Hex/>



<style>
    #active_keys {
        display: grid;
        align-self: center;
        grid-template-columns: 1fr;
        grid-gap: 10px;
    }
    summary {
        cursor: pointer;
        text-decoration: underline;
    }
    div {
        display: flex;
        width: 100%;
        justify-content: center;
        margin-bottom: 20px;
    }
    .button-wrapper {
        margin: 20px auto 20px auto;
    }
</style>
