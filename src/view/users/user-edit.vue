<template>
  <div>
    <Modal :closable="false"  :mask-closable="false"  :value="modalShow" title="用户编辑"   width="500">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <FormItem label="手机号" prop="mobile">
          <Input v-model="formValidate.mobile" placeholder="输入手机号" style="width: 340px"></Input>
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input v-model="formValidate.username" placeholder="输入用户名" style="width: 340px"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="formValidate.password" placeholder="输入密码,不修改密码请留空" style="width: 340px"></Input>
        </FormItem>
        <FormItem label="用户级别" prop="level">
          <RadioGroup v-model="formValidate.level">
            <Radio  v-for="(item, key) in levelList" :label="key"  :value="key" :key="key">{{ item }} </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="Email" prop="email">
          <Input v-model="formValidate.email" placeholder="输入Email" style="width: 340px"></Input>
        </FormItem>
        <FormItem label="过期时间">
          <DatePicker type="datetime" v-model="formValidate.out_date"  @on-change="formValidate.out_date=$event"  format="yyyy-MM-dd" placeholder="请输入过期时间" style="width: 340px"></DatePicker>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="okSubmit('formValidate')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import {saveUserInfo,  createUserInfo,  updateUserInfo} from '@/api/front_user'
import {getLevelCn} from '@/libs/params'
import params from '@/config/params'


export default {
  name: 'UserEdit',

  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
    propsData: Object,
  },
  data () {
    return {
      levelList: params.levelList,
      uid:0,
      formValidate: {
        leader:0,
        mobile: '',
        password: '',
        id: 0,
        level: 0,
        email: '',
        out_date: ''
      },
      ruleValidate: {
        username: [
          {required: true, message: '用户名不能为空', trigger: 'change'}
        ],
        mobile: [
          {required: true, message: '用户手机号不能为空', trigger: 'change'},
          {type: 'number', message: '请输入数字', trigger: 'change', transform(value) {return Number(value);}}
        ],
        email: [
          {type: 'email', message: '用户邮箱格式不正确', trigger: 'blur'}
        ],
        level: [
          {required: true, message: '用户级别不能为空', trigger: 'blur'}
        ],
        out_date: [
          {required: true, type: 'date', message: '用户过期时间不能为空', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    // axios默认异步，此处使用promise封装同步，并把结果返回给resolve,error返回给reject
    // saveUserPromise (data) {
    //   return new Promise((resolve, reject) => {
    //     saveUserInfo(data).then(res => {
    //       resolve(res)
    //     }).catch(err => {
    //       reject(err)
    //     })
    //   })
    // },

    // 表单提交
    okSubmit (name) {
      let _this = this
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = this.$data.formValidate
          let ajaxFunc = (_this.uid === 0) ? createUserInfo(params) : updateUserInfo(params, _this.uid);
          ajaxFunc.then(function (data) {
            if (data.data.code === 0) {
              _this.$Message.success('操作成功!');
              _this.$emit('modify-finished');
              _this.cancel();
            } else {
              _this.$Message.error(data.data.message)
            }
          })
            .catch(function (error) {
              console.log(error)
              _this.$Message.error(error)
            })
        } else {
          _this.$Message.error('参数验证失败，请检查参数是否正确!')
        }
      })
    },


    // 模态框取消
    cancel () {
      this.$emit('on-close', 'close')
    }
  },
  // 监测赋值
  watch: {
    propsData(value) {
      // 如果不是空对象时，对表格进行赋值,否则则重新初始化默认值
      if (Object.keys(value).length !== 0) {
        this.uid = value.id;
        this.formValidate = value;
      }else{
        Object.assign(this.$data, this.$options.data());
      }
    }
  }
}
</script>
