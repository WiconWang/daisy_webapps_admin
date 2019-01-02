<template>
<div>
  <Card>
  <tables :columns="columns"  searchable search-place="top"    v-model="propsData" ></tables>
  <Page class-name="mTop15" :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-sizer show-total
          placement="top" :page-size-opts="[10, 20, 50, 100, 200]"   @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>

    <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
  </Card>
  <ShowInfo :modalShow="addCustomerLayerShow" @on-close="closeModal" :propsData="editPropsData"></ShowInfo>
</div>
</template>

<script>
  import Tables from '_c/tables'
  import { getArticleInfo ,getArticleList,delArticle} from '@/api/article'
  //import Upgrade from './upgrade.vue'
  //import AddCustomer from './add-article.vue'
  import ShowInfo from './showInfo-article.vue'

  export default {
    name: 'tables_page',
    components: {
      Tables,
     //Upgrade,
      ShowInfo
    },
    data () {
      return {
        pageTotal: 0,
        pageNum: 1,
        pageSize: 10,

        columns: [
          {
            title: 'id',
            key: 'id',
            width:100,
          },
          {
            title: '栏目',
            key: 'cid',
            width:60,
          },
          {
            title: '标题',
            key: 'title',
          },
          {
            title: '小标题',
            key: 'short_title',
          },
          {
            title: '创建时间',
            key: 'created_at',
            width:120,
          },
          {
            title: '作者',
            key: 'author_name',
            width:80,
          },
          {
            title: '操作',
            key: 'handle',
            width: 100,
            // options: ['delete'],
            button: [
              (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.editArticle(params.row.id)
                      }
                    }
                  }, '查看')
                ])
              }
            ]
          }

        ],
        propsData:{},
        propsUpgradeData:{},
        editPropsData:{},
        upgradeLayerShow: false,
        addCustomerLayerShow:false
      }
    },
    //存放axios方法
    methods: {
      exportExcel () {
        this.$refs.tables.exportCsv({
          filename: `table-${(new Date()).valueOf()}.csv`
        })
      },
      handlePage(value) {
        this.pageNum = value;
        this.fetchData();
      },
      handlePageSize(value) {
        this.pageSize = value;
        this.fetchData();
      },
      fetchData () {
        getArticleList(this.pageNum, this.pageSize).then(res => {
          if (res.data.code === 0){
            this.propsData = res.data.data.list;
            this.pageTotal = res.data.data.total;
          } else {
            alert(res.data.message);
          }
        })
      },


      openModal(data) {
        //console.log(data)
        this.$nextTick(() => {
          this.addCustomerLayerShow = true
          this.editPropsData = data
        })
      },
      // 添加弹框
      editArticle(id) {
        this.editPropsData = {}
        this.fetchArticleData(id)
        this.openModal(this.editPropsData)
      },
      fetchArticleData(id) {
        getArticleInfo(id).then(res => {
          this.editPropsData = res.data.data;
            console.log(res.data.data);
        })
      },
      closeModal (data) {
        this.$nextTick(() => {
          this.$emit('on-close', 'close');
          this.addCustomerLayerShow = false;
        });
      }
    },
    //调用axios获取页面初始化所需的数据
    created () {
      this.fetchData();
    }

  }
</script>
