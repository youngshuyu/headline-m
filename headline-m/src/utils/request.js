// 封装axios请求模块
import axios from 'axios'
import jsonBig from 'json-bigint'
import store from '@/store'
import router from '@/router'

// axios.create 方法：复制一个 axios
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'// 基础路径
})

// `transformResponse` 在传递给 then/catch 前，允许修改响应数据
request.defaults.transformResponse = [function (data) {
  return data ? jsonBig.parse(data) : {}
}]

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    let { user } = store.state
    // 统一添加 token
    // config.headers 获取操作请求头对象
    // Authorization 是后端要求的字段名称
    // 数据值后端要求提供：Bearer token数据
    //    注意：Bearer 后面有个空格
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  })

// 响应拦截器
request.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    // 如果状态码为401，则token过期
    if (error.response && error.response.status === 401) {
      // 检查有无refresh_token
      const user = store.state.user
      if (!user || !user.refresh_token) {
        // 未登录或没有refresh_token的话，跳转到登录页面
        redirectLogin()
        return
      }
      // 有refresh_token的话,获取新的token
      try {
        const { data } = await axios({
          method: 'PUT',
          url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
          headers: {
            Authorization: `Bearer ${user.refresh_token}`
          }
        })
        // 获取成功的话，把新的token放到store中
        console.log('获取新token成功')
        store.commit('setUser', {
          ...user, // 原来的数据不变,{id,token,refresh_token}
          token: data.data.token // token换成新token
        })
        // 把之前失败的用户请求继续发出去
        // config 是一个对象，其中包含本次失败请求相关的那些配置信息，例如 url、method 都有
        // return 把 request 的请求结果继续返回给发请求的具体位置
        return request(error.config)
      } catch (err) {
        // 获取token失败，跳到登录页面
        console.log(err)
        redirectLogin()
      }
    }
    return Promise.reject(error)
  }
)
function redirectLogin () {
  router.push({
    name: 'login', // router.currentRoute 当前路由对象，和你在组件中访问的 this.$route 是同一个东西
    // query 参数的数据格式就是：?key=value&key=value
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

export default request
