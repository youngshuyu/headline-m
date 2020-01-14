import request from '@/utils/request'
/**
 * 获取用户频道列表
 * 如果登录了：获取用户频道列表
 * 没有登录：获取默认推荐的频道列表
 */
export const getUserChannels = () => request({
  method: 'GET',
  url: `/app/v1_0/user/channels`
})

export const getArticlesByChannel = params => request({
  method: 'GET',
  url: `/app/v1_1/articles`,
  params
})

export const getAllChannels = () => request({
  method: 'GET',
  url: '/app/v1_0/channels'
})
