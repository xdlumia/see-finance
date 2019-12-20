<!--财务组件-财务管理-新增收据(暂无使用)
/**
* 财务管理：新增收据记录
* @/components/receipt/receipt-add.vue 组件存放位置
* @author web-王晓冬
* @date 2018年10月19日
**/
-->
<template>
    <div>
        <!-- 表单 -->
        <el-form :model="newBillForm" :rules="rules" ref="newBillForm" size="small" label-width="100px" class="p10 mt15"  >
            <el-row>
            <el-col :span="12">
                <el-form-item label="账单类型" prop="billType"  size='small' >
                    <el-radio label="0" v-model="newBillForm.billType" >收款</el-radio>
                    <el-radio label="1" v-model="newBillForm.billType" >付款</el-radio>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="关联合同" prop="contractCode" size='small'>
                    <el-input placeholder="请输入姓名/合同编号" v-model.trim="newBillForm.contractCode"  @input='aginChoice' class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click='choiceContract(1)'></el-button>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="对方名称" prop="accountName">
                    <el-input type="text" v-model.trim="newBillForm.accountName" :disabled='accountNameFlag' placeholder="请输入名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="费用类型" prop="feeType"  size='small' >
                    <d-select
                        placeholder="请选择费用类型"
                        v-model="newBillForm.feeType"
                        valueKey="code"
                        size="mini"
                        dicCode='ZD_FY_LX'>
                    </d-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="账单金额" prop="amount"
                :rules="[{required:true,type:'price'}]">
                    <el-input type="text" v-model.trim="newBillForm.amount" placeholder="请输入金额"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="应收/付时间" size='small'>
                    <el-date-picker
                    style='width:100%'
                    v-model="newBillForm.payEndDate"
                    value-format='timestamp'
                    type="datetime"
                    placeholder="请选择日期时间"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="计费周期" size='small' >
                    <el-date-picker
                        clearable
                        style='width:100%'
                        v-model="newBillForm.feeDateArray"
                        value-format='timestamp'
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="备注" prop="notes" size='small'  >
                    <el-input type="textarea" v-model.trim="newBillForm.desc" placeholder="请填写备注" maxlength="300" show-word-limit></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item>
                    <el-button type="primary" @click="submitForm()" size='small' class=''>保存</el-button>
                </el-form-item>
            </el-col>
            </el-row>
        </el-form>
        <!-- 弹出合同选择对话框 -->
        <el-dialog title="选择合同" :visible.sync="dialogTableVisible" width='812px' center :append-to-body = "true">
            <d-table
                v-if="dialogTableVisible"
                ref="singleTable"
                size="mini"
                api="seeFinanceService.getChoiceContract"
                :params="contractFrom"
                @current-change="handleSelectionChange">
                <el-table-column
                label="合同编号"
                width="180"
                align='center'>
                <template slot-scope="scope">{{ scope.row.contractCode }}</template>
                </el-table-column>
                <el-table-column
                align='center'
                label="租客/业主姓名"
                width="110">
                <template  slot-scope="scope">
                    <p v-if="scope.row.sourceCode == 'HT_LYBM-0'">{{ scope.row.firstParty}}</p>
                    <p v-else>{{ scope.row.secondParty }}</p>
                </template>
                </el-table-column>
                <el-table-column
                align='center'
                label="房间地址">
                <template slot-scope="scope">
                    <el-popover
                        placement="top-start"
                        trigger="hover"
                        :content="scope.row.address">
                        <div class="d-elip" slot="reference">{{scope.row.address}}</div>
                    </el-popover>
                </template>
                </el-table-column>
                <el-table-column
                align='center'
                :formatter="formatPeopleState"
                prop='sourceCode'
                width='80'
                label="合同来源">
                    <!-- <template slot-scope="scope">
                        {{scope.row.sourceCode | dictionary('HT_LYBM')}}
                    </template> -->
                </el-table-column>
                <el-table-column
                label="到期日期"
                width="120"
                align='center'>
                <template slot-scope="scope">
                    {{scope.row.endDate | timeToStr('YYYY-MM-DD')}}
                </template>
                </el-table-column>
                <el-table-column
                prop="state"
                align='center'
                width='120'
                label="合同状态"
                :formatter="formatState">
                </el-table-column>
            </d-table>
        </el-dialog>
    </div>
</template>
<script>
export default {
    // components
    components:{},
    // props:[''],
    // data
    data(){
        return{
            accountNameFlag:false,
            newBillForm: {
                billType:'',//账单类型
                contractCode:'',//合同编号
                accountName:'',//对方名称
                feeType:'',//费用类型
                amount:'',//账单金额
                factAmount:'',//应收/付费金额
                feeDateArray:[],//计费时间数组
                feeStartDate:'',//计费开始
                feeEndDate:'',//计费结束
                notes:'',//备注
            },
            rules: {
                billType: [
                    { required: true, message: '请输入账单类型', trigger: 'blur' }
                ],
                contractCode: [
                    { required: true, message: '请选择合同', trigger: 'change' }
                ],
            },
            dialogTableVisible:false,
            // 合同请求参数
            contractFrom:{
                page:1,
                limit:10,
                matchingStr:''

            },
        }
    },
    // created
    // mounted
    // activited
    // update
    // beforeRouteUpdate
    // metods
    methods:{
        formatState(row, column) {//收支状态转换
                if(row.state == -1 ){
                    return '已签约未执行'
                }else if(row.state == 0 ){
                    return '生效中'
                }else if(row.state == 1 ){
                    return '已失效'
                }else if(row.state == 3 ){
                    return '合同作废'
                }
            },
        formatPeopleState(row, column) {//收支状态转换
            if(row.sourceCode == 'HT_LYBM-0' ){
                this.changeSourceCode='firstParty'
                return '委托合同'
            }else if(row.sourceCode == "HT_LYBM-1" ){
                this.changeSourceCode='secondParty'
                return '承租合同'
            }
        },
        // 新增表单提交
        submitForm(formName) {
            this.$refs.newBillForm.validate((valid) => {
                if (valid) {
                    this.newBillForm.feeStartDate=this.newBillForm.feeDateArray[0]
                    this.newBillForm.feeEndDate=this.newBillForm.feeDateArray[1]
                    this.newBillForm.settleStatus='0'
                    //发送请求
                    this.$api.seeFinanceService.getSaveNewBill(this.newBillForm).then(res=>{
                        if(res.code==200){
                            // 关闭侧边栏
                            this.$emit('update:visible', false)
                            // 提交刷新
                            this.$emit('submit','reload')
                        }
                    })
                }
            });
        },
        resetForm(formName) {
            this.$refs.newBillForm.resetFields();
        },
        choiceContract(val){//弹出合同选择
            //获取搜索关键字请求
            this.contractFrom.matchingStr = this.newBillForm.contractCode
            this.dialogTableVisible=true
        },
        handleSelectionChange(val) {
            if(val!=null){
                if(val.sourceCode=="HT_LYBM-0"){
                    this.newBillForm.accountName=val.firstParty
                }else if(val.sourceCode=="HT_LYBM-1"){
                    this.newBillForm.accountName=val.secondParty
                }
                this.accountNameFlag=true
                this.newBillForm.roomAddress=val.address
                this.newBillForm.contractCode=val.contractCode
                this.dialogTableVisible=false
            }
        },
        aginChoice(){
            if(this.newBillForm.contractCode==''){
               this.newBillForm.accountName=''
               this.accountNameFlag=false
            }
        },
        resetChoice(){
            this.dialogTableVisible=false
        },
    }
    // filter
    // computed
}
</script>
<style scoped>

</style>
