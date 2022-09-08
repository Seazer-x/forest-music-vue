import router from './router'
import {getToken} from "./auth/auth.js";

const whiteList = ['/', '/404'];

router.beforeEach(async (to, from, next) => {

    const hasToken = getToken()

    if (hasToken) {
        if (to.path === '/') {
            // if is logged in, redirect to the home page
            next({path: '/Home'})
        } else {
            next();
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`?redirect=${to.path}`)
        }
    }
})
