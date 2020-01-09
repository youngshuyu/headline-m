import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage.js'
Vue.use(Vuex)

const USER_KEY = 'user'
export default new Vuex.Store({
  state: {
    user: getItem(USER_KEY)
  },
  mutations: {
    setUser (state, data) {
      state.user = data
      // 为了避免刷新页面数据丢失，使用localStorage存储token(持久化)
      setItem(USER_KEY, data)
    }
  },
  actions: {
  },
  modules: {
  }
})
