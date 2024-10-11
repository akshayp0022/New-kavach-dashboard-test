import axios from "axios";

const instance = axios.create({
    baseURL: "http://192.168.68.151:5001/api",
});

export default instance

export const ws = "http://192.168.68.151:5001"