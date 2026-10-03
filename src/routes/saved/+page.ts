import {parseMushroomCSV} from "#lib/viewModel/parser.js";

export const ssr = false;

export async function load({ fetch }) {
    return {
        parsedMushrooms: await parseMushroomCSV(fetch),
    };
}