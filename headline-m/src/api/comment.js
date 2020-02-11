import request from '@/utils/request'

export const getComments = params => request({
  method: 'GET',
  url: '/app/v1_0/comments',
  params
})

// 发送评论
export const addComment = data => request({
  method: 'POST',
  url: '/app/v1_0/comments',
  data
})
