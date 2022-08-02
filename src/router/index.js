import {createRouter, createWebHashHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('../pages/Login.vue'),
  },
  {
    path: '/Home',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      { path: '', name:'index',component: () => import('../pages/Index.vue') },
      { path: '/dashBoard', name:'dashboard',component: () => import('../pages/dashboard/index.vue') },
      { path: '/userManage', name:'userManage',component: () => import('../pages/user/index.vue') },
      { path: '/roleManage', name:'roleManage',component: () => import('../pages/admin/index.vue') }
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
