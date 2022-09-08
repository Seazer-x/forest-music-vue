import {api} from "../boot/axios.js";

const api_name = '/user/auth'

export const Login = (username, password) => {
    return api(
        {
            url: `${api_name}/login`,
            method: 'post',
            data: {username, password}
        }
    )
}
