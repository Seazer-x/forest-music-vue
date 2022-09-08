import Cookies from 'js-cookie'

const TokenKey = 'Authorization'
const RolesKey = 'current_user'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    Cookies.remove(TokenKey)
}

export function getRoles() {
    const user = Cookies.get(RolesKey)
    return user === undefined ? null : JSON.parse(Cookies.get(RolesKey))
}

export function setRoles(roles) {
    return Cookies.set(RolesKey, JSON.stringify(roles))
}

export function removeRoles() {
    Cookies.remove(RolesKey)
}
