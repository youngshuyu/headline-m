import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'
// REM适配，动态设置html标签字体大小
import 'amfe-flexible'
// 加载注册vant组件模块
import './utils/register-vant'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
