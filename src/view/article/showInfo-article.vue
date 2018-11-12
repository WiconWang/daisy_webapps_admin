<template>
  <div>
    <Modal  :closable="false" :mask-closable="false" :value="modalShow" title="文章内容" width="800">
        <h2 v-html="title"></h2>
        <h3 v-html="shortTitle" class="shortTitle"></h3>
        <div v-html="content"  class="content" ></div>
      <div slot="footer">
        <Button  type="primary" size="large" @click="cancel">取消</Button>
      </div>

    </Modal>
  </div>
</template>
<script>

import {editArticle, addArticle} from '@/api/article'

export default {
  name: 'addArticle',
  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
    propsData: Object,
  },
  data () {
    return {
      title: '',
      content: '',
      shortTitle: '',
    }
  },
  methods: {
    cancel () {
      this.$emit('on-close', 'close')
    }
  },
  watch: {
    propsData (value) {
      // 将 value 赋给 data
      this.title = value.title
      this.content = value.content
      this.shortTitle = value.short_title
    }
  }
}
</script>
<style>
  .content img{
    max-width: 100%;}
  .shortTitle{
    margin: 10px 0;
  }
</style>
