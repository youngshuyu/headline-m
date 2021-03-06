import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
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
    path: '/user/profile',
    component: () => import('@/views/user-profile')
  },
  {
    path: '/user/chat',
    component: () => import('@/views/user-chat')
  },
  {
    path: '/user/:userID',
    component: () => import('@/views/user')
  },
  {
    path: '/search',
    component: () => import('@/views/search')
  },
  {
    name: 'article',
    path: '/article/:articleId',
    component: () => import('@/views/article'),
    props: true // 将动态路由参数映射到组件的props中
  },
  {
    path: '/my-article/:type?',
    name: 'my-article',
    component: () => import('@/views/user-articles'),
    props: true
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
