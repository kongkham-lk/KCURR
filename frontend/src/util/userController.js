import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const baseURL = process.env.NODE_ENV === "development" ? process.env.REACT_APP_DEV_BASEURL : process.env.REACT_APP_PROD_BASEURL;
const port = process.env.REACT_APP_TARGET_PORT;

export function getUserIdentifier() {
    // Check if the identifier is already stored in local storage
    let userId = localStorage.getItem('userId');
    if (!userId) {
        // If not, generate a new identifier
        userId = uuidv4();
        // Store the identifier in local storage
        localStorage.setItem('userId', userId);
    }
    return userId;
};

export async function savePrefTheme(userId, newTheme) {
    const preferences = await getUserPreferences(userId);
    preferences.theme = newTheme;
    console.log("Save newTheme!!! ", preferences)
    await saveUserPreferences(userId, preferences);
};

export async function savePrefCovertedPair(userId, newConvertedPair) {
    const preferences = await getUserPreferences(userId);
    preferences.convertedCurrPair = newConvertedPair;
    console.log("Save newConvertedPair!!! ", preferences)
    await saveUserPreferences(userId, preferences);
};

export async function savePrefCurrCodes(userId, newCurrCodes) {
    const preferences = await getUserPreferences(userId);
    preferences.liveRateCurrCodes = newCurrCodes;
    console.log("Save newCurrCodes!!! ", preferences)
    await saveUserPreferences(userId, preferences);
};

export async function savePrefNewsCategories(userId, newNewsCategories) {
    const preferences = await getUserPreferences(userId);
    preferences.newsCategories = newNewsCategories;
    console.log("Save newNewsCategories!!! ", preferences)
    await saveUserPreferences(userId, preferences);
};

export async function saveUserPreferences(userId, preferences) {
    // console.log("Save User Pref!!! ", preferences)
    localStorage.setItem(`preferences_${userId}`, JSON.stringify(preferences));
    await axios.post(`${baseURL}:${port}/update-preferences/${userId}`, preferences);
};

export async function getUserPreferences(userId) {
    const savedPreferences = localStorage.getItem(`preferences_${userId}`);
    // console.log("check savedPreference: ", savedPreferences)
    // Check if savedPreferences has any
    if (savedPreferences) {
        const transformPref = JSON.parse(savedPreferences);

        // Only use cookie (userPreference cookie) if it contain all the require neccessary fields,
        // including: theme, currCodePair, currCodeRowList, newsCategoryList
        if (Object.keys(transformPref).length > 3)
            return JSON.parse(savedPreferences);
    }

    // Retreived user preference from backend
    try {
        console.log("Sending request for new preference!!!");
        const userPrefereneces = await axios.get(`${baseURL}:${port}/preferences/${userId}`);
        // console.log("userPreferences return: ", userPrefereneces);
        return userPrefereneces.data;
    } catch {
        console.log("Fail to get user preferece!!!")
    }
}

// Save currList to Cookie is needed as whenever user set new theme, the initialCurrList will not be updated
export async function saveCurrListsToCookie(userId, currLists) {
    console.log("saveCurrListsToCookie: ", currLists)
    localStorage.setItem(`currLists_${userId}`, JSON.stringify(currLists));
}

// Invoke to update the initialCurrList whenever user set new theme
export function getCurrListsFromCookie(userId) {
    const savedCurrLists = localStorage.getItem(`currLists_${userId}`);
    console.log("check savedCurrLists: ", savedCurrLists)
    // Check if savedData has any
    if (savedCurrLists)
        return JSON.parse(savedCurrLists);
    else
        return null;
}