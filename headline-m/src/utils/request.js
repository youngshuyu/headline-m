// 封装axios请求模块
import axios from 'axios'
import jsonBig from 'json-bigint'
import store from '@/store'

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
      config.headers.Authorization = `Bearer ${user}`
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
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  }
)

export default request
