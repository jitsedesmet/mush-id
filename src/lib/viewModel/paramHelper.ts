import type {ParsedQuestion, ParsedQuestions} from "./parser";

export interface QuestionHistoryItem {
    question: string,
    voting: number
}

export interface pageRatingOptions {
    currentQuestion: string;
    questionHistory: QuestionHistoryItem[]
}

export function computeTagListUnsafe(params: URLSearchParams): pageRatingOptions {
    return computeTagList(params)!;
}

export function computeTagList(params: URLSearchParams): pageRatingOptions | undefined {
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

export function computeNextItem(history: QuestionHistoryItem[], parsedQuestions: ParsedQuestions): { splitPoint: string, otherBranch: string } {
    const reversedHistory = history.reverse();
    let certaintyLevel = 0;
    while (certaintyLevel <= 3) {
        let index = 0;
        while (index < reversedHistory.length) {
            if (Math.abs(reversedHistory[index].voting) === certaintyLevel) {
                const focusQuestion: ParsedQuestion | null = parsedQuestions[reversedHistory[index].question]

                // It might not be a question but a mushroom
                if (focusQuestion) {
                    const hasFirstOption = history.some(x => x.question === focusQuestion.first_link);
                    const hasSecondOption = history.some(x => x.question === focusQuestion.second_link);
                    if (hasFirstOption && !hasSecondOption) {
                        return {
                            otherBranch: focusQuestion.second_link,
                            splitPoint: focusQuestion.id,
                        };
                    } else if (hasSecondOption && !hasFirstOption) {
                        return {
                            otherBranch: focusQuestion.first_link,
                            splitPoint: focusQuestion.id,
                        }
                    }
                }
            }
            index++;
        }
        certaintyLevel++;
    }
    throw new Error("Damn son, you went through the whole key?")
}

export function computeLimitedQuestions(params: URLSearchParams, parsedQuestions: ParsedQuestions): { complete: ParsedQuestions; start: string } {
    const states = params.get("keys")?.split(";") || [];
    return questionLimiter(parsedQuestions, states);
}

export function questionLimiter(parsedQuestions: ParsedQuestions, scopedSubKeys: string[]): { complete: ParsedQuestions; start: string } {
    if (scopedSubKeys.length === 0) {
        return {
            complete: parsedQuestions,
            start: "start1"
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

    return { complete, start: question.id };
}
