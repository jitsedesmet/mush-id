import {extractSubKeys, parseMushroomCSV, parseQuestionsCSV} from "$lib/viewModel/parser";

export const ssr = false;

export async function load({ fetch }) {
    return {
        parsedQuestions: await parseQuestionsCSV(fetch),
        parsedMushrooms: await parseMushroomCSV(fetch),
    };
}