<template>
  <div>
    <Row>
      <Col span="8">
        <Button type="primary" icon="plus-round" @click='addUser'>添加新用户</Button>
      </Col>
    </Row>
    <Card>
      <tables ref="tables" searchable search-place="top" v-model="DataList" :columns="columns" />

      <Page class-name="mTop15" :total="pageTotal" :current="pageNum" :page-size="pageSize" show-total show-elevator
            show-sizer :page-size-opts="[10, 20, 50, 100, 200]" placement="top" @on-change="handlePage"
            @on-page-size-change='handlePageSize'></Page>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
    <!--// 弹框 -->
    <user-edit :modalShow="userLayer" @on-close="closeUserLayer" @modify-finished="fetchData" :propsData="userLayerPropsData"></user-edit>
  </div>
</template>

<script>
import Tables from '_c/tables'
// 列表、
import {getUserList, getUserInfo, saveUserStatus, delUserInfo} from '@/api/front_user'
import {getLevelCn} from '@/libs/params'
import UserEdit from './user-edit.vue'

export default {
  name: 'tables_page',
  components: {
    UserEdit,
    Tables
  },
  data () {
    return {
      pageTotal: 0,
      pageNum: 1,
      pageSize: 10,
      columns: [
        {title: 'ID', key: 'id', width: 80, sortable: true},
        {title: '用户名', key: 'username', sortable: true},
        {
          title: '帐号',
          key: 'mobile',
          sortable: true,
        },
        {title: '邮箱', key: 'email', sortable: true},
        {
          title: '用户级别',
          key: 'level',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'default',
                size: 'small'
              }
            }, getLevelCn(params.row.level))
          }
        },
        {title: '最后登陆', key: 'last_login'},
        {title: '过期时间', key: 'out_date'},
        {title: '创建时间', key: 'created_at'},
        {
          title: '是否启用',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('i-switch', {
                // 数据库1是启用，0是禁用
                props: {
                  type: 'primary',
                  value: params.row.status === 0
                  // 控制开关的打开或关闭状态，官网文档属性是value
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  'on-change': (value) => {
                    // 触发事件是on-change,用双引号括起来，
                    // 参数value是回调值，并没有使用到
                    this.switchUser(params.row.id,params.row.status)
                    // params.index是拿到table的行序列，可以取到对应的表格值
                  }
                }
              })
            ])
          }
        },
        {title: '选稿员ID', key: 'leader'},
        {
          title: '操作',
          key: 'handle',
          width: 200,
          // options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.editUser(params.row.id)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.delUser(params.row.id)
                    }
                  }
                }, '删除')
              ])
            }
          ]
        }
      ],
      DataList: [],
      userLayerPropsData: {},
      userLayer: false
    }
  },
  methods: {

    handlePage (value) {
      this.pageNum = value
      this.fetchData()
    },
    handlePageSize (value) {
      this.pageSize = value
      this.fetchData()
    },
    fetchData () {
      getUserList(this.pageNum, this.pageSize).then(res => {
        this.DataList = res.data.data.list
        this.pageTotal = res.data.data.total
      })
    },
    fetchUserData (id) {
      getUserInfo(id).then(res => {
        this.userLayerPropsData = res.data.data
      })
    },

    // 弹框,开启
    openModal (data) {
      console.log(data)
      this.$nextTick(() => {
        this.userLayer = true
        this.userLayerPropsData = data
      })
    },

    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },

    // 添加弹框
    addUser () {
      this.userLayerPropsData = {}
      this.openModal({})
    },

    // 添加弹框
    editUser (id) {
      this.userLayerPropsData = {}
      this.fetchUserData(id)
      this.openModal(this.userLayerPropsData)
    },

    // 弹框,关闭
    closeUserLayer (data) {
      this.$nextTick(() => {
        this.userLayer = false
        if (data == 'close_form') {
          this.DataList = []
          this.userLayerPropsData = {}
          setTimeout(() => {
            this.fetchData()
          }, 400)
        }
      })
    },

    switchUser (id, status) {
       saveUserStatus(id, status===1?0:1);
    },

    delUser(id) {
      let _this = this;
      delUserInfo(id).then(function (data) {
        if (data.data.code === 0) {
          _this.$Message.success('删除成功!');
          _this.fetchData();
        } else {
          _this.$Message.error(data.data.message)
        }
      })
        .catch(function (error) {
          _this.$Message.error(error)
        })
    }





  },
  mounted () {
    this.fetchData();
  }
}
</script>

<style>

</style>
