import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    component: () => import ('@/views/tab-bar'),
    children: [
      {
        path: '', // 首页
        component: () => import('@/views/home')
      },
      {
        path: 'qa', // 问答
        component: () => import('@/views/Q&A')
      },
      {
        path: 'video', // 视频
        component: () => import('@/views/video')
      }, {
        path: 'my', // 我的主页
        component: () => import('@/views/my')
      }
    ]
  },
  {
    path: '/user/:userID',
    component: () => import('@/views/user')
  },
  {
    path: '/search',
    component: () => import('@/views/search')
  }
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')

]

const router = new VueRouter({
  routes
})

export default router
