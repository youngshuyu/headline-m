import request from '../utils/request'

// 联想接口
export const getSearchSuggestions = q => request({
  url: `/app/v1_0/suggestion`,
  method: 'GET',
  params: { q }
})

// 搜索结果接口
export const getSearchResults = params => request({
  url: '/app/v1_0/search',
  method: 'GET',
  params
})
