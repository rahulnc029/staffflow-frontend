import axios from "axios";

const API = axios.create({
    // baseURL: "http://localhost:5000/api",
    baseURL: "https://staffflow-backend-cnfg.onrender.com/api"
});

// Request Interceptor
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
},
    (error) => Promise.reject(error)
);


// Response Interceptor
API.interceptors.response.use((response) => response,
    (error) => {
        // Token Expired / Unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);
export default API;