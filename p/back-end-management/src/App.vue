<template>
  <div id="app">
    <v-main></v-main>
  </div>
</template>

<script>
import main from './components/main'
export default {
  name: 'app',
  data () {
    return {}
  },
  components: {
    'v-main': main
  }
}
</script>
<style lang="less">

</style>
