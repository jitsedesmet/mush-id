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

interface Question {
    id: string;
    first_option: string;
    first_link: StateItem;
    second_option: string;
    second_link: StateItem;
    probability: number;
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

export async function validateGraph(): Promise<Question> {
    const mushrooms = await parseMushroomCSVAsList();
    const parsedQuestions = await parseQuestionsCSV();
    function recursiveFilling(parsedQuestion: ParsedQuestion): Question {
        const partialAnswer: Partial<Question> = {
            id: parsedQuestion.id,
            first_option: parsedQuestion.first_option,
            second_option: parsedQuestion.second_option,
        }
        //Recursive first
        const firstAsMushroom = mushrooms.find(x => x.id === parsedQuestion.first_link)
        if (firstAsMushroom) {
            partialAnswer.first_link = firstAsMushroom;
        } else {
            const firstAsQuestion = parsedQuestions[parsedQuestion.first_link];
            if (!firstAsQuestion) {
                throw new Error(`Could not find a mushroom or question with id ${parsedQuestion.first_link}`)
            }
            partialAnswer.first_link = recursiveFilling(firstAsQuestion);
        }

        // Recursive second
        const secondAsMushroom = mushrooms.find(x => x.id === parsedQuestion.second_link)
        if (secondAsMushroom) {
            partialAnswer.second_link = secondAsMushroom;
        } else {
            const secondAsQuestion = parsedQuestions[parsedQuestion.second_link];
            if (!secondAsQuestion) {
                throw new Error(`Could not find a mushroom or question with id ${parsedQuestion.second_link}`)
            }
            partialAnswer.second_link = recursiveFilling(secondAsQuestion);
        }
        return <Question> partialAnswer;
    }
    return recursiveFilling(parsedQuestions["start1"]);
}

