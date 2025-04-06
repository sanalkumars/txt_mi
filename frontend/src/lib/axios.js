import axios from "axios";

// the below is the set up for setting the axios 

export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE==="development"? "http://localhost:4000/api" : "/",
    withCredentials:true
});