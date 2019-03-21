<!--账单管理 添加收据
/**
* 账单管理详情收支流水新增
* @/components/finance/bill 组件存放位置
* @author web-王晓冬
* @date 2018年11月2日
**/
-->
<template>
<div v-loading="loading">
    <!-- 表单 -->
    <el-form class="d-auto-y pr20" style="max-height: calc(100vh - 150px)" :model="receiptForm" ref="receiptForm" label-width="80px">
        <form-card title="收据信息">
            <el-row :gutter="20">
                <el-col :span='12'>
                    <el-form-item label="收据编号" prop="receiptNum" :rules="{required:true,message:'请输入收据编号'}">
                        <el-input type="text" v-model.trim="receiptForm.receiptNum" maxlength="32" placeholder="请输入收据编号" size='small'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="开具时间" prop="issueTime" :rules="{required:true,message:'请输入开具时间'}">
                        <el-date-picker
                        size='small'
                        v-model="receiptForm.issueTime"
                        type="datetime"
                        value-format='timestamp'
                        placeholder="请选择开据时间">
                        </el-date-picker>
                    </el-form-item>
                </el-col>

            </el-row>
        </form-card>
        <form-card title="交款方">
            <el-row :gutter="20">
                <el-col :span='12'>
                    <el-form-item label="交款单位" prop="payCompany" :rules="{required:true,message:'请输入交款单位'}">
                        <el-input type="text" v-model="receiptForm.payCompany" maxlength="32" placeholder="请输入交款单位" size='small'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="交款人" prop="payerName" :rules="[{required:true,message:'请输入交款人'},{type:'name'}]">
                        <el-input type="text" v-model.trim="receiptForm.payerName" maxlength="32" placeholder="请输入交款人" size='small'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="汇款方式" prop="payWar" :rules="{required:true, message:'请选择汇款方式'}">
                        <d-select v-model="receiptForm.payWar" placeholder="选择汇款方式" dicCode="FM_FUKUAN_FS"></d-select>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="联系方式" prop="payMobile" :rules="{required:true,min:7,max:20, message:'请输入正确的联系方式'}">
                        <el-input type="text" v-model.trim="receiptForm.payMobile" maxlength="32" placeholder="请输入联系方式" size='small'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="联系地址" prop="payAddress" :rules="{required:true,message:'请输入联系地址'}">
                        <el-input type="text" v-model.trim="receiptForm.payAddress" maxlength="40" placeholder="请输入联系地址" size='small'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </form-card>
        <form-card title="收款方">
            <el-row :gutter="20">
                <el-col :span='12'>
                    <el-form-item label="收款单位" prop="takerCompany" :rules="{required:true,message:'请输入交款单位'}">
                        <el-input type="text" v-model.trim="receiptForm.takerCompany" maxlength="32" placeholder="请输入交款单位" size='small'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="收款人" prop="takerName" :rules="[{required:true,message:'请输入收款人'},{type:'name'}]">
                        <el-input type="text" v-model.trim="receiptForm.takerName" maxlength="32" placeholder="请输入收款人" size='small'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="联系方式" prop="takerWar"  :rules="{required:true,min:7,max:20, message:'请输入正确的联系方式'}">
                        <el-input type="text" v-model.trim="receiptForm.takerWar" maxlength="32" placeholder="请输入联系方式" size='small'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="联系地址" prop="takerAddress" :rules="{required:true,message:'请输入联系地址'}">
                        <el-input type="text" v-model.trim="receiptForm.takerAddress" maxlength="40" placeholder="请输入联系地址" size='small'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </form-card>
        <form-card title="款项明细">
            <el-row :gutter="20">
                <el-col :span='12'>
                    <el-form-item label="费用类型" prop="feeType" :rules="{required:true, message:'请选择费用方式'}">
                        <d-select v-model="receiptForm.feeType" placeholder="请选择费用类型" dicCode="ZD_FY_LX"></d-select>
                        <!-- <el-input type="text" v-model="receiptForm.feeType" maxlength="32" placeholder="请输入费用类型" size='small'></el-input> -->
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="单价" prop="unitPrice" :rules="[{required:true,message:'请输入单价'},{type:'price'}]">
                        <el-input type="text" v-model.trim="receiptForm.unitPrice" @input="amountCount" maxlength="32" placeholder="请输入单价" size='small'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="数量" prop="amount" :rules="[{required:true, message:'请输入数量'},{type:'positiveNum', message:'请输入正整数'}]">
                        <el-input type="text" v-model.trim="receiptForm.amount" @input="amountCount"  maxlength="32" placeholder="请输入数量" size='small'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='12'>
                    <el-form-item label="金额" prop="money" :rules="[{required:true,message:'金额=数量*单价'},{type:'price'}]">
                        <el-input type="text" disabled v-model.trim="receiptForm.money" maxlength="32" placeholder="金额=数量*单价" size='small'></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span='24'>
                    <el-form-item label="备注" prop="notes" >
                        <el-input type="textarea" v-model.trim="receiptForm.notes" maxlength="140" placeholder="请输入备注(140)" size='small'></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </form-card>
    </el-form>
    <div slot="footer" class="mt10 ac">
        收据模板:
        <el-select v-model="receiptForm.templateId" value-key="id" size="small" placeholder="请选择">
            <el-option v-for="(item,index) of receiptOptions" :key="index" :label="item.name" :value="item.id">
            </el-option>
        </el-select>
        <el-button size="small" @click="submitForm('viewFreceipt')" class="mr30">预览</el-button>
        <el-button size="small" type="primary" @click="submitForm('saveFreceipt')">保存</el-button>
        <el-button size="small" type="primary" @click="submitForm('printFreceipt')">打印</el-button>
        <el-button size="small" @click="dialogInfo.visible = false">取 消</el-button>
    </div>
     <!-- 合同预览 -->
    <contract-preview :visible.sync="viewTemplateVisible" :templateData="receiptTemplate"></contract-preview>
</div>
</template>
<script>
import contractPreview from "@/views/asistant/templateManage/contract-preview"; // 合同预览信息
export default {
  // components
  components: {
      contractPreview
  },
  props: ["dialogInfo"],
  // data
  data() {
    return {
        loading:false,
        receiptForm:{
            amount: '', // 9,
            fbillId: this.dialogInfo.billId,
            feeType: '', // 9,
            id: '', // 100000,
            issueTime: '', // 1539929678377,
            money: '', // 98765432109876.12,
            notes: '', // 示例：备注,
            payAddress: '', // 示例：付款人联系地址,
            payCompany: '', // 示例：付款单位,
            payMobile: '', // 示例：付款人联系方式（手机号）,
            payWar: '', // 示例：付款方式,
            payerName: '', // 示例：付款人,
            receiptNum: '', // 示例：收据编号,
            status: '', // 0,
            takerAddress: '', // 示例：收款人联系地址,
            takerCompany: '', // 示例：收款单位,
            takerName: '', // 示例：收款人,
            takerWar: '', // 示例：收款人联系方式（手机号）,
            templateId: '', // 模板id,
            unitPrice: '', // 98765432109876.12
        },
        receiptOptions:[], //合同模板列表
        viewTemplateVisible:false,
        // 合同预览
        receiptTemplate: {
            name: "",
            context: ""
        },
    };
  },
  // created
  created() {
    //   获取收据模板
      this.getTemplateList(5)
  },
  // mounted
  // activited
  // update
  // beforeRouteUpdate
  // metods
  methods: {
    // 账单调账取消
    resetBillForm(formName){//取消
        this.$refs[formName].resetFields();
        //关闭弹出框
        this.dialogInfo.visible=false
    },
    // 计算 款项明细 金额 = 单价*数量
    amountCount(){
        this.receiptForm.money = this.receiptForm.unitPrice * this.receiptForm.amount
    },

    //收据保存 / 预览 /打印
    submitForm(type){
        this.$refs.receiptForm.validate((valid) => {
            if (valid) {//通过验证
                // 校验是否选择模板[预览、保存、打印均需要模板]
                if(!this.receiptForm.templateId){
                    this.$message.error("请选择收据模板");
                    return;
                }
                this.loading = true
                //发送请求保存
                this.$api.seeFinanceService[type](this.receiptForm)
                .then(res=>{
                    if(type=="viewFreceipt"){
                        // 如果是预览
                        this.receiptTemplate.context = res.data || "";
                        this.viewTemplateVisible = true;
                    }else if(type == "printFreceipt"){
                        //刷新页面
                        this.$emit("submit", "receiptRecordTable", "printFreceipt");
                        //关闭弹出框
                        this.dialogInfo.visible = false
                        window.open(res.data)
                    }else if(type == "saveFreceipt"){
                        //刷新页面
                        this.$emit("submit", "receiptRecordTable", "saveFreceipt");
                        //清空表单
                        this.$refs.receiptForm.resetFields();
                        //关闭弹出框
                        this.dialogInfo.visible = false
                    }
                })
                .finally(()=>{
                    this.loading = false
                })
            }
        });

    },
     // 获取收据模板
    getTemplateList: function(params) {
      this.$api.seeContractService.getTemplateList(params).then(res => {
        if (res.code == 200) {
          this.receiptOptions = res.data || [];
        }
      });
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

