import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage.js'
import decodeJwt from 'jwt-decode'

Vue.use(Vuex)

const USER_KEY = 'user'
export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY),
    cachePages: ['TabBar']// 缓存组件
  },
  mutations: {
    setUser (state, data) {
      // 解析 JWT 中的数据（需要使用用户ID）
      if (data && data.token) {
        data.id = decodeJwt(data.token).user_id
      }

      state.user = data

      // 为了防止刷新丢失 state 中的 user 状态，我们把它放到本地存储
      setItem('user', state.user)
    },
    // 添加组件缓存
    addCachePage (state, name) {
      if (!state.cachePages.includes(name)) {
        state.cachePages.push(name)
      }
    },
    // 删除缓存组件
    removeCachePage (state, name) {
      let index = state.cachePages.indexOf(name)
      if (index !== -1) {
        state.cachePages.splice(index)
      }
    }

  },
  actions: {
  },
  modules: {
  }
})
