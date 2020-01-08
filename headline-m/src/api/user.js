import request from '@/utils/request'

export const login = data => request({
  method: 'POST',
  url: '/app/v1_0/authorizations',
  data
})

export const getMsgCode = data => request({
  method: 'Get',
  url: `/app/v1_0/sms/codes/${data}`,
  data
})
