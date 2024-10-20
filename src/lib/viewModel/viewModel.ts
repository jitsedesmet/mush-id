import {writable} from "svelte/store";
import {type ParsedQuestions} from "./parser";
import type {SavedLink, SavedLinks} from "./savedLinks";

export const preferredSubKeys = writable(
    // The "||" handles the case when the key is the empty string
    (localStorage.getItem("preferredSubKeys") || undefined)?.split(";") || []
);
preferredSubKeys.subscribe(x => localStorage.setItem("preferredSubKeys", x.join(";")));

export const savedHistory = writable<SavedLinks>(
    JSON.parse(localStorage.getItem("savedHistory") || "{}").version ?
        (
            Object.fromEntries(Object.entries(JSON.parse(localStorage.getItem("savedHistory") || "{}"))
                .map(([key, value]) => {
                    if (key === "links") {
                        return [key, (value as SavedLink[]).map((x: { creationDate: Date, link: string }) => {
                            return {
                                link: x.link,
                                creationDate: new Date(x.creationDate),
                            }
                        })];
                    }
                    return [key, value];
                })
            ) as unknown as SavedLinks
        ) : { version: "1", links: [] }
)
savedHistory.subscribe(x => {
    if (x.version !== "1") {
        x.version = "1";
        x.links = [];
    }
    localStorage.setItem("savedHistory", JSON.stringify({
        version: x.version,
        links: x.links.map((x: { creationDate: Date, link: string }) => {
            return {
                link: x.link,
                creationDate: x.creationDate.toISOString()
            }
        })
    }));
});

export function computeCombinedScore(questionId: string, userAnswer: number, parsedQuestions: ParsedQuestions): number {
    const question = parsedQuestions[questionId];
    return Math.sign(userAnswer) * Math.sqrt([0.6, 0.8, 1][Math.abs(userAnswer) - 1] * question.probability);
}
