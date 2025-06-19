const configuration = {
    "development": {
        "USER_IMAGE_URL": "/",
        "API_URL": "http://localhost:3000/"
    },

    "production": {
        "USER_IMAGE_URL": "https://raw.githubusercontent.com/ghGill/reactProjectDB/refs/heads/main/",
        "API_URL": "https://reactprojectbackend-q042.onrender.com/"
    }
}

function getConfig(key) {
    return configuration[import.meta.env.MODE][key.toUpperCase()]
}

export default getConfig;
