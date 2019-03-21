<!--账单管理 账单详情-账单调整
/**
* 账单管理详情 账单调整
* @/components/finance/bill 组件存放位置
* @author web-王晓冬
* @date 2018年11月2日
**/
-->
<template>
    <!-- 表单 -->
    <el-form v-loading="loading" :model="billChangeForm" :rules="billChangeRules" ref="billChangeForm" label-width="100px">
        <el-row>
        <el-col :span='24'>
        <el-form-item label="调整金额" prop="adjustAmount" :rules="{required:true,type:'price'}" >
            <el-input type="text" style='width:85%' v-model.trim="billChangeForm.adjustAmount" placeholder="请输入金额" size='small'></el-input>
        </el-form-item>
        </el-col>
        <el-col :span='24'>
        <el-form-item label="调整类型" prop="adjustType" >
            <d-select
                style='width:85%'
                v-model="billChangeForm.adjustType"
                valueKey="code"
                placeholder="请选择调整类型"
                size="small"
                dicCode='ZD_TZ_LX'>
            </d-select>
        </el-form-item>
        </el-col>
        <el-col :span='24'>
        <el-form-item label="调整时间"  >
            <el-date-picker
            style='width:85%'
            size='small'
            v-model="billChangeForm.adjustDate"
            type="datetime"
            value-format='timestamp'
            placeholder="请选择日期时间"
            >
            </el-date-picker>
        </el-form-item>
        </el-col>
        <el-col :span='24'>
        <el-form-item label="备注" prop="desc">
            <el-input type="text" v-model.trim="billChangeForm.notes" size='small' placeholder="请填写备注" style='width:85%'></el-input>
        </el-form-item>
        </el-col>
        <el-col :span='24' class='ac'>
            <el-button type="primary" @click="submitBillForm('billChangeForm')" size='small' >提交</el-button>
            <el-button @click="resetBillForm('billChangeForm')" size='small'>取消</el-button>
        </el-col>
        </el-row>
    </el-form>
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
        billChangeForm:{//调整金额表单
                adjustBeforAmount:this.dialogInfo.adjustBeforAmount,// 调整之前的金额
                adjustAmount:'',//调整金额
                adjustType:'',//调整类型
                adjustDate:'',//调整时间
                notes:'',//调整备注
                billId:this.dialogInfo.billId,
            },
        billChangeRules:{//调整金额表单验证
            adjustAmount: [
                { required: true, message: '请输入调整金额', trigger: 'blur' },
                { min:1, max:8,message: '金额不能大于千万', trigger: 'blur' },
            ],
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
    // 账单调账取消
    resetBillForm(formName){//取消
        this.$refs[formName].resetFields();
        //关闭弹出框
        this.dialogInfo.visible=false
    },
    //筛选提交
    submitBillForm(formName){//账单调整保存
        this.$refs[formName].validate((valid) => {
            if (valid) {//通过验证
                this.loading = true
                //发送请求保存
                this.$api.seeFinanceService.saveBillChangeInfo(this.billChangeForm)
                .then(res=>{
                    if(res.code==200){//保存成功
                        //刷新页面
                        this.$emit("submit", "billTable");
                        //清空表单
                        this.$refs[formName].resetFields();
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

