import axios from "axios";


const api = axios.create({

    baseURL: "http://localhost:8080/api/v1",

    headers: {
        "Content-Type": "application/json",
    },

});


/*
 * Automatically attach JWT token
 * to every authenticated API request.
 */

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem(
                "sustainopt_token"
            );

        const isPublicAuthEndpoint = config.url && (config.url.endsWith("/auth/login") || config.url.endsWith("/auth/register"));

        if (token && !isPublicAuthEndpoint) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


/*
 * Handle expired/invalid authentication.
 */

api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (
            error.response?.status === 401
        ) {

            localStorage.removeItem(
                "sustainopt_token"
            );

            localStorage.removeItem(
                "sustainopt_user"
            );

        }

        return Promise.reject(error);

    }

);


export default api;