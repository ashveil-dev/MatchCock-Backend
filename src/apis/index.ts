import axios from "axios";

const ax = axios.create({
    baseURL: "https://sponet.co.kr/php/bm/",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
})

export default ax;