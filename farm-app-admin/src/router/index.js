import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from "@/components/layout/Layout"

Vue.use(VueRouter);

const routes = [

    {
        path: '/login',
        name: 'Login',
        component: () => import("@/views/Login")
    },

    //公共布局下的路由
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: 'index',
                component: () => import("@/views/Index")
            },
            {
                path: "/",
                redirect: "index"
            },
            {
                path: '/information/notice',
                component: () => import("@/views/information/List")
            },
            {
                path: '/information/news',
                component: () => import("@/views/information/News")
            },
            {
                path: '/information/category',
                component: () => import("@/views/information/Category")
            },
            {
                path: '/information/product',
                component: () => import("@/views/information/Product")
            },
            {
                path: '/information/order',
                component: () => import("@/views/information/Order")
            },
            {
                path: '/information/order/detail/:id',
                component: () => import("@/views/information/OrderDetail")
            },
            {
                path: '/information/poster',
                component: () => import("@/views/information/Poster")
            },

            {
                path: '/user/list',
                component: () => import("@/views/user/List")
            },
            {
                path: '/user/store',
                component: () => import("@/views/user/Store")
            },
            {
                path: '/order/list',
                component: () => import("@/views/order/List")
            },
            // {
            //     path: '/order/exception',
            //     component: () => import("@/views/order/Exception")
            // },
            {
                path: '/activity/killActivity',
                component: () => import("@/views/activity/killActivity")
            },
            {
                path: '/activity/killActivity/killDetail/:id',
                component: () => import("@/views/activity/killDetail")
            },
            {
                path: '/system/permission',
                component: () => import("@/views/system/Permission")
            },
            {
                path: '/worker/list',
                component: () => import("@/views/worker/List")
            },
            {
                path: '/worker/daily',
                component: () => import("@/views/worker/Daily")
            },
            {
                path: '/worker/add',
                component: () => import("@/views/worker/Add")
            },
            {
                path: '/api',
                component: () => import("@/views/Api")
            },
            {
                path: '/setting',
                component: () => import("@/views/Setting")
            },
            {
                path: '/403',
                component: () => import("@/views/error/403")
            },

            {
                path: '/404',
                component: () => import("@/views/error/404")
            },
        ]
    },

    {
        path: "*",
        redirect: '/404'
    }


];

const router = new VueRouter({
    mode: 'history',
    routes: routes
});

//路由卫士
router.beforeEach((to, from, next) => {
    let isAuthenticated = localStorage.getItem("token") !== null
    if (to.name !== 'Login' && !isAuthenticated) next({name: 'Login'})
    else next()
})

export default router
