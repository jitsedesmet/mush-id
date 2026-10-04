import { browser } from '$app/env';
import {get, writable} from "svelte/store";
import {type ParsedQuestions} from "./parser";
import type {SavedLink, SavedLinks} from "./savedLinks";

export const preferredSubKeys = writable<string[]>(
    // The "||" handles the case when the key is the empty string
    browser ? (localStorage.getItem("preferredSubKeys") || undefined)?.split(";") || [] : []
);
preferredSubKeys.subscribe(x => {
    if (browser) localStorage.setItem("preferredSubKeys", x.join(";"));
});

// Keeps only the newest entry per link. Older versions of the app could save
// the same link twice, which broke the keyed list on the saved page.
function dedupeLinks(links: SavedLink[]): SavedLink[] {
    const newest = new Map<string, SavedLink>();
    for (const item of links) {
        const existing = newest.get(item.link);
        if (!existing || existing.creationDate < item.creationDate) newest.set(item.link, item);
    }
    return [...newest.values()];
}

function loadSavedHistory(): SavedLinks {
    const raw = JSON.parse(localStorage.getItem("savedHistory") || "{}");
    if (!raw.version) return { version: "1", links: [] };
    const parsed = Object.fromEntries(
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
    return { ...parsed, links: dedupeLinks(parsed.links) };
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

/** Saves a link, or moves it to the top with a fresh date if it was already saved. */
export function saveLink(link: string) {
    const current = get(savedHistory);
    savedHistory.set({
        ...current,
        links: current.links
            .filter(x => x.link !== link)
            .concat([{ link, creationDate: new Date() }]),
    });
}

export function removeSavedLink(link: string) {
    const current = get(savedHistory);
    savedHistory.set({
        ...current,
        links: current.links.filter(x => x.link !== link),
    });
}

export function computeCombinedScore(questionId: string, userAnswer: number, parsedQuestions: ParsedQuestions): number {
    const question = parsedQuestions[questionId];
    return Math.sign(userAnswer) * Math.sqrt([0.6, 0.8, 1][Math.abs(userAnswer) - 1] * question.probability);
}
