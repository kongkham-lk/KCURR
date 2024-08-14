export function getBaseColor() {
    return {
        lightPrimary: "1876d2",
        darkPrimary: "90caf9",
        white: "ffffff",
        black: "272727",
    }
};

export function getTargetBaseColor(isOutLineTheme, isLightTheme) {
    const baseColor = getBaseColor();
    return isOutLineTheme ? isLightTheme ? baseColor.lightPrimary : baseColor.darkPrimary : baseColor.white;
}

export function getThemeOptions() {
    return [
        { iconType: 'light', label: 'Light' },
        { iconType: 'color', label: 'Color' },
        { iconType: 'dark', label: 'Dark' },
    ]
};