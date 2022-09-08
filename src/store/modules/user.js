import {getRoles, getToken, removeRoles, removeToken, setRoles, setToken} from "../../auth/auth.js";
import {Login} from '../../api/login.js'
import {userInfo} from "../../api/userrequest.js";

const state = () => ({
    token: getToken(),
    roles: getRoles(),
})


const getters = {}

const actions = {
    login({commit}, {username, password}) {
        return new Promise((resolve, reject) => {
            Login(username.value, password.value)
                .then(response => {
                    const token = response.data.data;
                    commit('SET_TOKEN', token)
                    setToken(token)
                    resolve()
                }).catch(error => {
                reject(error)
            })
        })
    },
    logout({commit}) {
        commit('SET_TOKEN', '')
        removeToken()
        removeRoles()
    },
    fetchCurrentUser({commit}) {
        return new Promise((resolve, reject) => {
            userInfo()
                .then(currentUser => {
                    const user_role = currentUser.data.data.roles.map(role => role.name);
                    commit('SET_ROLES', user_role)
                    setRoles(user_role)
                    resolve(user_role);
                })
                .catch(error => {
                    reject(error)
                })
        })
    }
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
