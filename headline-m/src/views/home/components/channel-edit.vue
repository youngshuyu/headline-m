<template>
  <div class="channel-edit">
    <van-cell title="我的频道" :border="false">
      <van-button size="mini" round type="danger" plain @click="isEditShow = !isEditShow">编辑</van-button>
    </van-cell>

    <van-grid :gutter="10">
      <van-grid-item
        v-for="(channel,index) in userChannels"
        :key="channel.id"
        @click="onUserChannelClick(index)"
      >
      <span slot="text" class="text" :class="{active: index === active}">{{channel.name}}</span>
      <van-icon v-show="isEditShow && index !== 0" slot="icon" name="close" />
      </van-grid-item>
    </van-grid>

    <van-cell title="推荐频道" :border="false" />
    <van-grid :gutter="10">
      <van-grid-item
        v-for="channel in remainingChannels"
        :key="channel.id"
        :text="channel.name"
        @click="addMyChannels(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [],
      isEditShow: false
    }
  },
  computed: {
    remainingChannels () {
      let { allChannels, userChannels } = this
      // 剩余频道 = 所有频道 - 我的频道
      let channels = []
      allChannels.forEach(item => {
        // 如果我的频道中不包含当前被遍历的频道，则要放入推荐频道中
        if (!userChannels.find(i => i.id === item.id)) {
          channels.push(item)
        }
      })
      return channels
    }
  },
  watch: {},
  created () {
    this.getChannels()
  },
  mounted () {},
  methods: {
    async getChannels () {
      let { data } = await getAllChannels()
      console.log(data)
      let { channels } = data.data
      this.allChannels = channels
      console.log(this.allChannels)
    },
    addMyChannels (channel) {
      this.userChannels.push(channel)
    },
    onUserChannelClick (index) {
      // 编辑状态执行编辑操作
      if (this.isEditShow && index !== 0) {
        this.userChannels.splice(index, 1)
      } else {
        // 非编辑状态执行切换频道操作
        this.$emit('switch', index)
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 40px 0;
}
/deep/ .van-grid-item__icon-wrapper {
  position: absolute;
  right: -5px;
  top: -14px;
  .van-icon-close {
    font-size: 14px;
  }
}
.text {
    color: #646566;
    font-size: 12px;
}
.active{
  color: red;
}

</style>
