<template>
  <div>
    <Row>
      <Col span="8">
        <Button type="primary" icon="plus-round" @click='addRowModal'>添加记录</Button>
      </Col>
    </Row>
    <Card>
      <tables  searchable search-place="top" v-model="DataList" :columns="columns" />

      <Page class-name="mTop15" :total="pageTotal" :current="pageNum" :page-size="pageSize" show-total show-elevator
            show-sizer :page-size-opts="[10, 20, 50, 100, 200]" placement="top" @on-change="handlePage"
            @on-page-size-change='handlePageSize'></Page>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>

    <!--// 弹框 -->
    <modify :modalShow="modifyModalStatus" @on-close="closeModal" @modify-finished="fetchTableData" :propsData="modifyRowData"></modify>
  </div>
</template>

<script>
import Tables from '_c/tables'
// 列表、
import {getMemberList, getMemberInfo, saveMemberStatus, delMemberInfo} from '@/api/member'
import {getLevelCn} from '@/libs/params'
import Modify from './modify.vue'

export default {
  name: 'tables_page',
  components: {
    Modify,
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
                    this.switchRow(params.row.id,params.row.status)
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
                      this.modifyModal(params.row.id)
                    }
                  }
                }, '修改'),

                // 删除使用 Poptip 进行一次确认
                h('Poptip', {
                  props: {
                    confirm: true,
                    title: '您确定要删除这条数据吗?',
                    transfer: true
                  },
                  on: {
                    'on-ok': () => {
                      this.delRow(params.row.id)
                    }
                  }
                }, [
                  h('Button', {
                    style: {
                      margin: '0 3px'
                    },
                    props: {
                      type: 'error',
                      placement: 'top',
                      size: 'small'
                    }
                  }, '删除')
                ])
              ])
            }
          ]
        }
      ],
      DataList: [],
      modifyRowData: {},
      modifyModalStatus: false
    }
  },
  methods: {

    // 取API数据
    fetchTableData () {
      getMemberList(this.pageNum, this.pageSize).then(res => {
        this.DataList = res.data.data.list
        this.pageTotal = res.data.data.total
      })
    },
    fetchRowData (id) {
      getMemberInfo(id).then(res => {
        this.modifyRowData = res.data.data
      })
    },

    // 页数相关触发
    handlePage (value) {
      this.pageNum = value
      this.fetchTableData()
    },
    handlePageSize (value) {
      this.pageSize = value
      this.fetchTableData()
    },

    // 导出Excel功能
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },


    // 添加记录弹框
    addRowModal () {
      this.$nextTick(() => {
        this.modifyModalStatus = true
        this.modifyRowData = {}
      })
    },

    // 修改弹框
    modifyModal (id) {
      // 清空数据变量
      this.modifyRowData = {}
      //重新拉取本数据
      this.fetchRowData(id)
      this.$nextTick(() => {
        this.modifyModalStatus = true
      })
    },

    // 弹框,关闭
    closeModal (data) {
      this.$nextTick(() => {
        this.modifyModalStatus = false
        if (data == 'close_form') {
          this.DataList = []
          this.modifyRowData = {}
          setTimeout(() => {
            this.fetchTableData()
          }, 400)
        }
      })
    },

    // 切换记录状态
    switchRow (id, status) {
      let _this = this;
       saveMemberStatus(id, status===1?0:1).then(function (data) {
         if (data.data.code === 0) {
           _this.$Message.success('切换成功!');
           _this.fetchTableData();
         } else {
           _this.$Message.error(data.data.message)
         }
       })
         .catch(function (error) {
           _this.$Message.error(error)
         })
    },

    // 删除记录
    delRow(id) {
      let _this = this;
      delMemberInfo(id).then(function (data) {
        console.log(data);
        if (data.data.code === 0) {
          _this.$Message.success('删除成功!');
          _this.fetchTableData();
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
    this.fetchTableData();
  }
}
</script>

<style>

</style>
