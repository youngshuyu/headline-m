<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    @load="onLoad"
  >
  <van-cell v-for="(item,index) in list"
    :key="index" :title="item.title"
    @click="$router.push({
        name:'article',
        params: {
            articleId: item.art_id.toString()
        }
    })"/>
</van-list>
</template>

<script>
import { getUserCollect } from '@/api/article'
export default {
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 10
    }
  },
  created () {
    this.onLoad()
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      const { data } = await getUserCollect({
        page: this.page,
        per_page: this.per_page
      })
      console.log(data)
      const { results } = data.data
      this.list.push(...results)
      // 加载状态结束
      this.loading = false

      // 判断是否还有数据
      if (results.length) {
        this.page++
      } else {
        this.finished = true
      }
    }
  }
}
</script>

<style>

</style>
