<!--财务组件-收支流水：收支流水组件
/**
* 收支流水：收支流水组件
* @/components/finance/incomeTurnover.vue 组件存放位置
* @author web-高鹏
* @date 2018年8月6日
**/
-->
<template>
    <div>
      <div class="income-header d-flex-level">
        <ul class='header-info'>
            <li>
                <p>已匹配（{{matchInfo.matchedCount || 0}}笔）</p>
                <p class="f24">{{matchInfo.matchedAmount}}</p>
            </li>
            <li>
                <p>部分匹配（{{matchInfo.matchedPartCount || 0}}笔）</p>
                <p class="f24">{{matchInfo.matchedPartAmount}}</p>
            </li>
            <li>
                <p>未匹配（{{matchInfo.unMatchedCount || 0}}笔）</p>
                <p class="f24">{{matchInfo.unMatchedAmount}}</p>
            </li>
        </ul>
        <el-row class="d-inline">
          <el-col :span="24" class="al">
              <el-button v-if="authorityBtn.includes('asystem_finance_1008')" icon='el-icon-plus' size='medium' @click='addIncome' >添加</el-button>
              <el-button v-if="authorityBtn.includes('asystem_finance_1009')" size='medium' type="danger" @click='allDel' >批量删除</el-button> 
              <el-upload v-if="authorityBtn.includes('asystem_finance_1011')" 
                  class='ml10 d-inline'
                  :action="baseURL.seeFinanceService+'/fincomerecord/import'"
                  :headers="headers"
                  :show-file-list='false'
                  :on-success='upLoadSuccess'
                  :on-error='upLoadError'>
                  <el-button size="medium" >导入表格</el-button>
              </el-upload>
              <el-button v-if="authorityBtn.includes('asystem_finance_1010')" size='medium' class='ml10'>
                <a :href="baseURL.ossUrl+'/a_tenement/template/RunningAccountTemplate.xlsx'" target="_blank">下载模板</a>
              </el-button>
              <el-button v-if="authorityBtn.includes('asystem_finance_1007')" size='medium' @click='exportFinance'>导出表格</el-button>
              <!-- 筛选 -->
              <income-filter @submit="$refs.incomeTable.reload(1)" :params="queryForm"></income-filter>
          </el-col>
        </el-row>
      </div>
      <el-alert class='mt10 mb10 d-text-blue' style='backgroundColor:#E6F7FF;border:1px solid #189eff' :title="`已勾选${choiceSelection.length}项`" type="success" :closable="false">
      </el-alert>
      <!-- 表格 -->
      <d-table 
      style="height:calc(100vh - 269px)"
      api="seeFinanceService.getFinanceTableList"
      :params="queryForm"
      @row-click='viewIncome'
      ref="incomeTable" 
      @selection-change='selectionChange'>
          <el-table-column type="selection" width="50">
          </el-table-column>

          <el-table-column label="流水号" width="220" align='center' prop="incomeWaterCode">
              <template slot-scope="scope">
                  <p class="d-text-blue d-pointer">{{scope.row.incomeWaterCode}}</p>
              </template>
          </el-table-column>

          <el-table-column prop="accountName" label="对方名称" align='center' width="120">
          </el-table-column>

          <el-table-column prop="accountDate" label="入账日期" align='center'>
              <template slot-scope="scope">
                  {{scope.row.accountDate | timeToStr}}
              </template>
          </el-table-column>

          <el-table-column prop="incomeType" label="收支状态" align='center' width='120' :formatter="formatState">
          </el-table-column>

          <el-table-column prop="feeType" label="费用类型" align='center' min-width='120' show-overflow-tooltip>
          </el-table-column>

          <el-table-column sortable='custom' prop="payCosts" label="发生金额" align='center'>
          </el-table-column>

          <el-table-column sortable='custom' prop="matchedAmount" label="已匹配金额" align='center'>
          </el-table-column>

          <el-table-column sortable='custom' prop="unmatchAmount" label="未匹配金额" align='center'>
          </el-table-column>

          <el-table-column sortable='custom' prop="serialNumber" label="流水凭证号" align='center'>
          </el-table-column>

          <el-table-column prop="matchState" label="匹配状态" align='center' :formatter='formatMatchingState'>
          </el-table-column>

          <el-table-column label="操作" align='center' width='80'>
              <template slot-scope="scope">
                  <el-button v-if="authorityBtn.includes('asystem_finance_1012')" size="mini" type="danger" :disabled='scope.row.matchState== "未匹配" ? true:false' @click.stop="handleDelete(scope.row)">删除</el-button>
              </template>
          </el-table-column>
      </d-table>
        <!--流水 新增 / 详情 弹出 -->
        <side-popup :visible.sync='popupMeta.visible ' :title='popupMeta.title' width='800px'>
            <components :is="popupMeta.component" :dialogInfo='popupMeta' v-if="popupMeta.visible" @submit="tableReload"></components>
        </side-popup>
    </div>
</template>
<script>
import incomeAdd from "./income-add"; //新增流水组件
import incomeFilter from "./income-filter"; //流水筛选组件
import incomeInfo from "./income-info"; //流水详情组件

let baseURL = window.g.ApiUrl;
export default {
  components: {
    incomeAdd,
    incomeInfo,
    incomeFilter
  },
  data() {
    return {
      baseURL: baseURL,
      popupMeta:{
        visible:false,
        title:'', //侧边弹出title
        billId:'', //账单id
        component:'', //组件
      },
      // 匹配详情
      matchInfo:{
        matchedCount:0,
        matchedAmount:0,
        matchedPartCount:0,
        matchedPartAmount:0,
        unMatchedCount:0,
        unMatchedAmount:0,
      }, //匹配内容
      choiceSelection: [], //选中数据
      allDelId: [], //批量删除id
      queryForm: {
        //筛选表单
        limit:20,
        page:1,
        incomeWaterCode: "", //流水号
        accountName: "", //对方名称
        feeType: "", //费用类型
        incomeTypes: [], //收支状态
        matchStates: [], //匹配状态
        accountBeginDate: "", //入账开始日期
        accountEndDate: "", //入账结束日期
        accountDateArry: [] //日期数组
      },
      authorityBtn: this.$local.fetch("authorityBtn").asystem_finance || [],
    };
  },
  created() {
    // 查看收支流水统计
    this.getFinanceStat();
  },
  computed: {
    headers() {
      return { token: localStorage.token, finger: localStorage.finger };
    }
  },
  methods: {
    exportFinance() {
      let exportId = this.choiceSelection.map(item=>{
        return item.id
      })
      if (exportId.length) {
        var allDelIdStr = "";
        for (var i in exportId) {
          allDelIdStr += "&ids=" + exportId[i];
        }
      } else {
        allDelIdStr = "&ids=";
      }
      let formParams = {
        token:localStorage.token,
        finger:localStorage.finger,
        limit:20,
        page:this.queryForm.page
        }
      let params = ''
      for(let key in formParams){
        params += `&${key}=${formParams[key]}`
      }
      window.location.href =
        baseURL.seeFinanceService + "/fincomerecord/export?" + params+allDelIdStr;
    },
    //成功上传
    upLoadSuccess() {
      this.$message({ type: "success", message: "上传成功" });
      // 刷新流水统计
      this.getFinanceStat();
      // 刷新列表
      this.tableReload()
    },
    upLoadError() {
      //上传失败
      this.$message.error("上传失败");
    },
    // 查看收支流水状态
    getFinanceStat() {
      //请求流水统计接口
      this.$api.seeFinanceService.getFinanceStat()
      .then(res => {
          //请求正常
          this.matchInfo = res.data || {}
      });
    },
    // 新增流水
    addIncome() {
      this.popupMeta.visible = true
      this.popupMeta.title = '新增流水'
      this.popupMeta.component = 'incomeAdd'
    },
    viewIncome(row) {
      //流水详细信息
      this.popupMeta.visible = true
      this.popupMeta.title = '流水信息'
      this.popupMeta.component = 'incomeInfo'
      this.popupMeta.id = row.id;
      //开启弹窗
      this.viewIncomeFlag = true;
    },
    formatState(row, column) {
      //收支状态转换
      if (row.incomeType == 0) {
        return "收入";
      } else if (row.incomeType == 1) {
        return "支出";
      }
    },
    formatMatchingState(row, column) {
      //匹配状态转换
      if (row.matchState == 0) {
        return "未匹配";
      } else if (row.matchState == 1) {
        return "部分匹配";
      } else if (row.matchState == 2) {
        return "全部匹配";
      }
    },
    //重新加载表格和统计数据
    tableReload() {
      this.getFinanceStat()
      this.$refs.incomeTable.reload()
    },
    //删除
    handleDelete(row) {
      if (row.matchState != 0) {
        this.$message.error("该项不能删除!");
      } else {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: true
        })
          .then(() => {
            //发送请求
            let ids = { ids: [row.id] };
            this.$api.seeFinanceService.deleateItem(ids).then(res => {
                this.tableReload()
            });
          })
          .catch(() => {});
      }
    },
    addPictureUrl(data) {
      //导入流水
      let file = { file: data.url };
      this.$api.seeFinanceService.inFinance(file)
      .then(res => {
        //console.log(res);
      });
    },
    selectionChange(val) {
      this.allDelId = [];
      this.choiceSelection = val;
    },
    allDel() {
      //批量删除
      let isDelFlagArr = [];

      if (this.choiceSelection.length == 0) {
        this.$message.error("请选择需要删除的选项!");
      } else {
        for (let i in this.choiceSelection) {
          isDelFlagArr.push(this.choiceSelection[i].matchState);
          this.allDelId.push(this.choiceSelection[i].id);
        }
        if (isDelFlagArr.indexOf(1) == -1 && isDelFlagArr.indexOf(2) == -1) {
          this.$confirm("此操作将永久删除, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          })
            .then(() => {
              let ids = { ids: this.allDelId };
              //请求接口
              this.$api.seeFinanceService.deleateItem(ids).then(res => {
                if (res.code == 200) {
                  //this.$message({ type: "success", message: res.msg });
                  this.tableReload()
                  this.allDelId = [];
                  this.choiceSelection = [];
                }
              });
            })
            .catch(() => {});
        } else {
          this.$message.error("请勿勾选不能删除的选项!");
        }
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.income-header {border: 1px solid #efefef;border-radius: 5px;}
.income-header .header-info{display: inline-block;overflow: hidden;}
.income-header .header-info li{display: inline-block;padding: 5px 15px;line-height: 24px; color: #666;border-right: 1px solid #efefef;}
</style>
