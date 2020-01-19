<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchContent"
        placeholder="请输入搜索关键词"
        show-action
        shape="round"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
        @input="onSearchInput"
      />
    </form>
    <!-- /搜索栏 -->
    <!-- 搜索结果 -->
    <search-results v-if="isResultShow" :q="searchContent"/>
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <van-cell-group v-else-if="searchContent">
      <van-cell icon="search" v-for="(item,index) in searchResult" :key="index">
          <div slot="title" v-html="highLight(item)"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->

    <!-- 历史记录 -->

    <van-cell-group v-else>
        <van-cell title="历史记录" >
      <van-icon name="delete" />
      <span>全部删除</span>
      &nbsp;&nbsp;
      <span>完成</span>
    </van-cell>
      <van-cell title="单元格">
        <van-icon name="close"></van-icon>
      </van-cell>
      <van-cell title="单元格">
        <van-icon name="close"></van-icon>
      </van-cell>
      <van-cell title="单元格">
        <van-icon name="close"></van-icon>
      </van-cell>
      <van-cell title="单元格">
        <van-icon name="close"></van-icon>
      </van-cell>
      <van-cell title="单元格">
        <van-icon name="close"></van-icon>
      </van-cell>
    </van-cell-group>
    <!-- /历史记录 -->

  </div>
</template>

<script>
import searchResults from './components/search-results'
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'

export default {
  name: 'SearchPage',
  components: {
    'search-results': searchResults
  },
  props: {},
  data () {
    return {
      searchContent: '', // 搜索内容
      list: [],
      loading: false,
      finished: false,
      isResultShow: false,
      searchResult: []
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    onSearch () {
      console.log('onSearch')
      this.isResultShow = true
    },
    onCancel () {
      console.log('onCancel')
    },
    // 函数防抖
    onSearchInput: debounce(async function () {
      let searchText = this.searchContent
      if (!searchText) {
        return
      }
      let { data } = await getSearchSuggestions(searchText)
      console.log(data)
      this.searchResult = data.data.options
    }, 300),
    // 搜索关键字高亮
    highLight (str) {
      // /this.searchText/  注意：/这里的一切都是字符串/
    // 如果想要动态的创建一个正则表达式，使用 new RegExp 手动构造
    // 它会根据字符串创建一个正则表达式对象
    // 参数2：用来指定匹配模式，例如 g 全局，i 忽略大小写
    // /dsadsa/gi
      let reg = new RegExp(this.searchContent, 'ig')
      return str.replace(reg, `<span style="color:red">${this.searchContent}</span>`)
    }
  }
}
</script>

<style scoped lang="less">
.search-container{
    padding-top: 54px;
    .search-form {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1;
    }
    .van-search__action {
        color: #fff;
    }
}
</style>
