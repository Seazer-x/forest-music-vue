import axios from 'axios'
import store from "../store";
import {getToken} from "../auth/auth.js";
import {Notify} from "quasar";
import router from "../router";

const api = axios.create({baseURL: 'http://127.0.0.1:8333'})

api.interceptors.request.use(
    config => {
        if (store.state.user.token) {
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
    response => {
        if (response.data.code === 201) {
            Notify.create({
                type: 'negation',
                timeout: 1000,
                message: response.data.message,
                position: "top",
                icon: "fa-solid fa-triangle-exclamation"
            })
        }
        if (response.data.code === 200)
            return response;
        return response.data
    },
    error => {
        function handleErrorResponse(response) {
            switch (response.status) {
                case 401:
                    store.dispatch('user/logout').then(() => {
                        router.push('/').then(() => {
                            Notify.create({
                                color: 'teal',
                                group: false,
                                icon: 'fa-solid fa-triangle-exclamation',
                                message: '登录已过期，请重新登录',
                                position: "top-right",
                                timeout: 2000,
                                actions: [{
                                    label: '关闭', color: 'yellow', handler: () => {
                                    }
                                }]
                            })
                        })
                    })
                    break;
                case 500:
                    store.dispatch('user/logout').then(() => {
                        router.push('/').then(() => {
                            Notify.create({
                                color: 'teal',
                                group: false,
                                icon: 'fa-solid fa-triangle-exclamation',
                                message: '登录已过期，请重新登录',
                                position: "top-right",
                                timeout: 2000,
                                actions: [{
                                    label: '关闭', color: 'yellow', handler: () => {
                                    }
                                }]
                            })
                        })
                    })
                    break;
            }
        }

        handleErrorResponse(error.response)
        Notify.create({
            color: 'teal',
            group: false,
            icon: 'fa-solid fa-triangle-exclamation',
            message: error.message,
            position: "top-right",
            timeout: 2000,
            actions: [{
                label: '关闭', color: 'yellow', handler: () => {
                }
            }]
        })
    },
)

export {api}
