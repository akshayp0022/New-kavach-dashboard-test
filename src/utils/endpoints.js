import axios from "axios";

const instance = axios.create({
    baseURL: "https://ons-guide-elder-creature.trycloudflare.com/api",
});

export default instance


export const ws = "https://ons-guide-elder-creature.trycloudflare.com"