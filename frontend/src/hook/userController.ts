import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { type Preference, type CurrList } from '../lib/types';

const baseURL: string | undefined = process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_DEV_BASEURL
    : process.env.REACT_APP_PROD_BASEURL;
const port: string | undefined = process.env.REACT_APP_TARGET_PORT;

export function getUserIdentifier(): string {
    // Check if the identifier is already stored in local storage
    let userId: string | null = localStorage.getItem('userId');
    if (!userId) {
        // If not, generate a new identifier
        userId = uuidv4();
        // Store the identifier in local storage
        localStorage.setItem('userId', userId !== null ? userId : "");
    }
    return userId;
}

export async function savePrefTheme(userId: string, newTheme: string): Promise<void> {
    const preferences: Preference | null = await getUserPreferences(userId);
    if (preferences !== null) {
        preferences.theme = newTheme;
        console.log("Save newTheme!!! ", preferences)
        await saveUserPreferences(userId, preferences);
    }
}

export async function savePrefCovertedPair(userId: string, newConvertedPair: string[]): Promise<void> {
    const preferences: Preference | null = await getUserPreferences(userId);
    if (preferences !== null) {
        preferences.convertedCurrPair = newConvertedPair;
        console.log("Save newConvertedPair!!! ", preferences)
        await saveUserPreferences(userId, preferences);
    }
}

export async function savePrefCurrCodes(userId: string, newCurrCodes: string[]): Promise<void> {
    const preferences: Preference | null = await getUserPreferences(userId);
    if (preferences !== null) {
        preferences.liveRateCurrCodes = newCurrCodes;
        console.log("Save newCurrCodes!!! ", preferences)
        await saveUserPreferences(userId, preferences);
    }
}

export async function savePrefNewsCategories(userId: string, newNewsCategories: string[]): Promise<void> {
    const preferences: Preference | null = await getUserPreferences(userId);
    if (preferences !== null) {
        preferences.newsCategories = newNewsCategories;
        console.log("Save newNewsCategories!!! ", preferences)
        await saveUserPreferences(userId, preferences);
    }
}

export async function saveUserPreferences(userId: string, preferences: Preference): Promise<void> {
    // console.log("Save User Pref!!! ", preferences)
    localStorage.setItem(`preferences_${userId}`, JSON.stringify(preferences));
    await axios.post(`${baseURL}:${port}/update-preferences/${userId}`, preferences);
}

export async function getUserPreferences(userId: string): Promise<Preference | null> {
    const savedPreferences: string | null = localStorage.getItem(`preferences_${userId}`);
    // console.log("check savedPreference: ", savedPreferences)
    // Check if cookie has any savedPreferences
    if (savedPreferences) {
        const transformPref: Preference = JSON.parse(savedPreferences);

        // Only use cookie (userPreference cookie) if it contain all the require neccessary fields,
        // including: theme, currCodePair, currCodeRowList, newsCategoryList
        if (Object.keys(transformPref).length > 3)
            return transformPref;
    }

    // Retreived user preference from backend
    // This logic need to run if transformPref does not include all the neccessary field
    try {
        console.log("Sending request for new preference!!!");
        const req = await axios.get(`${baseURL}:${port}/preferences/${userId}`);
        const userPrefereneces: Preference = req.data
        // console.log("userPreferences return: ", userPrefereneces);
        return userPrefereneces;
    } catch {
        console.log("Fail to get user preferece!!!")
        return null;
    }
}

// Save currList to Cookie is needed as whenever user set new theme, the initialCurrList will not be updated
export async function saveCurrListsToCookie(userId: string, currLists: CurrList[]) : Promise<void> {
    console.log("saveCurrListsToCookie: ", currLists)
    localStorage.setItem(`currLists_${userId}`, JSON.stringify(currLists));
}

// Invoke to update the initialCurrList whenever user set new theme
export function getCurrListsFromCookie(userId: string) : CurrList[] | null {
    const savedCurrLists : string | null = localStorage.getItem(`currLists_${userId}`);
    // console.log("check savedCurrLists: ", savedCurrLists)
    // Check if savedData has any
    if (savedCurrLists)
        return JSON.parse(savedCurrLists);
    else
        return null;
}