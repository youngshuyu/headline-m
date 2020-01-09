// 封装本地存储的方法模块
export const getItem = name => {
//
  let data = window.localStorage.getItem(name)
  try {
    return JSON.parse(data)
  } catch (error) {
    console.log('转换失败')
    return data
  }
}
export const setItem = (name, value) => {
  let data = typeof value === 'object' ? JSON.stringify(value) : value
  window.localStorage.setItem(name, data)
}
export const removeItem = name => {
  window.localStorage.removeItem(name)
}
