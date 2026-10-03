<script lang="ts">
    import FancyButton from "#lib/FancyButton.svelte";
    import {page} from "$app/state";

    let { alternative }: { alternative: string } = $props();

    const otherOptions = $derived([...page.url.searchParams.entries()]
        .filter(([key]) => key !== "state")
        .map(([key, value]) => `${key}=${value}`).join("&"));
    const fillIn = $derived(otherOptions.length > 0 ? "&" : "");
    const nextOptionUrl = $derived(`${page.route.id!.replace("/next-decision", "")}?${otherOptions}${fillIn}state=${page.url.searchParams.get("state") || ""};${alternative}`);
</script>

<div class="button-wrapper">
    <FancyButton color="secondary" href={nextOptionUrl}>
        Probeer alternatief
    </FancyButton>
</div>

<style>
    .button-wrapper {
        width: fit-content;
    }
</style>
