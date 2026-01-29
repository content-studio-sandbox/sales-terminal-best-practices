import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Theme } from "@carbon/react";

type CarbonTheme = "g10" | "g90"; // light | dark (header can stay g100)
type Ctx = { theme: CarbonTheme; toggle: () => void; setTheme: (t: CarbonTheme) => void };

const THEME_KEY = "carbon.theme";
const ThemeCtx = createContext<Ctx | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const initial = useMemo<CarbonTheme>(() => {
        const saved = (localStorage.getItem(THEME_KEY) || "").toLowerCase();
        return saved === "g90" ? "g90" : "g10";
    }, []);
    const [theme, setTheme] = useState<CarbonTheme>(initial);

    useEffect(() => {
        // apply to <html> so any non-Carbon CSS using tokens picks it up
        document.documentElement.setAttribute("data-carbon-theme", theme);
        localStorage.setItem(THEME_KEY, theme);
    }, [theme]);

    const value = useMemo<Ctx>(
        () => ({ theme, toggle: () => setTheme(t => (t === "g10" ? "g90" : "g10")), setTheme }),
        [theme]
    );

    // IMPORTANT: Wrap the page content in <Theme> so Carbon updates immediately.
    // key={theme} forces a tiny remount so any cached computed styles refresh.
    return (
        <ThemeCtx.Provider value={value}>
            <Theme theme={theme} key={theme}>
                {children}
            </Theme>
        </ThemeCtx.Provider>
    );
}

export function useAppTheme() {
    const ctx = useContext(ThemeCtx);
    if (!ctx) throw new Error("useAppTheme must be used inside <AppThemeProvider>");
    return ctx;
}
