<template>
  <div class="chat-container">
    <!-- 导航栏 -->
    <van-nav-bar title="小智同学" left-arrow @click-left="$router.back()" fixed />
    <!-- /导航栏 -->

    <!-- 消息列表 -->
    <div class="message-list" ref="message-list">
      <div class="message-item" :class="{ reverse: item.isMe }" v-for="(item,index) in messages" :key="index">
        <van-image
          class="avatar"
          slot="icon"
          round
          width="30"
          height="30"
          :src="item.photo"
        />
        <div class="title">
          <span >{{ item.message }}</span>
        </div>
      </div>
    </div>
    <!-- /消息列表 -->

    <!-- 发送消息 -->
    <van-cell-group class="send-message">
      <van-field v-model.trim="message" center clearable>
        <van-button slot="button" size="small" type="primary" @click="onSendMessage">发送</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发送消息 -->
  </div>
</template>

<script>
import io from 'socket.io-client'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'userChat',
  data () {
    return {
      message: '',
      socket: null,
      // [ { message: '消息数据', isMe: true, photo: '头像' }, ]
      messages: getItem('chat-messages') || []// 存储所有的消息列表
    }
  },
  watch: {
    // 消息列表改变时自动储存并跳到底部
    messages (newValue) {
      setItem('chat-messages', newValue)
      // 要想改变数据后立即操作dom，需要用到this.$nextTick
      this.$nextTick(() => {
        this.toBottom()
      })
    }
  },
  created () {
    // 建立链接
    const socket = io('http://ttapi.research.itcast.cn')

    // 把 socket 存储到 data 中，然后就可以在 methods 中访问到了
    this.socket = socket

    // 当客户端与服务器建立连接成功，触发 connect 事件
    socket.on('connect', () => {
      console.log('建立连接成功！')
    })

    // 监听接收服务端消息
    socket.on('message', data => {
      console.log('收到服务器消息：', data)
      this.messages.push({
        message: data.msg,
        isMe: false,
        photo: 'http://toutiao.meiduo.site/FkBUsGwtrHKjoF0NPLzeilckol1-'
      })
    })
  },
  mounted () {
    window.list = this.$refs['message-list']
  },
  methods: {
    onSendMessage () {
      const message = this.message
      if (!message) {
        return
      }
      // 发送消息
      this.socket.emit('message', {
        msg: message,
        timestamp: Date.now()
      })
      // 放进消息列表
      this.messages.push({
        message,
        isMe: true,
        photo: 'https://img.yzcdn.cn/vant/cat.jpeg'
      })
      // 情况输入框
      this.message = ''
    },
    toBottom () {
      const messageList = this.$refs['message-list']
      messageList.scrollTop = messageList.scrollHeight
    }
  }
}
</script>

<style scoped lang="less">
.chat-container {
    position: absolute;
    width: 100%;
    height: 100%;
    padding: 46px 0 50px 0;
    top: 0;
    left: 0;
    box-sizing: border-box;
    background: #f5f5f6;
    .message-list {
      height: 100%;
      overflow-y: scroll;
      .message-item {
        display: flex;
        align-items: center;
        padding: 10px;
        .title {
          background: #fff;
          padding: 5px;
          border-radius: 6px;
          font-size: 16px;
          max-width: 76%;
        }
        .avatar {
          margin-right: 5px;
        }
      }
      .reverse {
        flex-direction: row-reverse;
        .title {
          margin-right: 5px;
        }
      }
    }

    .send-message {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #f5f5f6 !important;
    }
  }
</style>
