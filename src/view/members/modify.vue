<template>
  <div>
    <Modal :closable="false"  :mask-closable="false"  :value="modalShow" title="记录详细"   width="700">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="手机号" prop="mobile">
          <Input v-model="formValidate.mobile" placeholder="输入手机号"></Input>
        </FormItem>
        <FormItem label="用户名" prop="username">
          <Input v-model="formValidate.username" placeholder="输入用户名"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="formValidate.password" placeholder="输入密码,不修改密码请留空"></Input>
        </FormItem>
        <FormItem label="用户级别" prop="level">
          <RadioGroup v-model="formValidate.level">
            <Radio v-for="item in levelList" :key="item.value" :label="item.value" :value="item.value">{{
              item.label}} </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="Email" prop="email">
          <Input v-model="formValidate.email" placeholder="输入Email"></Input>
        </FormItem>

        <FormItem label="头像：">
          <Row>
            <Col span="12">
              <Button type="info" icon="ios-cloud-upload-outline">上传图片</Button>
              <input id="cover" name="file" type="file" accept="image/png,image/gif,image/jpeg"
                     @change="(value) => uploadCover(value, 'cover')" style="position: absolute;left: 0;top: 0;opacity: 0;"/>
            </Col>
          </Row>
          <br/>
          <Row>
            <img :src="cover_show" style="width:120px;"/>
          </Row>
          <!--<b>头像：本页面显示的顶图，不需要请留空</b>-->
        </FormItem>
        <FormItem label="过期时间">
          <DatePicker type="datetime" v-model="formValidate.out_date"  @on-change="formValidate.out_date=$event"  format="yyyy-MM-dd" placeholder="请输入过期时间"></DatePicker>
        </FormItem>
        <FormItem label="状态" prop="status">
          <RadioGroup v-model="formValidate.status">
            <Radio v-for="item in statusList" :key="item.value" :label="item.value" :value="item.value">{{
              item.label}}
            </Radio>
          </RadioGroup>
          <p class="gray">禁用后，用户无法登陆</p>
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
import {saveMemberInfo,  createMemberInfo,  updateMemberInfo} from '@/api/member'
import {statusList,levelList} from '@/config/params'
import {uploadImage} from '@/api/common'
import default_pic from '@/assets/images/default_pic.png'


export default {
  name: 'Modify',

  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
    propsData: Object,
  },
  data () {
    return {
      levelList: levelList,
      statusList: statusList,
      id:0,
      // 显示的图片地址，绝对路径，注意上传的图片地址是相对路径，所以要分离
      cover_show: default_pic,
      formValidate: {
        mobile: '',
        password: '',
        cover: '',
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
          {required: true, message: '用户级别不能为空', trigger: 'change', type: 'number'},
          {
            type: 'number', min: 0, max: 100, message: '用户级别不能为空', trigger: 'change', transform(value) {
              return Number(value);
            }
          }
        ],
        out_date: [
          {required: true, type: 'date', message: '用户过期时间不能为空', trigger: 'change'}
        ],
        status: [
          {required: true, message: '状态不能为空', trigger: 'change', type: 'number'},
          {
            type: 'number', min: 0, max: 1, message: '状态不能为空', trigger: 'change', transform(value) {
              return Number(value);
            }
          }
        ],
      }
    }
  },
  methods: {
    // axios默认异步，此处使用promise封装同步，并把结果返回给resolve,error返回给reject
    // saveMemberPromise (data) {
    //   return new Promise((resolve, reject) => {
    //     saveMemberInfo(data).then(res => {
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
          //检测是否有用户名，如有走新建的方法，否则走修改方法
          let ajaxFunc = (_this.id === 0) ? createMemberInfo(params) : updateMemberInfo(params, _this.id);
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
    },



    // 上传照片，只支持单个图上传
    uploadCover(e, name) {
      let _this = this;
      let file = e.target.files[0];
      let param = new FormData();
      param.append('file', file);
      param.append('folder', 'cover');
      if (["image/jpeg", "image/png", "image/gif", "image/webp"].indexOf(file.type) < 0) {
        _this.$Message.error({duration: 5, content: '失败：网页只支持jpg, jpeg, png, gif, webp这几种格式，请用图像软件转换格式'});
        return false;
      }
      if ((file.size / 1024 / 1024) > 2) {
        _this.$Message.error({duration: 5, content: '失败：超过 2M 或者超过 2550px 宽度的图片，网页极易无法加载显示，请尽量进行压缩后上传!'});
        return false;
      }
      // 添加请求头
      uploadImage(param).then(response => {
        if (response.data.code === 0) {
          _this.getFields(name, response.data.data.path)
        }
      });
    },

    //  检测标签名，给对应的标签位赋值，此项用于多项均需要进行图片上传的场景
    getFields(label, content) {
      if (content == '' || content == null) return false;
      switch (label) {
        // case 'thumbnail':
        //   this.formValidate.thumbnail = content;
        //   this.thumbnail_show = this.$config.baseDomain + content;
        //   break;
        case 'cover':
          this.formValidate.cover = content;
          this.cover_show = this.$config.baseDomain + content;
          break;
      }
    }

  },
  // 监测赋值
  watch: {
    propsData(value) {
      // 如果不是空对象时，对表格进行赋值
      // 这里依次赋值是为了保证在后续 axios 的时候，不会带入不需要的字段，
      // 如果可以保证propsData传入时，就是想要提交的内容，其实可以简写为 this.formValidate = value
      if (Object.keys(value).length !== 0) {
        this.id = value.id;
        this.formValidate.mobile = value.mobile;
        this.formValidate.username = value.username;
        this.formValidate.password = value.password;
        this.formValidate.cover = value.cover;
        this.cover_show = (value.cover.substring(0, 4) === 'http' || value.cover=='') ? value.cover : this.$config.baseDomain + value.cover;
        this.formValidate.level =  value.level;
        this.formValidate.status = value.status;
        this.formValidate.email = value.email;
        this.formValidate.out_date = value.out_date;

      } else {
        // 如果传入的是空对象，认为是新建，初始化默认值
        this.id = 0;
        this.formValidate.mobile = '';
        this.formValidate.password = '';
        this.formValidate.cover = '';
        this.formValidate.level = 0;
        this.formValidate.username = '';
        this.formValidate.status = 0;
        this.formValidate.email = 0;
        this.formValidate.out_date = '';
      }
    }
  }
}
</script>
