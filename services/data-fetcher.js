import jwt_decode from "jwt-decode";
import axios from 'axios';

const API_URL = "https://snack-tracker-api.herokuapp.com/api/v1/";
const ACCESS_TOKEN_KEY = "snack-tracker-access-token";
const REFRESH_TOKEN_KEY = "snack-tracker-refresh-token";

export async function fetchAccessToken() {

    let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (!tokenIsFresh(accessToken)) {
        accessToken = await refreshToken();
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }

    return accessToken;

}

export async function logIn(username, password) {

    const url = API_URL + "token/";

    const response = await axios.post(url, { username, password });

    localStorage.setItem(ACCESS_TOKEN_KEY, response.data.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.data.refresh);

    return true

}

function tokenIsFresh(accessToken) {

    if (!accessToken) return false;

    let decodedToken = jwt_decode(accessToken);

    let currentDate = new Date();

    // JWT exp is in seconds
    if (decodedToken.exp * 1000 < currentDate.getTime()) {
        console.log("Token expired.");
        return false;
    } else {
        return true;
    }
}
async function refreshToken() {

    let url = API_URL + "token/refresh/";

    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (refresh) {

        const response = await axios.post(url, { refresh });

        let JWTToken = response.data.access;

        return JWTToken;

    } else {

        return null;
    }

}

export default async function fetchResource(noun, id = null) {

    const JWTToken = await fetchAccessToken();

    let url = `${API_URL}${noun}/`;

    if (id != null) {
        url += `${id}/`;
    }

    let config = { headers: { "Authorization": `Bearer ${JWTToken}` } };

    try {

        let response = await axios.get(url, config);

        return response.data;

    } catch (e) {

        console.error("Failed to fetch series data")
    }
}
