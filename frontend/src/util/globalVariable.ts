import { type ThemeOption } from "../lib/types";

export function getBaseColor() {
    return {
        lightPrimary: "#1876d2",
        darkPrimary: "#90caf9",
        white: "#ffffff",
        black: "#272727",
        greyLight: "#bdbdbd",
        greyDark: "#9e9e9e"
    }
};

export function getTargetBaseColor(isOutLineTheme: boolean, isLightTheme: boolean): string {
    const baseColor = getBaseColor();
    return isOutLineTheme ? isLightTheme ? baseColor.lightPrimary : baseColor.darkPrimary : baseColor.white;
}

export function getThemeOptions(): ThemeOption[] {
    return [
        { iconType: 'light', label: 'Light' },
        { iconType: 'color', label: 'Color' },
        { iconType: 'dark', label: 'Dark' },
    ]
};