<template>
  <div class="login">
    <van-nav-bar title="登录" fixed/>
    <ValidationObserver ref="form">
      <van-cell-group>
        <ValidationProvider name="手机号" rules="required|mobile" immediate >
          <van-field v-model="user.mobile" placeholder="请输入手机号">
            <i class="iconfont icon-mobile" slot="left-icon"></i>
          </van-field>
        </ValidationProvider>
        <ValidationProvider name="短信验证码" rules="required|code" immediate >
          <van-field v-model="user.code" left-icon="browsing-history-o" placeholder="请输入验证码">
            <i class="iconfont icon-password" slot="left-icon"></i>
            <van-count-down
              :time="time"
              slot="button"
              format="ss s"
              @finish="showCountDown = false"
              v-if="showCountDown"
            />
            <van-button
              slot="button"
              size="small"
              type="primary"
              v-else
              round
              @click="onSendMsg"
            >发送验证码</van-button>
          </van-field>
        </ValidationProvider>
      </van-cell-group>
    </ValidationObserver>
    <div class="login-btn-box">
      <van-button type="info" @click="onLogin">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login, getMsgCode } from '@/api/user'
// 引入验证指定数据字段方法
import { validate } from 'vee-validate'
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
        // 验证手机号码格式是否正确
        let { mobile } = this.user
        // 参数1：要验证的数据
        // 参数2：验证规则
        // 参数3：一个可选的配置对象，例如配置错误消息字段名称 name
        // 返回值：{ valid, errors, ... }
        //          valid: 验证是否成功，成功 true，失败 false
        //          errors：一个数组，错误提示消息
        let validateResult = await validate(mobile, 'required|mobile', { name: '手机号' })
        // 验证失败提示第一个错误并中断发送短信
        if (!validateResult.valid) {
          console.log(validateResult)
          this.$toast(validateResult.errors[0])
          return
        }
        this.showCountDown = true
        await getMsgCode(mobile)
        // this.$toast('短信已发送')
      } catch (error) {
        console.log(error)
        // debugger
        this.$toast('请勿频繁操作')
      }
    },
    async onLogin () {
      // 表单验证
      let success = await this.$refs.form.validate()
      // 如果表单验证失败，提示用户错误
      // 必须给每一个ValidationProvider标签加一个 immediate 属性才能获取到报错
      if (!success) {
        let errors = this.$refs.form.errors
        for (let key in errors) {
          let item = errors[key]
          if (item[0]) {
            this.$toast(item[0])
            // 找到第一个错误信息，停止遍历，提示给用户该错误信息
            return
          }
        }
      }
      // 开始转圈圈
      this.$toast.loading({
        duration: 0, // 持续时间，0表示持续展示不停止
        forbidClick: true, // 是否禁止背景点击
        message: '登录中...' // 提示消息
      })
      try {
        const res = await login(this.user)
        console.log('登录成功', res)
        this.$store.commit('setUser', res.data.data)
        this.$toast.success('登录成功')
        this.$router.push('/')
      } catch (err) {
        console.log('登录失败', err)
        this.$toast.fail('登录失败,请检查手机号码或短信验证码是否正确！')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  padding-top: 45px;
}
.van-cell {
  height: 45px;
  align-items: center;
}
.login-btn-box {
  padding: 27px 16px;
  .van-button {
    width: 100%;
  }
}
</style>
