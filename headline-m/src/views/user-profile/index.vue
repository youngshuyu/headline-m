<template>
  <div>
    <van-nav-bar title="个人信息" left-arrow right-text="保存" @click-left="$router.back(-1)"/>
    <van-cell-group>

      <van-cell title="头像" is-link>
        <van-image round width="30" height="30" :src="user.photo" />
      </van-cell>
      <van-cell title="昵称" :value="user.name"  />
      <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" />
      <van-cell title="生日" :value="user.birthday" />
    </van-cell-group>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'

export default {
  name: 'UserProfile',
  data () {
    return {
      user: {}
    }
  },

  created () {
    this.loadUserProfile()
  },

  methods: {
    async loadUserProfile () {
      try {
        let { data } = await getUserProfile()
        console.log(data)
        this.user = data.data
      } catch (err) {
        console.log(err)
      }
    }
  }

}
</script>
