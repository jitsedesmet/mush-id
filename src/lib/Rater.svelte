<script lang="ts">
    import {page} from "$app/stores";
    import type {ParsedQuestion} from "$lib/viewModel/parser";
    import FancyButton from "$lib/FancyButton.svelte";

    export let currentQuestion: ParsedQuestion;

    $: otherOptions = [...$page.url.searchParams.entries()]
        .filter(([key]) => key !== "state")
        .map(([key, value]) => `${key}=${value}`).join("&");
    $: fillIn = otherOptions.length > 0 ? "&" : "";
    $: firstUrl = `${$page.route.id!}?${otherOptions}${fillIn}state=${$page.url.searchParams.get("state") || ""};${currentQuestion.first_link}`;
    $: secondUrl = `${$page.route.id!}?${otherOptions}${fillIn}state=${$page.url.searchParams.get("state") || ""};${currentQuestion.second_link}`;
    $: qId = currentQuestion.id;
</script>

<div class="outer">
    <div>Antwoord A:</div>
    <div>Antwoord B:</div>
        <div class="button-wrapper">
    <FancyButton class="outlined"
                 color="secondary"
            href={`${firstUrl}&${qId}=1`}>Mogelijks</FancyButton>

    </div>
    <FancyButton class="outlined"
                 color="secondary"
            href={`${secondUrl}&${qId}=-1`}>Mogelijks</FancyButton>

    <FancyButton class="outlined"
                 color="secondary"
            href={`${firstUrl}&${qId}=2`}>Waarschijnlijk</FancyButton>
    <FancyButton class="button-shaped-notch outlined"
            color="secondary"
            href={`${secondUrl}&${qId}=-2`}>Waarschijnlijk</FancyButton>


    <FancyButton class="outlined"
            color="secondary"
            href={`${firstUrl}&${qId}=3`}>Zeker</FancyButton>
    <FancyButton class="outlined"
                 color="secondary"
            href={`${secondUrl}&${qId}=-3`}>Zeker</FancyButton>
</div>


<style>
    .outer {
        display: grid;
        grid-template-columns: auto auto;
        gap: 5px;
        text-align: center;
    }
</style>
