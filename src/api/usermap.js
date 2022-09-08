import {api} from "../boot/axios.js";

const api_name = '/admin/system'

export const getUserCount = () => {
    return api(
        {
            url: `${api_name}/getUserCount`,
            method: 'get'
        }
    )
}
