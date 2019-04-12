<!--账单管理
/**
* 账单管理详情收支流水匹配
* @/components/finance/bill 组件存放位置
* @author web-王晓冬
* @date 2018年11月2日
**/
-->
<template>
<div>
    <!-- 表单 -->
    <p class='ba h50 mt15 br5'>
        <span class="fl pl10 pr10" style='line-height:50px'>流水匹配</span>
            <!-- 筛选对话框 -->
        <el-popover
            class='fr mt10'
            placement="bottom-end"
            width="300"
            v-model="matchIncomeFilter"
            trigger="click">
            <el-form :model="matchFilterForm" ref="matchFilterForm" label-width="100px"  >
                <el-row>
                <div class='ar mt10 d-text-blue d-pointer' @click="resetFilter()">清空筛选</div>
                <el-col :span='24'>
                <el-form-item label="对方名称"  class='mb5' prop='accountName'>
                    <el-input type="text" v-model.trim="matchFilterForm.accountName" size='mini' placeholder="请输入名称" ></el-input>
                </el-form-item>
                </el-col>
                <el-col :span='24'>
                <el-form-item label="收支状态" style='width:100%' size='mini'  class='mb5' prop='incomeType'>
                    <el-select v-model="matchFilterForm.incomeType" placeholder="请选择收支状态"  style='width:100%' @change='incomeTypeChange'>
                        <el-option label="收入" value="0"></el-option>
                        <el-option label="支出" value="1"></el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span='24'>
                <el-form-item label="匹配状态" style='width:100%' size='mini'  class='mb5' prop='matchStates'>
                    <el-checkbox-group v-model="matchFilterForm.matchStates" placeholder="请选择匹配状态"  style='width:100%'>
                        <el-checkbox :label="0" :value="0">未匹配</el-checkbox>
                        <el-checkbox :label="1" :value="1">部分匹配</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                </el-col>
                <el-col :span='24'>
                <el-form-item label="入账日期"  size='mini' class='mb5' prop='accountDate'>
                    <el-date-picker
                    style='width:100%'
                    v-model="matchFilterForm.accountDate"
                    type="date"
                    value-format='timestamp'
                    placeholder="请选择入账日期"
                    align="right">
                    </el-date-picker>

                </el-form-item>
                </el-col>
                <el-col :span='24' class='ac'>
                    <el-button type="primary" @click="filterMactchTable('mactchTable')" size='mini' >确定</el-button>
                    <el-button @click="matchIncomeFilter = false" size='mini'  >取消</el-button>
                </el-col>
                </el-row>
            </el-form>
                <el-button size="small" type="text" slot="reference"><i class="iconfont icon-filter mr20" ></i></el-button>
        </el-popover>
    </p>
    <d-table
        border
        size='mini'
        style="height:calc(100vh - 260px)"
        api="seeFinanceService.getFinanceTableList"
        :params="matchFilterForm"
        ref="matchTable"
        @row-click="rowClick">
        <el-table-column width="60" label='请选择' align='center'>
            <template slot-scope="scope">
                <el-radio :label='scope.row.id' v-model="rowChoose">&nbsp;</el-radio>
            </template>
        </el-table-column>
        <el-table-column
        prop="accountDate"
        width="110"
        label="入账日期"
        align='center'>
        <template slot-scope="scope">
            {{scope.row.accountDate | timeToStr}}
            </template>
        </el-table-column>
        <el-table-column
        prop="incomeType"
        label="收支状态"
        align='center'
        width='80'>
        <template slot-scope="scope">
            {{scope.row.incomeType==1?'支出':'收入'}}
            </template>
        </el-table-column>
        <el-table-column
        prop="accountName"
        label="对方名称"
        align='center'
        width="120">
        </el-table-column>
        <el-table-column property="transferNotes" label="备注" align='center'></el-table-column>
        <el-table-column
        sortable
        prop="payCosts"
        label="发生金额"
        width="100px"
        align='center'>
        </el-table-column>
        <el-table-column
        sortable
        prop="matchedAmount"
        label="已匹配金额"
        width="110px"
        align='center'>
        </el-table-column>
        <el-table-column
        sortable
        width="110px"
        prop="unmatchAmount"
        label="未匹配金额"
        align='center'>
        </el-table-column>
        <el-table-column
        label="匹配状态"
        align='center'
        width='80' >
        <template slot-scope='scope'>
            <span v-if="scope.row.matchState==0" class='d-text-blue'>未匹配</span>
            <span v-else-if="scope.row.matchState==1" class='d-text-red'>部分匹配</span>
            <span v-else-if="scope.row.matchState==2" class='d-text-gray'>全部匹配</span>
        </template>
        </el-table-column>
    </d-table>
    <div class="ac">
        <el-button size='small'  @click='dialogInfo.visible = false'>取消</el-button>
    </div>

    <el-dialog title="流水匹配" :visible.sync="matchIncomeVisible" width='400px' :append-to-body = "true">
        <el-form v-loading="loading" :model="matchMoneyForm" size='mini' ref="matchMoneyForm" label-width="100px"  >
            <el-form-item label="匹配金额：" :rules="[{type:'price', trigger: 'blur'}]" prop='matchAmount'>
                <el-input  v-model='matchMoneyForm.matchAmount' placeholder="请输入金额"></el-input>
            </el-form-item>
            <el-form-item label="账单需付：">
                <p>{{dialogInfo.billPayingAmount}}</p>
            </el-form-item>
            <el-form-item label="流水未匹配">
                <p>{{ matchMoneyForm.incomeUnmatchingAmount}}</p>
            </el-form-item>
        </el-form>
        <div class='ac mt10'>
            <el-button type="primary" size='small'  @click='saveMatchIncome'>匹配</el-button>
            <el-button size='small'  @click='matchIncomeVisible = false'>取消</el-button>
        </div>
    </el-dialog>
</div>
</template>
<script>
export default {
  // components
  components: {},
  props: ["dialogInfo"],
  // data
  data() {
    return {
        loading:false,
        matchIncomeVisible:false,
        // 当前选中行
        rowChoose:'',
        // 筛选是否显示
        matchIncomeFilter: false,
        financeUnMatchMoney:'',
        //匹配筛选表单
        matchFilterForm: {
            matchStates:[0,1],//匹配状态
            incomeTypes:[this.dialogInfo.billType],//流水类型
            incomeType: this.dialogInfo.billType.toString(),
            page:1,//显示第几页
            limit:10,//每页显示数量
            incomeWaterCode:'',//流水号
            accountName:'',//对方名称
            feeType:'',//费用类型
            accountBeginDate:'',//入账开始日期
            accountEndDate:'',//入账结束日期
            serialNumber:'',//凭证流水号
            sidx:'',//排序字段
            order:'',//排序规则
        },
        matchMoneyForm:{
            amount:this.dialogInfo.data.amount,//数量
            billPayingAmount:this.dialogInfo.billPayingAmount,//账单需付
            incomeUnmatchingAmount:'',//流水未匹配
            billType:this.dialogInfo.billType, //账单类型
            matchAmount:'',//匹配金额
            billId:this.dialogInfo.billId,//账单id
            incomeRecordId:'',//流水id
            feeType:''
        }
    };
  },
  // created
  created() {
    //   console.log(this.dialogInfo)
  },
  // mounted
  // activited
  // update
  // beforeRouteUpdate
  // metods
  methods: {
      // 类型选择
    incomeTypeChange(val){
        this.matchFilterForm.incomeTypes = [val]
    },
    //  筛选
    filterMactchTable(){
        this.$refs.matchTable.reload()
    },
    // 选中当前行
    rowClick(item){
        this.matchIncomeVisible = true
        this.rowChoose = item.id
        this.matchMoneyForm.matchAmount = '' //清空匹配金额
        this.matchMoneyForm.incomeUnmatchingAmount =item.unmatchAmount,//流水未匹配
        this.matchMoneyForm.incomeRecordId = item.id,//流水id
        this.matchMoneyForm.feeType = item.feeType
    },
    // 重置表单数据
    resetFilter(){
        this.$refs.matchFilterForm.resetFields()
    },
    //流水保存
    saveMatchIncome(){//匹配请求
            this.loading = true
            this.$api.seeFinanceService.saveMatchItem(this.matchMoneyForm).then(res=>{
                //console.log(res)
                if(res.code==200){
                    this.matchIncomeVisible=false
                    this.dialogInfo.visible = false
                    this.$emit("submit", "incomeTable",'saveMatch');
                }
            })
            .finally(()=>{
                this.loading = false
            })
        },
  },
  // filter
  // computed
  watch: {}
};
</script>
<style scoped>
.handle-filter {
  position: absolute;
  right: 5px;
  top: 0px;
}
</style>

