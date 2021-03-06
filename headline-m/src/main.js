import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// REM适配，动态设置html标签字体大小
import 'amfe-flexible'
// 加载注册vant组件模块
import './utils/register-vant'
import './styles/index.less'
// 表单验证
import './utils/validation.js'

// 引入日期格式化模块
import './utils/datetime'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
