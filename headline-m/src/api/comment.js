import request from '@/utils/request'

export const getComments = params => request({
  method: 'GET',
  url: '/app/v1_0/comments',
  params
})
