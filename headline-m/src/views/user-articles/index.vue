<template>
  <div class="userArticlesContainer">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      fixed=""
    />
    <van-tabs v-model="active">
      <van-tab title="我的收藏">
        <my-collect/>
      </van-tab>
      <van-tab title="浏览历史">
        <my-history/>
      </van-tab>
      <van-tab title="我的作品">
        <my-articles/>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import myCollect from './components/collect'
import myHistory from './components/history'
import myArticles from './components/articles'
export default {
  name: 'UserArticles',
  props: {
    type: {
      type: String
    }
  },
  data () {
    let active = ['collect', 'history'].indexOf(this.type)
    if (active === -1) {
      active = 2 // 我的作品
    }
    return {
      active
    }
  },
  components: {
    myCollect,
    myHistory,
    myArticles
  },
  beforeRouteLeave (to, from, next) {
    // 如果跳转的是文章详情页，缓存此组件
    if (to.name === 'article') {
      this.$store.commit('addCachePage', 'UserArticles')
    } else {
      // 如果跳转的是其他页面页，取消缓存此组件
      this.$store.commit('removeCachePage', 'UserArticles')
    }
    next()
  }
}
</script>

<style lang="less" scoped>
.userArticlesContainer{
  padding-top: 90px;
}
/deep/.van-tabs__wrap {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  z-index: 1;
}
</style>
