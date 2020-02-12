<template>
  <div class="home-container">
    <div class="nav-bar">
      <div class="logo"></div>
      <van-button
        class="search-btn"
        round
        type="info"
        size="small"
        icon="search"
        @click="$router.push('/search')"
      >搜索</van-button>
    </div>
    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <van-icon
       class="wap-nav"
       slot="nav-right"
       name="wap-nav"
       @click="isChannelEditShow = true"
 />
      <van-tab v-for="channel in userChannels"
      :title="channel.name"
      :key="channel.id"
      >
      <!-- 频道列表结束 -->
      <!-- 文章列表 -->
        <articles-list :channel="channel"/>
      </van-tab>
    </van-tabs>
    <!-- 编辑频道 -->
    <van-popup v-model="isChannelEditShow"
    position="bottom"
    closeable
    round=""
    close-icon-position="top-left"
    :style="{ height: '100%' }">
    <channels-edit :user-channels="userChannels" @switch="onChannelSwitch" :active="active"/>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/channel'
import articlesList from './components/articles-list'
import channelsEdit from './components/channel-edit'
import { getItem, setItem } from '@/utils/storage'

export default {
  name: 'HomePage',
  data () {
    return {
      active: 0,
      userChannels: [],
      isChannelEditShow: false
    }
  },
  components: {
    'articles-list': articlesList,
    'channels-edit': channelsEdit
  },
  created () {
    this.getChannels()
  },
  watch: {
    // 当 userChannels 发生改变的时候，将该数据存储到本地存储
    userChannels () {
      setItem('user-channels', this.userChannels)
    }
  },
  methods: {
    async getChannels () {
      let { data } = await getUserChannels()
      this.userChannels = data.data.channels
    },
    onChannelSwitch (index) {
      this.active = index
      this.isChannelEditShow = false
    },
    // 简单一句话：优先使用本地的，没有就使用线上的
    async loadUserChannels () {
      let channels = []
      // 2. 获取本地存储的频道列表
      let localUserchannels = await getItem('user-channels')
      // 3. 如果本地存储有，就使用本地存储的
      if (localUserchannels) {
        channels = localUserchannels
      } else {
        // 4. 如果本地存储没有，则请求获取接口推荐的频道列表
        let { data } = await getUserChannels()
        channels = data.data.channels
      }
      // 5. 最后，把数据赋值到当前组件中
      this.userChannels = channels
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
.nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    height: 46px;
    background-color: #3196fa;
    z-index: 1;
    .logo {
      background: url("./logo-light.png") no-repeat;
      background-size: cover;
      width: 100px;
      height: 30px;
    }
    .search-btn {
      background-color: #5babfb;
      width: 50%;
    }
  }
</style>
