<template>
<van-pull-refresh v-model="isLoading" @refresh="onRefresh">
  <!-- <p>刷新次数: {{ count }}</p> -->
  <van-list
  v-model="loading"
  :finished="finished"
  finished-text="没有更多了"
  @load="onLoad"
>
  <van-cell
    v-for="(item,index) in list"
    :key="index"
    :title="item.title"
  />
</van-list>
</van-pull-refresh>

</template>

<script>
import { getArticlesByChannel } from '@/api/channel'
export default {
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      timestamp: null,
      isLoading: false
    }
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      let { data } = await getArticlesByChannel({
        channel_id: this.channel.id,
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })
      let results = data.data.results
      this.list.push(...results)
      // 3. 加载状态结束
      this.loading = false
      // 4. 数据全部加载完成
      if (results.length) {
        // 更新获取下一页数据的时间戳
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据了，把 finished 设置为 true，不再加载更多
        this.finished = true
        this.$toast('没有数据了')
      }
    },
    async onRefresh () {
      let { data } = await getArticlesByChannel({
        channel_id: this.channel.id,
        timestamp: Date.now(),
        with_top: 1
      })
      // 2. 如果有最新数据，则把数据放到列表的顶部
      const { results } = data.data
      this.list.unshift(...results)
      // 3. 关闭下拉刷新的 loading 状态
      this.isLoading = false
      // 4提示更新成功
      this.$toast(`更新了${results.length}条数据`)
    }
  },
  created () {
    this.onLoad()
  }
}
</script>

<style>

</style>
