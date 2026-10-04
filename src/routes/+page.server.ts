import {extractSubKeys, parseQuestionsCSV} from "#lib/viewModel/parser.js";

export const prerender = true;

// A server load, so only the sub-key names end up in the prerendered page.
// A universal load would also inline the whole questions.csv it fetched.
// The key page works out where to start.
export async function load({ fetch }) {
    return {
        subKeys: extractSubKeys(await parseQuestionsCSV(fetch)).filter(x => x !== "start1"),
    };
}
