import axios from "axios";

const instance = axios.create({
    baseURL: "https://kavach-api-prod-test.onrender.com/api",
});

export default instance

export const ws = "https://kavach-api-prod-test.onrender.com"