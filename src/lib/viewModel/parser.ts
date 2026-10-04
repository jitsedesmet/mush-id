import Papa from "papaparse";

export type Fetch = (
    input: string | URL | globalThis.Request,
    init?: RequestInit,
) => Promise<Response>;

async function fetchText(url: string, fetchApi?: Fetch | undefined): Promise<string> {
    const response = fetchApi ? await fetchApi(url) : await fetch(url);
    return await response.text();
}

export interface StateItem {
    id: string
}

export interface Mushroom extends StateItem {
    OToLId: string | null
    lifeUrl: string | null
    waarnemingId: string | null
}

export interface ParsedQuestion {
    id: string;
    first_option: string;
    first_link: string;
    second_option: string;
    second_link: string;
    probability: number;
}

async function parseMushroomCSVAsList(fetchApi?: Fetch): Promise<Mushroom[]> {
    const parsed = Papa.parse(await fetchText('/keys/9789050117548/mushrooms.csv', fetchApi), {
        header: true,
        skipEmptyLines: true,
    })
    if (parsed.errors.length !== 0) {
        throw new Error(parsed.errors.map(x => x.message).toString())
    }
    return (<{id: string, OToLId: string | null, lifeUrl: string | null, waarnemingId: string | null}[]> parsed.data)
        .map(x =>
        ({ id: x.id, OToLId: x.OToLId, lifeUrl:  x.lifeUrl, waarnemingId: x.waarnemingId }))
}

export function OidExtraction() {
}

export async function parseMushroomCSV(fetchApi?: Fetch): Promise<{ [key: string]: Mushroom }> {
    const res: { [key: string]: Mushroom } = {};
    (await parseMushroomCSVAsList(fetchApi)).forEach(x => res[x.id] = x)
    return res;
}

export function getMushroomsForSubKey(
    subKeyId: string,
    parsedQuestions: ParsedQuestions,
    parsedMushrooms: { [key: string]: Mushroom }
): Mushroom[] {
    const result: Mushroom[] = [];
    const visited = new Set<string>();

    function traverse(id: string): void {
        if (visited.has(id)) return;
        visited.add(id);
        if (parsedMushrooms[id]) {
            result.push(parsedMushrooms[id]);
        } else if (parsedQuestions[id]) {
            traverse(parsedQuestions[id].first_link);
            traverse(parsedQuestions[id].second_link);
        }
    }

    traverse(subKeyId);
    return result.sort((a, b) => a.id.localeCompare(b.id));
}

export type ParsedQuestions = { [key: string]: ParsedQuestion };

export async function parseQuestionsCSV(fetchApi?: Fetch): Promise<ParsedQuestions> {
    const parsed = Papa.parse(await fetchText('/keys/9789050117548/questions.csv', fetchApi), {
        header: true,
        skipEmptyLines: true
    })
    if (parsed.errors.length !== 0) {
        throw new Error(parsed.errors.map(x => x.message).toString())
    }
    const unpopulated: { [key: string]: ParsedQuestion } = {};
    (<ParsedQuestion[]> parsed.data).forEach(x => unpopulated[x.id] = x);
    return unpopulated;
}

export function extractSubKeys(parsedQuestions: ParsedQuestions): string[] {
    return Object.keys(parsedQuestions).filter(x => x.match(/^[a-z]+1$/));
}
