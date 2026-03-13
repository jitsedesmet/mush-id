import {extractSubKeys, getMushroomsForSubKey, parseMushroomCSV, parseQuestionsCSV} from "$lib/viewModel/parser";
import {error} from "@sveltejs/kit";

export const ssr = false;

export async function load({ fetch, url }) {
    const keyParam = url.searchParams.get("key");
    const parsedQuestions = await parseQuestionsCSV(fetch);
    const subKeys = extractSubKeys(parsedQuestions).filter(x => x !== "start1");

    if (!keyParam) {
        // No key selected: show the index of all sub-keys
        return {
            key: null,
            keyName: null,
            mushrooms: null,
            subKeys,
        };
    }

    if (!subKeys.includes(keyParam)) {
        error(404, "Deelsleutel niet gevonden");
    }

    const parsedMushrooms = await parseMushroomCSV(fetch);
    return {
        key: keyParam,
        keyName: keyParam.substring(0, keyParam.length - 1),
        mushrooms: getMushroomsForSubKey(keyParam, parsedQuestions, parsedMushrooms),
        subKeys,
    };
}
