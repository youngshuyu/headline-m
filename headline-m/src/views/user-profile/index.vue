<template>
  <div>
    <van-nav-bar title="个人信息" left-arrow right-text="保存" @click-left="$router.back()" />
    <van-cell-group>
      <van-cell title="头像" @click="onAvatarChoose">
        <van-image round width="30" height="30" :src="user.photo" />
      </van-cell>
      <van-cell title="昵称" :value="user.name" />
      <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" />
      <van-cell title="生日" :value="user.birthday" />
    </van-cell-group>
    <input type="file" hidden ref="file" @change="onFileChange" />
    <!-- 图片预览 -->
    <van-image-preview v-model="isPreviewShow" :images="images" @close="$refs['file'].value = ''">
      <van-nav-bar
        slot="cover"
        left-text="取消"
        right-text="确定"
        @click-left="isPreviewShow = false"
        @click-right="onUpdateAvatar"
        style="right:0;bottom:0"
      />
    </van-image-preview>
    <!-- /图片预览 -->
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto } from '@/api/user'
// import { ImagePreview } from 'vant'
export default {
  name: 'UserProfile',
  data () {
    return {
      user: {},
      isPreviewShow: false,
      images: []
    }
  },
  computed: {
    file () {
      return this.$refs['file']
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
    },
    onAvatarChoose () {
      this.file.click()
    },
    onFileChange () {
      const fileData = window.URL.createObjectURL(this.file.files[0])
      // 图片预览
      this.images = [fileData] // 直接重置数组，防止出现多个预览图片
      this.isPreviewShow = true
    },
    async onUpdateAvatar () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        message: '保存中...',
        forbidClick: true // 是否禁止背景点击
      })
      try {
        // 1.声明formData
        const formData = new FormData()
        // 2.添加数据
        formData.append('photo', this.file.files[0])
        // 3.上传数据
        const { data } = await updateUserPhoto(formData)
        // 4.上传成功
        this.$toast.success('上传成功')
        // 5.更新头像
        this.user.photo = data.data.photo
        // 6.取消图片预览效果
        this.isPreviewShow = false
      } catch (err) {
        console.log(err)
        this.$toast.fail('上传失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .van-image-preview__cover {
  right: 0;
  bottom: -1px;
  top: unset;
  left: 0;
  .van-nav-bar {
    background-color: #000;
  }
  }

</style>
