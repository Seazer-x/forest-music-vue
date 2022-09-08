import {createApp} from 'vue'
import {Dark, Notify, Quasar} from 'quasar'
import 'quasar/src/css/index.sass'
import App from './App.vue'
import router from "./router";
import store from './store'
import './permission.js'
import mitt from 'mitt'

import iconSet from 'quasar/icon-set/fontawesome-v6'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'

const myApp = createApp(App)
myApp.config.globalProperties.$mitt = mitt()

myApp.use(router)
myApp.use(Quasar, {
    plugins: {Notify, Dark},
    iconSet: iconSet
})
myApp.use(store)

myApp.mount('#app')
