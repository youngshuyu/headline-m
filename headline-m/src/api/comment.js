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

/**
 * 对评论或评论回复点赞
 */
export function addCommentLike (commentId) {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: {
      target: commentId
    }
  })
}

/**
 * 取消对评论或评论回复点赞
 */
export function deleteCommentLike (commentId) {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${commentId}`
  })
}
