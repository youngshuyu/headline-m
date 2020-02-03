import request from '@/utils/request'

export const login = data => request({
  method: 'POST',
  url: '/app/v1_0/authorizations',
  data
})

export const getMsgCode = data => request({
  method: 'GETt',
  url: `/app/v1_0/sms/codes/${data}`,
  data
})

export const getUserInfo = () => request({
  method: 'GET',
  url: `/app/v1_0/user`
})

export const getUserById = userId => request({
  method: 'GET',
  url: `/app/v1_0/users/${userId}`
})

export const getArticlesByUser = (userId, params) => request({
  method: 'GET',
  url: `/app/v1_0/users/${userId}/articles`,
  params
})

// 获取用户资料
export const getUserProfile = () => request({
  method: 'GET',
  url: '/app/v1_0/user/profile'
})

// 编辑用户头像
export const updateUserPhoto = data => request({
  method: 'PATCH',
  url: '/app/v1_0/user/photo',
  data
})

// 编辑用户资料
export const updateUserProfile = data => request({
  method: 'PATCH',
  url: '/app/v1_0/user/profile',
  data
})
