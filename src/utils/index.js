import axios from "axios";

const instance = axios.create({
    baseURL: "http://10.0.0.31:5001/api",
});

export default instance