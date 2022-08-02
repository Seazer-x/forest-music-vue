import { createApp } from 'vue'
import { Quasar } from 'quasar'
import 'quasar/src/css/index.sass'
import App from './App.vue'
import router from "./router";
import store from './store'
import './permission.js'
import {Notify} from "quasar";

import '@quasar/extras/line-awesome/line-awesome.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'

const myApp = createApp(App)


myApp.use(router)
myApp.use(Quasar, {
    plugins: {Notify},
})
myApp.use(store)

myApp.mount('#app')
