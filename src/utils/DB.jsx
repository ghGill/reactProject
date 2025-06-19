import getConfig from "../configuration/config";

class DBclass {
    constructor() {
    }

    imageUrl(fileName) {
        const userImageUrl = getConfig("USER_IMAGE_URL");

        return `${userImageUrl}${fileName}`
    }

    async apiRequest(method, params, body=null, redirectOnErr=true) {
        const apiUrl = getConfig('API_URL');

        try {
            const apiFullUrl = `${apiUrl}${params}`;
            let requestParams = {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
            };
            
            if (body) {
                requestParams['body'] = JSON.stringify(body);
            }

            const res = await fetch(
                apiFullUrl,
                requestParams
            )

            const result = await res.json();

            return result;
        }
        catch (e) {
            if (redirectOnErr)
                window.location.href = '/';

            // return {status: false, message:e.message};
        }
    }

    async verifyDbConnection() {
        const apiResponse = await this.apiRequest('get', 'available', null, false)

        return apiResponse;
    }

    async getUserById(id) {
        const apiResponse = await this.apiRequest('get', `user/get/${id}`)

        return apiResponse;
    }

    async login(email, password) {
        const apiResponse = await this.apiRequest('post', `auth/login`, {email: email, password: password})

        return apiResponse;
    }

    async signup(data) {
        data.image = "default.jpg";

        const apiResponse = await this.apiRequest('post', `auth/signup`, data)

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
