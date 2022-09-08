import {createStore} from 'vuex'
import user from './modules/user.js'
import map from './modules/map.js'
import createPersistedState from "vuex-persistedstate"

const store = createStore({
    modules: {
        user,
        map
    },
    plugins: [createPersistedState({
        storage: window.sessionStorage
    })]
})

export default store
