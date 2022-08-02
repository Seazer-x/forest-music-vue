import axios from 'axios'
import store from "../store";
import {getToken} from "../auth/auth.js";
import {Notify} from "quasar";

const api = axios.create({ baseURL: 'http://127.0.0.1:8333' })

api.interceptors.request.use(
    config => {
        if (store.state.user.token){
            config.headers['Authorization'] = getToken();
        }
        return config
    },
    error => {
        console.log(error)
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    response=>{
        if (response.data.code===201){
            Notify.create({
                type: 'negation',
                message: response.data.message,
                position: "top"
            })
        }
        if (response.data.code===200)
            return response;
        return response.data
    },
    error => {
        Notify.create({
            type: 'negation',
            message: error.message,
            position: "top-right"
        })
    }
)

export { api }
