import {getUserCount} from "../../api/usermap.js";

const state = () => ({
    mapData: []
})


const getters = {}

const actions = {
    addMapData({commit}) {
        getUserCount().then(res => {
            commit('SET_DATA', res.data.data)
        })
    },
}

const mutations = {
    SET_DATA: (state, mapData) => {
        state.mapData = mapData
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
