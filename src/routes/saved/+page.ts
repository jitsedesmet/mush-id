import {parseMushroomCSV} from "#lib/viewModel/parser.js";

export const ssr = false;
// Prerendered as an empty shell so `/saved` is a real file (HTTP 200) on GitHub Pages.
export const prerender = true;

export async function load({ fetch }) {
    return {
        parsedMushrooms: await parseMushroomCSV(fetch),
    };
}