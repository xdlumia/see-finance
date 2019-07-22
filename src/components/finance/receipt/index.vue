<!--财务组件：收据管理
/**
* 财务组件：财务主页
* @/components/finance/receipt 组件存放位置
* @author web-高鹏
* @date 2018年8月6日
**/
-->
<template>
    <div class="d-relative">
        <!-- 责任人设置 -->
        <dutySetting
            v-if="authorityButtons.includes('asystem_finance_res_1005')"
            title="分配财务-收据记录责任人" 
            parent="收据记录" size="16" 
            class="d-absolute"
            style="right: 10px;top: -47px;"
            :syscode="syscode" 
            color="#666"
            pageCode="asystem_finance_1014"
            module="finance"
        ></dutySetting>
        <!-- 表格 -->
        <d-table
            style="height:calc(100vh - 150px)"
            :params="{limit:15,page:1,systemCode:syscode}"
            ref="table"
            api="seeFinanceService.getFreceiptList"
            size="small">
            <el-table-column
            align='center'
            label="收据编号"
            prop='receiptNum'>
                <template slot-scope="scope">
                    <p class="d-text-blue d-pointer" @click='viewReceiptInfo(scope.row)'>{{scope.row.receiptNum}}</p>
                </template>
            </el-table-column>
            <el-table-column
            align='center'
            prop="communityName"
            label="楼宇名称">
            </el-table-column>
            <el-table-column
            align='center'
            prop="payCompany"
            label="交款单位">
            <template slot-scope="scope">
                <el-popover
                    placement="top-start"
                    trigger="hover"
                    :content="scope.row.payCompany">
                    <div class="d-elip" slot="reference">{{scope.row.payCompany}}</div>
                </el-popover>
            </template>
            </el-table-column>
            <el-table-column
            align='center'
            label="开据时间"
            width="110">
            <template slot-scope="scope">
                <p>{{scope.row.issueTime | timeToStr}}</p>
            </template>
            </el-table-column>
            <el-table-column
            align='center'
            prop="payerName"
            label="交款人"
            width="130">
            </el-table-column>
            <el-table-column
            align='center'
            prop="money"
            label="金额"
            width="130">
            </el-table-column>
            <el-table-column
            align='center'
            prop="takerName"
            label="收款人"
            width="110" >
            </el-table-column>
            <el-table-column
            align='center'
            label="状态"
            width="120">
                <template slot-scope="scope" >
                    {{receiptStatus[scope.row.status]}}
                </template>
            </el-table-column> 
            <el-table-column prop="notes" label="备注" align='center' width='180px'>
            </el-table-column>
        </d-table>
        <!-- 发票详情弹出框
        @submit  刷新列表 -->
        <receipt-info :popupInfo="popupInfo" @submit="tableReload"></receipt-info>
    </div>
</template>
<script>
import receiptInfo from "./receipt-info"; //筛选组件
let baseURL = window.g.ApiUrl;
export default {
  // components
  components: {
    receiptInfo
  },
  // props
  // data
  data() {
    return {
      syscode:this.$local.fetch("userInfo").syscode, //系统编码
      authorityBtn: this.$local.fetch("authorityBtn").asystem_finance || [],
      receiptStatus:{
          0:'未开具',
          1:'已开具',
          2:'回收审核中',
          3:'已回收',
          4:'作废审核中',
          5:'已作废',
          6:'作废未通过',
      },
      // popup弹出框
      popupInfo:{
        title:'', //弹出框标题
        visible:false,//是否显示
        status:'', //收据开具状态
        component:'',//组件
        id:'',//主键id
        data:'',// 传递的json数据
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
    // 表格数据刷新
    tableReload(){
        this.$refs.table.reload()
    },
    //账单详情
    viewReceiptInfo(item) {
      this.popupInfo={
        title:"收据详情", //弹出框标题
        visible:true,//是否显示
        status:item.status,
        id:item.id,
        data:item,
        communityId:item.communityId
      }
    }
  },
  // filter
  // computed
  watch: {
  }
};
</script>
<style scoped>
    /deep/ .el-table:before{
        background: transparent;
    }
    /deep/ .el-pagination{
        border-top: 1px solid #e5e5e5;
    }
    .handle-filter{ position:absolute; right: 5px; top:0px}
</style>

