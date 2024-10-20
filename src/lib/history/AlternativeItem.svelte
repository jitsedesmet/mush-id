<script lang="ts">
    import MarkdownQuestion from "$lib/MarkdownQuestion.svelte";
    import TryOtherButton from "$lib/history/TryOtherButton.svelte";
    import {page} from "$app/stores";
    import type {ParsedQuestion} from "$lib/viewModel/parser";

    export let question: ParsedQuestion;
    export let vote: number;

    $: chosenQuestion = (vote > 0) ? question.first_option : question.second_option;
    $: alternativeQuestion = (vote > 0) ? question.second_option : question.first_option;
    $: alternativeOption = (vote > 0) ? question.second_link : question.first_link;
</script>

{#if !$page.url.searchParams.has(alternativeOption)}
    <div class="one-step">
        <MarkdownQuestion markdownText={chosenQuestion} renderDetails={false}/>
        <div class="alternative">
            Alternatief:
            <MarkdownQuestion markdownText={alternativeQuestion} renderDetails={false}/>
            <TryOtherButton alternative={alternativeOption}/>
        </div>
    </div>
{/if}

<style>
    .one-step {
        padding: 10px 0;
    }
    .alternative {
        padding: 0 10px;
    }
</style>
