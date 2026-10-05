import { browser } from "$app/env";

// Chromium-only event, not in the DOM typings.
interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// How the app can be put on the home screen in this browser:
// - "installed":   already running as an installed app
// - "prompt":      the browser offered an install dialog we can open
// - "ios":         iPhone/iPad, through the share menu
// - "android":     Android, through the browser menu
// - "chromium":    Chrome/Edge on a computer, through the icon in the address bar
//                  (until they offer the dialog, which needs some time on the page)
// - "safari":      Safari on a Mac, through Archief › Voeg toe aan Dock
// - "unsupported": Firefox on a computer, which cannot install web apps
// - "manual":      anything else
export type InstallMode = "installed" | "prompt" | "ios" | "android" | "chromium" | "safari" | "unsupported" | "manual";

let deferred: BeforeInstallPromptEvent | null = null;

function platformMode(): InstallMode {
    if (!browser) return "manual";
    const ua = navigator.userAgent;
    // iPadOS presents itself as a Mac, but with a touch screen
    if (/iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
    if (/android/i.test(ua)) return "android";
    if (/firefox/i.test(ua)) return "unsupported";
    if (/chrome|chromium|edg\//i.test(ua)) return "chromium";
    if (/Macintosh/.test(ua) && /safari/i.test(ua)) return "safari";
    return "manual";
}

function initialMode(): InstallMode {
    if (!browser) return "manual";
    const standalone = window.matchMedia("(display-mode: standalone)").matches
        || (navigator as Navigator & { standalone?: boolean }).standalone === true;
    return standalone ? "installed" : platformMode();
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
    install.mode = outcome === "accepted" ? "installed" : platformMode();
}
