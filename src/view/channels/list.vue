<template>
  <div>
    <Card shadow>
      <Button size="small" type="info" @click="addRowModal(0)">添加顶级栏目</Button>
      <br>
      <br>
      <tree-table expand-key="title" :expand-type="false" :selectable="false" :columns="columns" :data="DataList" >
        <template slot="edit" slot-scope="scope">
          <Button size="small" type="info" @click="addRowModal(scope)">添加子栏目</Button>
          <Button size="small" type="warning" @click="modifyModal(scope)">修改</Button>
          <Poptip placement="left"
            confirm
            title="确认删除?"
            @on-ok="delButton(scope)"
            @on-cancel="del_cancel">
            <Button  size="small" type="error" >删除</Button>
          </Poptip>
        </template>
        <template slot="status" slot-scope="scope">
          {{scope.row.status== 0 ?'启用':'禁用'}}
        </template>
      </tree-table>
    </Card>
    <!--// 弹框 -->
    <modify :modalShow="modifyModalStatus" @on-close="closeModal" @modify-finished="fetchTableData" :propsData="modifyRowData" :fid="fid"></modify>

  </div>
</template>

<script>
  import Modify from './modify.vue'
  import {getChannelList,  getChannel , delChannel} from '@/api/channel'

  export default {
    name: 'tree_table_page',
    components: {
      Modify,
    },
    data () {
      return {
        DataList: [],
        modifyRowData: {},
        modifyModalStatus: false,
        fid:0,
        columns: [
          {
            title: 'id',
            key: 'id',
            minWidth: '80px'
          },
          {
            title: '栏目名',
            key: 'title',
            minWidth: '200px'
          },
          {
            title: '展示位置',
            key: 'position',
            minWidth: '100px'
          },
          {
            title: '栏目状态',
            // key: 'status',
            minWidth: '100px',
            type: 'template',
            template: 'status'
          },
          {
            title: '权重排序',
            key: 'weight',
            minWidth: '100px'
          },
          {
            title: '操作',
            minWidth: '200px',
            type: 'template',
            template: 'edit'
          }
        ]
      }
    },
    methods: {
      // 取API数据
      fetchTableData () {
        // console.log('aldf')
        this.DataList = this.data;
        getChannelList().then(res => {
          this.DataList = res.data.data.list
        })
      },
      fetchRowData (id) {
        getChannel(id).then(res => {
          this.modifyRowData = res.data.data
        })
      },

      // 添加记录弹框
      addRowModal (scope) {
        this.fid = (scope === 0)?0:scope.row.id;
        this.$nextTick(() => {
          this.modifyModalStatus = true
          this.modifyRowData = {}
        })
      },

      // 修改弹框
      modifyModal (scope) {
        // 清空数据变量
        this.modifyRowData = {}
        //重新拉取本数据
        this.fetchRowData(scope.row.id)
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
      delButton (scope) {
        let _this = this;
        delChannel(scope.row.id).then(function (data) {
          // console.log(data);
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
      },
      del_cancel(){
        console.log('已取消')
      }

    },
    mounted () {
      this.fetchTableData();
    }
  }
</script>

<style>
  Button {
    margin-right: 5px;
  }
</style>
