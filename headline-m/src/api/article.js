import request from '../utils/request'

// 获取文章详情
export const getArticleByArticleId = articleId => request({
  method: 'GET',
  url: `/app/v1_0/articles/${articleId}`
})
// 添加收藏
export const addCollect = target => request({
  method: 'POST',
  url: '/app/v1_0/article/collections',
  data: {
    target
  }
})
// 取消收藏
export const deleteCollect = target => request({
  method: 'DELETE',
  url: `/app/v1_0/article/collections/${target}`
})
/**
 * 点赞
 */
export const addLike = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

/**
   * 取消点赞
   */
export const deleteLike = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${articleId}`
  })
}
/**
 * 添加关注
 */
export const addFollow = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

/**
   * 取消关注
   */
export const deleteFollow = userId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}
