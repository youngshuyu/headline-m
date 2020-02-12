<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      title="文章详情"
      left-arrow
      fixed
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <!-- 加载中 -->
    <van-loading
      class="loading"
      color="#1989fa"
      vertical
      v-if="loading"
    >
      <slot>加载中...</slot>
    </van-loading>
    <!-- /加载中 -->

    <!-- 文章详情 -->
    <div class="detail">
      <h3 class="title">{{articleContent.title}}</h3>
      <div class="author-wrap">
        <div class="base-info">
          <van-image
            class="avatar"
            round
            fit="cover"
            :src="articleContent.aut_photo"
          />
          <div class="text">
            <p class="name">{{articleContent.aut_name}}</p>
            <p class="time">{{articleContent.pubdate | relativeTime}}</p>
          </div>
        </div>
        <!-- 用户不能关注自己 -->
        <van-button class="follow-btn"
        :type="articleContent.is_followed ? 'dafault': 'info'"
        size="small"
        round
        v-if="!user || articleContent.aut_id !== user.id"
        @click="onFollow">{{articleContent.is_followed ? '已关注':'+ 关注'}}</van-button>
      </div>
      <div class="markdown-body" v-html="articleContent.content" style="margin-bottom:50px"></div>
      <p style="text-align:center;font-size:14px;color:#ccc;">------------  正文结束  ------------</p>
    </div>
    <!-- /文章详情 -->

    <!-- 加载失败提示 -->
    <div class="error" v-if="netError">
      <img src="./no-network.png" alt="no-network">
      <p class="text">亲，网络不给力哦~</p>
      <van-button
        class="btn"
        type="default"
        size="small"
      >点击重试</van-button>
    </div>
    <!-- /加载失败提示 -->
    <!-- 文章评论 -->
    <article-comment ref="article-comment" :articleId="articleId"  @totalCount="getTotal_count" @click-reply="onReply" />

    <!-- /文章评论 -->
    <!-- 底部区域 -->
    <div class="footer">
      <van-button
        class="write-btn"
        type="default"
        round
        size="small"
        @click="isPostCommentShow = true"
      >写评论</van-button>
      <van-icon
        class="comment-icon"
        name="comment-o"
        :info="total_count > 99 ? '99+' : total_count"
      />
      <van-icon
        :color="articleContent.is_collected ? 'orange':'grey' "
        name="star"
        @click="onCollect"
      />
      <van-icon
        :color="articleContent.attitude > 0 ? '#e5645f' : 'grey'"
        name="good-job"
        @click="onLike"
      />
      <van-icon class="share-icon" name="share" />
    </div>
    <!-- /底部区域 -->
    <!-- 写评论 -->
    <van-popup
      v-model="isPostCommentShow"
      position="bottom"
    >
    <!-- 在组件上使用v-model相当于
        :value="inputComment"
        @input="inputComment = 事件参数" -->
      <post-comment v-model="inputComment" @click-post="onPostComment"/>
    </van-popup>
    <!-- /写评论 -->
    <!-- 回复评论 -->
      <van-popup
        v-model="isReplyCommentShow"
        position="bottom"
      >
      <reply-comment :currentComment="currentComment" :articleId="articleId" @click-close="isReplyCommentShow = false" v-if="isReplyCommentShow"/>
      </van-popup>
    <!-- /回复评论 -->
  </div>
</template>
<!--  -->
<script>
import { getArticleByArticleId, addCollect, deleteCollect, addLike, deleteLike, addFollow, deleteFollow } from '@/api/article.js'
import { mapState } from 'vuex'
import ArticleComment from './components/article_comment'
import PostComment from './components/post-comment'
import { addComment } from '@/api/comment'
import ReplyComment from './components/reply-comment'
export default {
  name: 'ArticlePage',
  components: { ArticleComment, PostComment, ReplyComment },
  props: {
    articleId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      articleContent: {},
      loading: false,
      netError: false,
      isCollect: false,
      isPostCommentShow: false, // 写评论弹出层
      inputComment: '',
      total_count: 0,
      isReplyCommentShow: false, // 回复评论弹层
      currentComment: {} // 当前评论项
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadData()
  },
  mounted () {},
  methods: {
    async loadData () {
      try {
        this.loading = true
        let { data } = await getArticleByArticleId(this.articleId)
        this.articleContent = data.data
      } catch (error) {
        console.log(error)
        this.netError = true
      }
      this.loading = false
    },
    async onCollect () {
      // 为收藏时发送收藏的请求
      // 这里 loading 不仅仅是为了交互提示，更重要的是请求期间禁用背景点击功能，防止用户不断的操作界面发出请求
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        if (!this.articleContent.is_collected) {
          await addCollect(this.articleId)
          this.articleContent.is_collected = true
          this.$toast.success('收藏成功')
        } else {
          await deleteCollect(this.articleId)
          this.articleContent.is_collected = false
          this.$toast.success('取消收藏')
        }
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
    },
    async onLike () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '操作中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        if (this.articleContent.attitude === -1) {
          await addLike(this.articleId)
          this.articleContent.attitude = 1
          this.$toast.success('点赞成功')
        } else {
          await deleteLike(this.articleId)
          this.articleContent.attitude = -1
          this.$toast.success('取消点赞')
        }
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
      }
    },
    async onFollow () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '发布中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        let authorId = this.articleContent.aut_id
        if (!this.articleContent.is_followed) {
          await addFollow(authorId)
          this.$toast.success('关注成功')
        } else {
          await deleteFollow(authorId)
          this.$toast.success('取消关注')
        }
        this.articleContent.is_followed = !this.articleContent.is_followed
      } catch (err) {
        console.log(err)
        this.$toast.fail('操作失败')
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
          target: this.articleId,
          content: inputComment
        // art_id // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })
        // 清空文本框
        this.inputComment = ''
        // 关闭弹层
        this.isPostCommentShow = false
        // 新增评论放到最上面
        this.$refs['article-comment'].articleComment.list && this.$refs['article-comment'].articleComment.list.unshift(data.data.new_obj)
        this.total_count++
        this.$toast.success('发布成功')
      } catch (error) {
        console.log(error)
        this.$toast.fail('发表评论失败')
      }
    },
    getTotal_count (value) {
      this.total_count = value
    },
    onReply (comment) {
      // 打开弹层
      this.isReplyCommentShow = true
      this.currentComment = comment
    }
  }
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";

.article-container {
  padding: 46px 20px 50px;
  background: #fff;
  .loading {
    padding-top: 100px;
    text-align: center;
  }
  .detail {
    margin-bottom: 30px;
    .title {
      margin: 0;
      padding-top: 24px;
      font-size: 20px;
      color: #3A3A3A;
    }
    .author-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 0;
      height: 40px;
      .base-info {
        display: flex;
        align-items: center;
        .avatar {
          width: 40px;
          height: 40px;
          margin-right: 8px;
        }
        .text {
          line-height: 1.5;
          .name {
            margin: 0;
            font-size: 14px;
          }
          .time {
            margin: 0;
            font-size: 12px;
            color: #999;
          }
        }
      }
      .follow-btn {
        width: 85px;
      }
    }
  }
  .error {
    padding-top: 100px;
    text-align: center;
    .text {
      font-size: 15px;
    }
    .btn {
      width: 30%;
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
}
</style>
