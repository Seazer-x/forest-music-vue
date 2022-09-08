import {api} from "../boot/axios.js";

const api_name = '/user/auth'

export const userInfo = () => {
    return api(
        {
            url: `${api_name}/getUserInfo`,
            method: 'get'
        }
    )
}
