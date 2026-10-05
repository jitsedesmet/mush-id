import { browser } from "$app/env";

// Chromium-only event, not in the DOM typings.
interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// How the app can be put on the home screen in this browser:
// - "installed": already running as an installed app
// - "prompt":    the browser offered an install dialog we can open (Chrome, Edge, Android)
// - "ios":       iPhone/iPad, where it only works through the share menu
// - "manual":    anything else; the browser may or may not offer it in its own menu
export type InstallMode = "installed" | "prompt" | "ios" | "manual";

let deferred: BeforeInstallPromptEvent | null = null;

function initialMode(): InstallMode {
    if (!browser) return "manual";
    const standalone = window.matchMedia("(display-mode: standalone)").matches
        || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return "installed";
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
        // iPadOS presents itself as a Mac
        || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    return ios ? "ios" : "manual";
}

export const install: { mode: InstallMode } = $state({ mode: initialMode() });

// Registered when the app loads rather than when the home page mounts: the
// browser fires the event once, possibly while another page is shown.
if (browser) {
    window.addEventListener("beforeinstallprompt", (event) => {
        event.preventDefault(); // keep the dialog for our own button
        deferred = event as BeforeInstallPromptEvent;
        install.mode = "prompt";
    });
    window.addEventListener("appinstalled", () => {
        deferred = null;
        install.mode = "installed";
    });
}

export async function promptInstall() {
    if (!deferred) return;
    const event = deferred;
    deferred = null; // a prompt can only be shown once
    await event.prompt();
    const { outcome } = await event.userChoice;
    // Dismissed: Chrome fires `beforeinstallprompt` again later, which brings the button back.
    install.mode = outcome === "accepted" ? "installed" : "manual";
}
