<template>
  <div>
    <Modal  :closable="false"  :mask-closable="false" :value="modalShow" title="添加文章" width="500">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate"     :label-width="80">
        <FormItem label="ID" prop="id">
          <Input v-model="formValidate.id"  placeholder="ID" ></Input>
        </FormItem>
        <FormItem label="栏目ID" prop="cid">
          <Input v-model="formValidate.cid"   placeholder="栏目ID" ></Input>
        </FormItem>
        <FormItem label="标题：" prop="title">
          <Input v-model="formValidate.title"  placeholder="输入文章标题" ></Input>
        </FormItem>
        <FormItem label="文章内容："prop="content">
          <Input v-model="formValidate.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入文章内容"></Input>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消1</Button>
        <Button type="primary" size="large" @click="okSubmit('formValidate')">确定</Button>
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
    propsData: Object

  },
  data () {
    return {
      formValidate: {
        id: 0,
        cid: '',
        title: '',
        content: ''
      },
      ruleValidate: {
        cid: [
          {required: true, message: '栏目不能为空', trigger: 'change'}
        ],
        title: [
          {required: true, message: '标题不能为空', trigger: 'change'}
        ],
        content: [
          {required: true, message: '内容不能为空', trigger: 'change'}
        ]
      },
    }
  },
  methods: {
    // 表单提交
    okSubmit (name) {
      let _this = this
      this.$refs[name].validate((valid) => {
        if (valid) {
          let params = this.$data.formValidate
          console.log(params.id)
          if (params.id == 0) {
            addArticle(params).then(function (data) {
              if (data.data.code === 0) {
                _this.$Message.success('操作成功!')
                window.location.href = '/customer/article'
              } else {
                // console.log(data);
                _this.$Message.error(data.data.message)
              }
            })
              .catch(function (error) {
                // console.log(error)
                _this.$Message.error(error)
              })
          } else {
            editArticle(params).then(function (data) {
              if (data.data.code === 0) {
                _this.$Message.success('操作成功!')
                window.location.href = '/customer/article'
              } else {
                // console.log(data);
                _this.$Message.error(data.data.message)
              }
            })
              .catch(function (error) {
                // console.log(error)
                _this.$Message.error(error)
              })
          }
        } else {
          _this.$Message.error('参数验证失败，请检查参数是否正确!')
        }
      })
    },
    cancel () {
      this.$emit('on-close', 'close')
    }
  },
  watch: {
    propsData (value) {
      // 将 value 赋给 data
      this.formValidate = value
    }
  }
}
</script>
