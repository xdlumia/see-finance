<!--财务组件：财务管理-发票记录
/**
* 财务组件：财务管理-发票记录
* @/components/finance/invoice/index.vue 组件存放位置
* @author web-王晓冬
* @date 2018年10月19日
**/
-->
<template>
  <div class="d-relative">
      <!-- 责任人设置 -->
      <dutySetting
          v-if="authorityButtons.includes('asystem_finance_res_1004')"
          title="分配财务-发票记录责任人" 
          parent="发票记录" size="16" 
          class="d-absolute"
          style="right: 10px;top: -47px;"
          :syscode="syscode" 
          color="#666"
          pageCode="asystem_finance_1013"
          module="finance"
      ></dutySetting>
      <!-- 表格 -->
      <d-table
          style="height:calc(100vh - 150px)"
          ref="table"
          api="seeFinanceService.getFinvoiceList"
          :params="queryForm"
          size="small">
          <el-table-column
          align='center'
          label="发票号码"
          min-width="180">
              <template slot-scope="scope">
                  <p class="d-text-blue d-pointer" @click='viewInvoiceInfo(scope.row)'>{{scope.row.invoiceNo}}</p>
              </template>
          </el-table-column>
          <el-table-column
          align='center'
          label="开票时间"
          min-width='140'>
          <template slot-scope="scope">
              {{scope.row.issueTime | timeToStr}}
          </template>
          </el-table-column>
          <el-table-column
          align='center'
          prop="buyerName"
          label="购方名称"
          show-overflow-tooltip
          min-width="120">
          </el-table-column>
          <el-table-column
          show-overflow-tooltip
          align='center'
          prop="goodsName"
          label="货物名称"
          min-width="130">
          </el-table-column>
          <el-table-column
          align='center'
          prop="invoiceCode"
          label="类型"
          width="130">
          <template slot-scope="scope">
            {{scope.row.invoiceCode | dictionary('ZD_FP_LX')}}
          </template>
          </el-table-column>
          <el-table-column
          prop="invoiceNum"
          align='center'
          label="发票代码"
          width="130">
          </el-table-column>
          <el-table-column
          align='center'
          prop="money"
          label="开票金额"
          width="110" >
          </el-table-column>
          <el-table-column
          align='center'
          prop="tax"
          label="税额"
          width="110" >
          </el-table-column>
          <el-table-column
          align='center'
          prop="rate"
          label="税率(%)"
          width="90">
          </el-table-column>
          <el-table-column
          align='center'
          prop="invoiceSource"
          label="状态"
          width="120">
              <template slot-scope="scope" >
                  {{invoiceStatus[scope.row.status]}}
              </template>
          </el-table-column>
          <el-table-column
          prop="notes"
          label="备注"
          align='center'
          min-width='180px'>
          </el-table-column>
      </d-table>
      <!-- 发票详情弹出框
      @submit  刷新列表 -->
      <invoice-info :popupInfo="popupInfo" @submit="tableReload"></invoice-info>

  </div>
</template>
<script>
import invoiceInfo from "./invoice-info"; //筛选组件
let baseURL = window.g.ApiUrl;
export default {
  // components
  components: {
    invoiceInfo
  },
  // props
  // data
  data() {
    return {
      syscode:this.$local.fetch("userInfo").syscode, //系统编码
      // 数据权限
      authorityBtn: this.$local.fetch("authorityBtn").asystem_finance || [],
      // 发票状态
      invoiceStatus:{
          0:'未开具',
          1:'已开具',
          2:'回收审核中',
          3:'回收审核通过',
          4:'作废审核中',
          5:'作废审核通过'
      },
      // popup弹出框
      popupInfo:{
        title:'', //弹出框标题
        visible:false,//是否显示
        component:'',//组件
        id:'',//主键id
        data:'',// 传递的json数据
      },
      //筛选表单
      queryForm: {
        status: [1], //结清状态
        limit: 15,
        page: 1,
        systemCode:this.$local.fetch('userInfo').syscode
      },
    };
  },
  // created
  created() {},
  // mounted
  // activited
  // update
  // beforeRouteUpdate
  // metods
  methods: {
    //查看账单详情
    viewInvoiceInfo(item) {
      this.popupInfo={
        title:"发票详情", //弹出框标题
        visible:true,//是否显示
        id:item.id,
        data:item
      }
    },
    // 表格数据刷新
    tableReload(){
        this.$refs.table.reload()
    },
    //账单类型判断
    invoiceState(row) {
      if (row.invoiceType == 0) {
        return "收款";
      } else if (row.invoiceType == 1) {
        return "付款";
      }
    },
  },
  // filter
  // computed
  watch: {
  }
};
</script>
<style scoped>
    .handle-filter{ position:absolute; right: 5px; top:0px}
</style>

