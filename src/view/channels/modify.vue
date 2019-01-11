<template>
  <div>
    <Modal :closable="false"  :mask-closable="false"  :value="modalShow" title="记录详细"   width="700">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="频道名" prop="title">
          <Input v-model="formValidate.title" placeholder="输入频道名"></Input>
        </FormItem>
        <FormItem label="展示位" prop="position">
          <Select v-model="formValidate.position" multiple>
            <Option v-for="item in positionList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <p class="gray">此栏目会在对应位置进行展示，仅对顶级栏目有效。</p>
        </FormItem>
        <FormItem label="概述：">
          <Input v-model="formValidate.description" type="textarea" :rows="8" placeholder="对本栏目的介绍信息"></Input>
        </FormItem>
        <FormItem label="外链接" prop="link">
          <Input v-model="formValidate.link" placeholder="外链接"></Input>
          <p class="gray">默认为空，需要链接到外部时请填写</p>
        </FormItem>

        <FormItem label="封面：">
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
        </FormItem>
        <FormItem label="权重" prop="weight">
          <InputNumber v-model="formValidate.weight" placeholder="输入权重"></InputNumber>
          <p class="gray">权重越大，优先展示</p>
        </FormItem>
        <FormItem label="状态" prop="status">
          <RadioGroup v-model="formValidate.status">
            <Radio v-for="item in statusList" :key="item.value" :label="item.value" :value="item.value">{{
              item.label}}
            </Radio>
          </RadioGroup>
          <p class="gray">禁用后，此栏目不可被选择，不再显示</p>
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
import {addChannel, editChannel} from '@/api/channel'
import {statusList, positionList} from '@/config/params'
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
    fid: Number ,
  },
  data () {
    return {
      positionList: positionList,
      statusList: statusList,
      id:0,
      // 显示的图片地址，绝对路径，注意上传的图片地址是相对路径，所以要分离
      cover_show: default_pic,
      formValidate: {
        title: '',
        position: '',
        cover: '',
        weight: 0,
        status: 0,
        description: '',
        link: ''
      },
      ruleValidate: {
        title: [
          {required: true, message: '栏目名不能为空', trigger: 'change'}
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
    // 表单提交
    okSubmit (name) {
      let _this = this
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = this.$data.formValidate
          //检测是否有用户名，如有走新建的方法，否则走修改方法
          let ajaxFunc = (_this.id === 0) ? addChannel(params) : editChannel(params, _this.id);
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
        //   this.thumbnail_show = this.$config.uploadBase + content;
        //   break;
        case 'cover':
          this.formValidate.cover = content;
          this.cover_show = this.$config.uploadBase + content;
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
        this.formValidate.title = value.title;
        this.formValidate.position = value.position;
        this.formValidate.cover = value.cover;
        this.cover_show = (value.cover.substring(0, 4) === 'http' || value.cover=='') ? value.cover : this.$config.uploadBase + value.cover;
        this.formValidate.weight =  value.weight;
        this.formValidate.status = value.status;
        this.formValidate.description = value.description;
        this.formValidate.link = value.link;

      } else {
        // 如果传入的是空对象，认为是新建，初始化默认值
        this.formValidate.fid = this.fid;
        this.id = 0;
        this.formValidate.title = '';
        this.formValidate.position = '';
        this.formValidate.cover = '';
        this.formValidate.weight = 0;
        this.formValidate.status = 0;
        this.formValidate.description = '';
        this.formValidate.link = '';
      }
    }
  }
}
</script>
