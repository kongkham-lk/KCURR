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

export async function saveUserPreferences(userId, preferences) {
    console.log("Update User Pref to API!!! ", preferences)
    localStorage.setItem(`preferences_${userId}`, JSON.stringify(preferences));
    await axios.post(`${baseURL}:${port}/update-preferences/${userId}`, preferences);
};

export async function getUserPreferences(userId) {
    const savedPreferences = localStorage.getItem(`preferences_${userId}`);
    console.log("check savedPreference: ", savedPreferences)
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
};