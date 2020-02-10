<template>
  <div class="tabbar-container">
    <keep-alive>
      <router-view/>
    </keep-alive>
      <van-tabbar route>
      <van-tabbar-item icon="wap-home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="comment-o" to="/qa">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/my">{{$store.state.user ? '我的' : '未登录'}}</van-tabbar-item>
      </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'TabBar'
}
</script>

<style>

</style>
