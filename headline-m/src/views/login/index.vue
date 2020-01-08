<template>
  <div class="login">
    <van-nav-bar title="登录" />
    <van-cell-group>
      <van-field
        v-model="user.mobile"
        placeholder="请输入手机号"
      >
      <i class="iconfont icon-mobile" slot="left-icon"></i>
      </van-field>
      <van-field v-model="user.code" left-icon="browsing-history-o" placeholder="请输入验证码">
          <i class="iconfont icon-password" slot="left-icon"></i>
          <van-count-down :time="time" slot="button" format="ss s" @finish="showCountDown = false" v-if="showCountDown"/>
          <van-button slot="button" size="small" type="primary" v-else round @click="onSendMsg">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="login-btn-box">
        <van-button type="info" @click="onLogin">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login, getMsgCode } from '@/api/user'
export default {
  data () {
    return {
      time: 5 * 1000,
      showCountDown: false,
      user: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    async onSendMsg () {
      try {
        this.showCountDown = true
        let { mobile } = this.user
        await getMsgCode(mobile)
      } catch (error) {
        console.log(error)
        this.$toast('短信已发送')
      }
    },
    async onLogin () {
      // 开始转圈圈
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '登录中...' // 提示消息
      })
      try {
        const res = await login(this.user)
        console.log('登录成功', res)
        this.$toast.success('登录成功')
      } catch (err) {
        console.log('登录失败', err)
        this.$toast.fail('登录失败,请检查手机号码或短信验证码是否正确！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.van-cell {
    height: 45px;
    align-items: center;
}
.login-btn-box{
    padding: 27px 16px;
    .van-button {
        width: 100%;
    }
}
</style>
