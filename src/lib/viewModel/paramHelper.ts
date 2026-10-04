import {extractSubKeys, type ParsedQuestion, type ParsedQuestions} from "./parser";

export interface QuestionHistoryItem {
    question: string,
    voting: number
}

export interface pageRatingOptions {
    currentQuestion: string;
    questionHistory: QuestionHistoryItem[]
}

export function computeTagListUnsafe(params: Pick<URLSearchParams, "get">): pageRatingOptions {
    return computeTagList(params)!;
}

export function computeTagList(params: Pick<URLSearchParams, "get">): pageRatingOptions | undefined {
    const states = params.get("state")?.split(";");
    if (! states) {
        return undefined;
    }
    return {
        currentQuestion: states[states.length - 1],
        questionHistory: states.slice(0, states.length -1).map(state => {
            return {
                question: state,
                voting: Number(params.get(state)!)
            }
        })
    }
}

export interface LimitedQuestions {
    complete: ParsedQuestions;
    start: string;
    /** The requested sub-keys that exist; unknown ones are dropped. */
    scopedSubKeys: string[];
}

export function computeLimitedQuestions(params: Pick<URLSearchParams, "get">, parsedQuestions: ParsedQuestions): LimitedQuestions {
    const states = params.get("keys")?.split(";") || [];
    return questionLimiter(parsedQuestions, states);
}

/** Keeps only the sub-keys that exist in the key, without duplicates. */
export function validSubKeys(parsedQuestions: ParsedQuestions, subKeys: string[]): string[] {
    const known = extractSubKeys(parsedQuestions).filter(x => x !== "start1");
    return [...new Set(subKeys)].filter(x => known.includes(x));
}

export function questionLimiter(parsedQuestions: ParsedQuestions, requestedSubKeys: string[]): LimitedQuestions {
    // Unknown keys can come from an edited URL or from preferences saved by an
    // older version of the key; they would crash the search below.
    let scopedSubKeys = validSubKeys(parsedQuestions, requestedSubKeys);
    if (scopedSubKeys.length === 0) {
        return {
            complete: parsedQuestions,
            start: "start1",
            scopedSubKeys,
        }
    }

    // starting from the start key, we find the least amount of questions needed to reach the scopedQuestionIds
    // That will be scopedQuestionIds.length -1 questions
    // We first map all scopedSubKeys to the question that points to them
    const scopedSubKeysHistory: { [key: string]: string[] } = {};
    function buildHistory(question: ParsedQuestion, history: string[]): void {
        if (scopedSubKeys.includes(question.id)) {
            scopedSubKeysHistory[question.id] = history.reverse();
        }
        if (!question.id.startsWith("start")) {
            return;
        }
        if (parsedQuestions[question.first_link]) {
            buildHistory(parsedQuestions[question.first_link], history.concat(question.id));
        }
        if (parsedQuestions[question.second_link]) {
            buildHistory(parsedQuestions[question.second_link], history.concat(question.id));
        }
    }
    buildHistory(parsedQuestions["start1"], []);
    // Only sub-keys reachable through the start questions can be scoped to.
    scopedSubKeys = scopedSubKeys.filter(x => scopedSubKeysHistory[x]);
    if (scopedSubKeys.length === 0) {
        return { complete: parsedQuestions, start: "start1", scopedSubKeys };
    }

    const minimalSplits: string[] = [];
    for (let scopedSubKeyIndex = 0; scopedSubKeyIndex < scopedSubKeys.length -1; scopedSubKeyIndex++) {
        const scopedSubKey = scopedSubKeys[scopedSubKeyIndex];
        const reversedHistory = scopedSubKeysHistory[scopedSubKey];
        let foundMinimalQuestion = false;
        let questionIdIndex = 0;
        while (!foundMinimalQuestion && questionIdIndex < reversedHistory.length) {
            const questionId = reversedHistory[questionIdIndex];
            for (let i = scopedSubKeyIndex +1; i < scopedSubKeys.length; i++) {
                const otherStartId = scopedSubKeys[i];
                if (scopedSubKeysHistory[otherStartId].includes(questionId)) {
                    minimalSplits.push(questionId);
                    foundMinimalQuestion = true;
                    break;
                }
            }
            questionIdIndex++;
        }
    }

    const complete: ParsedQuestions = {};

    function buildSearch(question: ParsedQuestion, depth: number): { question: ParsedQuestion, atDepth: number } {
        if (scopedSubKeys.includes(question.id)) {
            return { question, atDepth: depth };
        }
        if (!question.id.startsWith("start")) {
            return { question, atDepth: Number.MAX_VALUE };
        }
        if (minimalSplits.includes(question.id)) {
            const questionCopy = { ...question };
            complete[question.id] = questionCopy;
            // We will need to change the links to the new ids

            // If the first link is in startKey, change it to the new id
            if (questionCopy.first_link.startsWith("start") && parsedQuestions[questionCopy.first_link]) {
                questionCopy.first_link = buildSearch(parsedQuestions[questionCopy.first_link], depth + 1).question.id;
            }

            // If the second link is in startKey, change it to the new id
            if (questionCopy.second_link.startsWith("start") && parsedQuestions[questionCopy.second_link]) {
                questionCopy.second_link = buildSearch(parsedQuestions[questionCopy.second_link], depth + 1).question.id;
            }
            return { question: questionCopy, atDepth: depth };
        } else {
            let left;
            let right;
            if (parsedQuestions[question.first_link]) {
                left = buildSearch(parsedQuestions[question.first_link], depth + 1);
            }
            if (parsedQuestions[question.second_link]) {
                right = buildSearch(parsedQuestions[question.second_link], depth + 1);
            }
            if ((left?.atDepth || Number.MAX_VALUE) < (right?.atDepth || Number.MAX_VALUE)) {
                return left!;
            } else {
                return right!;
            }
        }
    }
    const { question } = buildSearch(parsedQuestions["start1"], 0);

    // now populate the subkeys
    function copyRecursive(question: ParsedQuestion): void {
        complete[question.id] = { ...question };
        if (parsedQuestions[question.first_link]) {
            copyRecursive(parsedQuestions[question.first_link]);
        }
        if (parsedQuestions[question.second_link]) {
            copyRecursive(parsedQuestions[question.second_link]);
        }
    }
    for (const key of scopedSubKeys) {
        copyRecursive(parsedQuestions[key]);
    }

    return { complete, start: question.id, scopedSubKeys };
}
