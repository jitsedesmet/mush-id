import { browser } from '$app/environment';
import {writable} from "svelte/store";
import {type ParsedQuestions} from "./parser";
import type {SavedLink, SavedLinks} from "./savedLinks";

export const preferredSubKeys = writable<string[]>(
    // The "||" handles the case when the key is the empty string
    browser ? (localStorage.getItem("preferredSubKeys") || undefined)?.split(";") || [] : []
);
preferredSubKeys.subscribe(x => {
    if (browser) localStorage.setItem("preferredSubKeys", x.join(";"));
});

function loadSavedHistory(): SavedLinks {
    const raw = JSON.parse(localStorage.getItem("savedHistory") || "{}");
    if (!raw.version) return { version: "1", links: [] };
    return Object.fromEntries(
        Object.entries(raw).map(([key, value]) => {
            if (key === "links") {
                return [key, (value as SavedLink[]).map((x: { creationDate: Date, link: string }) => ({
                    link: x.link,
                    creationDate: new Date(x.creationDate),
                }))];
            }
            return [key, value];
        })
    ) as unknown as SavedLinks;
}

export const savedHistory = writable<SavedLinks>(
    browser ? loadSavedHistory() : { version: "1", links: [] }
);
savedHistory.subscribe(x => {
    if (!browser) return;
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
