import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('../pages/Login.vue'),
    },
    {
        path: '/Home',
        component: () => import('../layouts/MainLayout.vue'),
        redirect: '/dashBoard',
        children: [
            {path: '/dashBoard', name: '仪表板', component: () => import('../pages/dashboard/index.vue')},
            {path: '/userManage', name: '用户管理', component: () => import('../pages/user/index.vue')},
            {path: '/user/add', name: '添加用户', component: () => import('../pages/user/form.vue')},
            {path: '/edit/:id', component: () => import('../pages/user/form.vue')},
            {path: '/roleManage', name: '权限管理', component: () => import('../pages/admin/index.vue')},
            {path: '/musicManage', name: '音乐管理', component: () => import('../pages/music/index.vue')},
            {path: '/music/add', name: '发布音乐', component: () => import('../pages/music/form.vue')},
            {path: '/music/:id', component: () => import('../pages/music/form.vue')},
            {path: '/playlistManage', name: '歌单管理', component: () => import('../pages/playlist/index.vue')},
            {path: '/playlist/add', name: '创建歌单', component: () => import('../pages/playlist/playlistEdit.vue')},
            {path: '/playlist/:id', component: () => import('../pages/playlist/playlistEdit.vue')},
            {path: '/artistManage', name: '歌手管理', component: () => import('../pages/artist/index.vue')},
            {path: '/artist/add', name: '歌手入驻', component: () => import('../pages/artist/artistEdit.vue')},
            {path: '/artist/:id', component: () => import('../pages/artist/artistEdit.vue')},
            {path: '/albumManage', name: '专辑管理', component: () => import('../pages/album/index.vue')},
            {path: '/album/add', name: '专辑编辑', component: () => import('../pages/album/albumEdit.vue')},
            {path: '/album/:id', component: () => import('../pages/album/albumEdit.vue')}
        ]
    },
    {
        path: '/:catchAll(.*)*',
        component: () => import('../pages/ErrorNotFound.vue')
    }
]


const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
