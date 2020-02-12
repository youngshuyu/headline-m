<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar :title="`${currentComment.reply_count}条回复`">
      <van-icon
        slot="left"
        name="cross"
        @click="$emit('click-close')"
      />
    </van-nav-bar>
    <!-- /导航栏 -->

    <!-- 当前评论项 -->
    <comment-item :comment="currentComment"/>
    <!-- /当前评论项 -->

    <van-cell title="所有回复" />

    <!-- 评论的回复列表 -->
    <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
    >
        <comment-item :comment="comment" v-for="(comment, index) in list" :key="index" />
    </van-list>
    <!-- /评论的回复列表 -->
    <!-- 回复评论 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
    >
    <!-- 在组件上使用v-model相当于
        :value="inputComment"
        @input="inputComment = 事件参数" -->
      <post-comment v-model="inputComment" @click-post="onPostComment"/>
    </van-popup>
    <!-- /回复评论 -->
    <!-- 底部 -->
    <div class="footer">
      <van-button
        class="write-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
      >写评论</van-button>
      <van-icon
        name="good-job"
        @click="onLike"
      />
    </div>
    <!-- /底部 -->
  </div>
</template>

<script>
import commentItem from './comment-item'
import postComment from './post-comment'
import { getComments, addComment } from '@/api/comment'
export default {
  name: 'CommentReply',
  components: { commentItem, postComment },
  props: {
    currentComment: {
      type: Object,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 20,
      isPostShow: false,
      inputComment: ''
    }
  },
  methods: {
    async onLoad () {
      const { data } = await getComments({
        type: 'c',
        source: this.currentComment.com_id.toString(),
        offset: this.offset,
        limit: this.limit
      })
      const { results } = data.data
      this.list.push(...results)

      // 加载状态结束
      this.loading = false
      // 4. 判断是否还有数据
      if (results.length) {
        this.offset = data.data.last_id // 更新获取下一页数据的标记
      } else {
        this.finished = true // 没有数据了，结束
      }
    },
    async onPostComment () {
      let inputComment = this.inputComment.trim()
      // 非空校验
      if (!inputComment.length) {
        this.$toast('请输入评论内容')
        return
      }
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      // 发送数据
      try {
        const { data } = await addComment({
          target: this.currentComment.com_id.toString(),
          content: inputComment,
          art_id: this.articleId // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })
        // 清空文本框
        this.inputComment = ''
        // 关闭弹层
        this.isPostShow = false
        // 新增评论放到最上面
        this.comments.unshift(data.data.new_obj)
        // 更新回复的总数量
        this.currentComment.reply_count++
        this.$toast.success('发布成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('发表评论失败')
      }
    },
    onLike () {}
  }
}
</script>

<style lang="less" scoped>
.van-nav-bar {
    background-color: #fff;
    .van-nav-bar__title {
        color: #000;
    }
    .van-icon {
        color: #000;
    }
}
.footer {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 44px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .write-btn {
      width: 160px;
    }
    .van-icon {
      font-size: 20px;
    }
    .comment-icon {
      bottom: -2px;
    }
    .share-icon {
      bottom: -2px;
    }
  }
</style>
