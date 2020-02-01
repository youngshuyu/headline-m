<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list
      v-model="articleComment.loading"
      :finished="articleComment.finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
    <comment-item v-for="(item,index) in articleComment.list"  :key="index" :comment="item"/>
      <!-- <van-cell v-for="item in articleComment.list" :key="item.com_id.toString()" :title="item">
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{ item.content }}</p>
          <p>
            <span style="margin-right: 10px;">{{ item.pubdate | relativeTime }}</span>
            <van-button size="mini" type="default">回复</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" name="like-o" />
      </van-cell> -->
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容">
        <van-button slot="button" size="mini" type="info">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->
  </div>
</template>

<script>
import { getComments } from '@/api/comment.js'
import CommentItem from './comment-item'
export default {
  name: 'ArticleComment',
  components: { CommentItem },
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      articleComment: { // 文章评论相关数据
        list: [],
        loading: false,
        finished: false,
        offset: null, // 请求下一页数据的页码
        totalCount: 0 // 总数据条数
      }
    }
  },

  methods: {
    async onLoad () {
      // 异步更新数据
      const { data } = await getComments({
        type: 'a', // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.articleId, // 源id，文章id或评论id
        offset: this.articleComment.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: 10 // 每页大小
      })
      // 结束loading
      this.articleComment.loading = false
      console.log(data, 1)
      const { results } = data.data
      console.log(results)
      this.articleComment.list.push(...results)
      // 更新总数据条数
      this.articleComment.totalCount = data.data.total_count

      // 4. 判断是否还有数据
      if (results.length) {
        this.articleComment.offset = data.data.last_id // 更新获取下一页数据的页码
      } else {
        this.articleComment.finished = true // 没有数据了，关闭加载更多
      }
    }
  }
}
</script>

<style scoped lang="less">
  .publish-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  }

  .van-list {
    margin-bottom: 45px;
  }
</style>
