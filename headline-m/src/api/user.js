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
