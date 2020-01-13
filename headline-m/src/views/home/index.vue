<template>
  <div class="home-container">
    <van-nav-bar title="首页" fixed=""/>
    <van-tabs>
      <van-tab v-for="channel in channels"
      :title="channel.name"
      :key="channel.id"
      >
      {{channel.name}}
      <articles-list :channel="channel"/></van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/channel'
import articlesList from './components/articles-list'
export default {
  data () {
    return {
      channels: []
    }
  },
  components: {
    'articles-list': articlesList
  },
  created () {
    this.getChannels()
  },
  methods: {
    async getChannels () {
      let { data } = await getUserChannels()
      console.log(data)
      this.channels = data.data.channels
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 45px;
  padding-bottom: 50px;
}
.wap-nav {
  position: fixed;
  right: 0;
  line-height: 44px;
  background: #fff;
  opacity: .8;
}
/deep/.van-tabs__wrap {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  z-index: 1;
}
</style>
