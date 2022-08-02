import {getToken, removeToken, setToken} from "../../auth/auth.js";
import {adminLogin} from '../../api/login.js'

const state = () => ({
    nickname:"SuperAdmin",
    token: getToken(),
    roles:[]
})


const getters = {}

const actions = {
    login({ commit }, {username,password}) {
        return new Promise((resolve, reject) => {
            adminLogin(username.value,password.value)
                .then(response => {
                const token = response.headers['authorization'];
                console.log(token)
                commit('SET_TOKEN', token)
                setToken(token)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    logout({ commit, dispatch }) {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
    },
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NICKNAME: (state, nickname) => {
        state.nickname = nickname
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
