<template>
  <div class="search-results">
      <!-- 搜索结果 -->
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
    <!-- /搜索结果 -->
  </div>
</template>

<script>
import { getSearchResults } from '@/api/search'
export default {
  props: { q: {
    type: String,
    required: true
  } },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20
    }
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      let { data } = await getSearchResults({
        page: this.page,
        per_page: this.perPage,
        q: this.q
      })
      console.log(data)
      let { results } = data.data
      this.list.push(...results)
      this.loading = false
      // 4. 判断数据是否加载完毕
      if (results.length) {
        this.page++ // 更新获取下一页数据的页码
      } else {
        this.finished = true // 没有数据了，将加载状态设置结束，不再 onLoad
      }
    }
  }
}
</script>

<style>

</style>
