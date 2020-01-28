import request from '../utils/request'

export const getArticleByArticleId = articleId => request({
  method: 'GET',
  url: `/app/v1_0/articles/${articleId}`
})
