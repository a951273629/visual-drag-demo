import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: 'Home',
        // 路由懒加载
        component: () => import('@/views/Home'),
    },
]

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
})
