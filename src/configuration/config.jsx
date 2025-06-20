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
    const configKey = Object.keys(configuration).includes(import.meta.env.MODE) ? import.meta.env.MODE : "development";

    return configuration[configKey][key.toUpperCase()]
}

export default getConfig;
