import {api} from "../boot/axios";

const api_name = '/admin/system'

export default {
    getUsers() {
        return api(
            {
                url: `${api_name}/getUsers`,
                method: 'get'
            }
        )
    },
    reverseLock(id) {
        return api(
            {
                url: `${api_name}/reverseLock/${id}`,
                method: 'post'
            }
        )
    },
    removeUsers(users) {
        return api(
            {
                url: `${api_name}/removeUsers`,
                method: 'post',
                data: users
            }
        )
    },
    addUser(user) {
        return api(
            {
                url: `${api_name}/addUser`,
                method: 'post',
                data: user
            }
        )
    },
    updateUser(id, user) {
        return api(
            {
                url: `${api_name}/updateUser/${id}`,
                method: 'post',
                data: user
            }
        )
    },
    getUser(id) {
        return api(
            {
                url: `${api_name}/getUser/${id}`,
                method: 'get'
            }
        )
    },
    getAdminInfo() {
        return api(
            {
                url: `${api_name}/getAdminInfo/`,
                method: 'get'
            }
        )
    }
}
