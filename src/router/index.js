import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        { path: '/home', component: Home }
    ]
})

// 挂载 路由导航守卫

router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 来源
    // next 放行函数
    // next () 强制跳转
    if (to.path === '/login') return next()
        // 获取token
    const str = window.sessionStorage.getItem('token')
    if (!str) return next('/login')
    next()
})

export default router
