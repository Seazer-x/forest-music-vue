import router from './router'
import {getToken} from "./auth/auth.js";

const whiteList = ['/','/404'];

router.beforeEach(async(to, from, next) => {
    
    const hasToken = getToken()

    if (hasToken) {
        if (to.path === '/') {
            // if is logged in, redirect to the home page
            next({ path: '/Home' })
        } else {
            next();
            // // determine whether the user has obtained his permission roles through getInfo
            // const hasRoles = store.state.roles && store.state.roles.length > 0
            // if (hasRoles) {
            //     next()
            // } else {
            //     try {
            //         // get user info
            //         // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
            //         const { roles } = await store.dispatch('user/getRoles')
            //
            //         // generate accessible routes map based on roles
            //         const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
            //
            //         // dynamically add accessible routes
            //         router.addRoute(accessRoutes)
            //
            //         // hack method to ensure that addRoutes is complete
            //         // set the replace: true, so the navigation will not leave a history record
            //         next({ ...to, replace: true })
            //     } catch (error) {
            //         // remove token and go to login page to re-login
            //         await store.dispatch('user/resetToken')
            //         next(`/login?redirect=${to.path}`)
            //     }
            // }
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
