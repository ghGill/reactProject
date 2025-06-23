import getConfig from "../configuration/config";
import { AUTH_COOKIE_NAME, getCookie, deleteCookie, REFRESH_COOKIE_NAME, createCookie } from "../utils/cookies";

class DBclass {
    constructor() {
    }

    imageUrl(fileName) {
        const userImageUrl = getConfig("USER_IMAGE_URL");

        return `${userImageUrl}${fileName}`
    }

    async apiRequest(method, params, body=null, redirectOnErr=true, useToken=true) {
        const apiUrl = getConfig('API_URL');

        let headers = {
            'Content-Type': 'application/json'
        };

        if (useToken) {
            const accessToken = getCookie(AUTH_COOKIE_NAME);
            headers['Authorization'] = `Bearer ${accessToken}`;

            const refreshToken = getCookie(REFRESH_COOKIE_NAME);
            headers['refresh'] = `Bearer ${refreshToken}`;
        }

        let logout = false;
        let result = null;

        try {
            const apiFullUrl = `${apiUrl}${params}`;
            let requestParams = {
                method: method,
                headers: headers,
                // credentials: 'include'  // alow to send and get cookies from and to requests
            };
            
            if (body) {
                requestParams['body'] = JSON.stringify(body);
            }

            const res = await fetch(
                apiFullUrl,
                requestParams
            )
            result = await res.json();

            if ([400, 401].includes(res.status)) {
                if (useToken && redirectOnErr) { // invalid token or token not exist
                    logout = true;
                }
            }
            else {
                const resNewAccessToken = res.headers.get('x-Access-Token');
                if (resNewAccessToken) {
                    createCookie(AUTH_COOKIE_NAME, resNewAccessToken);
                }
            }
        }
        catch (e) {
            if (redirectOnErr)
                logout = true;
        }

        if (logout) {
            deleteCookie(AUTH_COOKIE_NAME);
            deleteCookie(REFRESH_COOKIE_NAME);
            window.location.href = '/';
        }
        else
            return result;
    }

    async verifyDbConnection() {
        const apiResponse = await this.apiRequest('get', 'available', null, false, false)

        return apiResponse;
    }

    async getUserByToken() {
        const apiResponse = await this.apiRequest('get', `user/get`, null, false)

        return apiResponse;
    }

    async login(email, password) {
        const apiResponse = await this.apiRequest('post', `auth/login`, {email: email, password: password}, true, false);

        return apiResponse;
    }

    async signup(data) {
        data.image = "default.jpg";

        const apiResponse = await this.apiRequest('post', `auth/signup`, data, true, false);

        return apiResponse;
    }

    async getPotsList() {
        const apiResponse = await this.apiRequest('get', `pot/all`)

        return apiResponse;
    }

    async addPot(data) {
        delete data.id;

        const apiResponse = await this.apiRequest('post', `pot/add`, data)

        return apiResponse;
    }

    async updatePot(data) {
        const apiResponse = await this.apiRequest('put', `pot/update`, data)

        return apiResponse;
    }

    async deletePot(data) {
        const apiResponse = await this.apiRequest('delete', `pot/delete`, data)

        return apiResponse;
    }

    async getColorsList() {
        const apiResponse = await this.apiRequest('get', `color/all`)

        return apiResponse;
    }

    async getCategoriesList() {
        const apiResponse = await this.apiRequest('get', `category/all`)

        return apiResponse;
    }

    async getOverviewData() {
        const apiResponse = await this.apiRequest('get', `overview/all`)

        return apiResponse;
    }

    async addTransaction(data) {
        delete data.id;

        const apiResponse = await this.apiRequest('post', `transaction/add`, data)

        return apiResponse;
    }

    async getPageTransactions(catId, sortId, page, limit) {
        const apiResponse = await this.apiRequest('get', `transaction/get/${catId}/${sortId}/${page}/${limit}`)

        return apiResponse;
    }

    async getTransactionsPerCategory() {
        const apiResponse = await this.apiRequest('get', `transaction/category-count`)

        return apiResponse;
    }
}

export let DB = new DBclass();
