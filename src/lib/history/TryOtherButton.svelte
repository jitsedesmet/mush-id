<script lang="ts">
    import FancyButton from "$lib/FancyButton.svelte";
    import {page} from "$app/stores";

    export let alternative: string;

    $: otherOptions = [...$page.url.searchParams.entries()]
        .filter(([key]) => key !== "state")
        .map(([key, value]) => `${key}=${value}`).join("&");
    $: fillIn = otherOptions.length > 0 ? "&" : "";
    $: nextOptionUrl = `${$page.route.id!.replace("/next-decision", "")}?${otherOptions}${fillIn}state=${$page.url.searchParams.get("state") || ""};${alternative}`;
</script>

<div class="button-wrapper">
    <FancyButton class="outlined" color="secondary" href={nextOptionUrl}>
        Probeer alternatief
    </FancyButton>
</div>

<style>
    .button-wrapper {
        width: fit-content;
    }
</style>
