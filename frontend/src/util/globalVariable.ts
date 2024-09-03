import { type ThemeOption } from "../lib/types";

export function getBaseColor() {
    return {
        // Icon/Tab hover
        lightPrimary: "#1876d2",
        darkPrimary: "#90caf9",

        // Background/Text
        white: "#ffffff",
        black: "#272727",

        // Selected item highlight
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