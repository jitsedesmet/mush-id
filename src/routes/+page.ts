import {extractSubKeys, parseMushroomCSV, parseQuestionsCSV} from "$lib/viewModel/parser";

export const prerender = true;

export async function load({ fetch }) {
    const parsedQuestions = await parseQuestionsCSV(fetch);
    return {
        parsedQuestions,
        parsedMushrooms: await parseMushroomCSV(fetch),
        subKeys: extractSubKeys(parsedQuestions).filter(x => x !== "start1")
    };
}
