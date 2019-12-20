<!--收支流水组件-新增流水-：新增流水组件()
/**
* 收支流水：新增流水组件
* @/components/finance/new-furnover.vue 组件存放位置
* @author web-高鹏
* @date 2018年8月7日
**/
-->
<template>
    <div>
        <!-- 表单 -->
        <el-form v-loading="loading" :model="newIncomeForm" size="small" :rules="newIncomeRules" ref="newIncomeForm" label-width="100px" class="p10 mt15"  >
            <el-row :gutter="40">
            <el-col :span="12">
                <el-form-item label="收支状态" prop="incomeType">
                    <el-select class="wfull" v-model="newIncomeForm.incomeType" style='width:100%' size="small" placeholder="请选择收支状态">
                        <el-option label="收入" value="0"></el-option>
                        <el-option label="支出" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="发生金额" prop="payCosts">
                    <el-input maxlength="14" v-model.number="newIncomeForm.payCosts" placeholder="请输入金额"  size="small"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="对方名称" prop="accountName" >
                    <el-input type="text" v-model.trim="newIncomeForm.accountName" placeholder="请输入名称" size="small"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="收支日期" prop='accountDate'>
                    <el-date-picker
                    style='width:100%'
                    v-model="newIncomeForm.accountDate"
                    size="small"
                    type="datetime"
                    value-format='timestamp'
                    placeholder="请选择日期时间"
                    popper-class='date-time'
                    >
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="联系方式" >
                    <el-input type="text" v-model.trim="newIncomeForm.accountPhone" placeholder="请填写联系方式" size="small"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="对方账号" >
                    <el-input type="text" v-model.trim="newIncomeForm.accountNumber" placeholder="填写对方账号" size="small"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="付款方式" prop="payMethod">
                    <d-select
                    style='width:100%'
                    v-model="newIncomeForm.payMethod"
                    valueKey="code"
                    size="small"
                    placeholder="请选择付款方式"
                    dicCode='HT_ZJ_ZFFS'>
                    </d-select>
                </el-form-item>
            </el-col >
              <el-col :span="12">
                <el-form-item class="wfull" label="结算账户" size="small" prop="accountId" v-if="supportMultiAccount">
                  <el-select v-model="newIncomeForm.accountId" size="small" placeholder="请选择" class="wfull">
                    <el-option v-for="(item, index) of userAccountList" :key="index" :value="item.id" :label="item.showName">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="收款机构" prop="accountDesc" v-else>
                  <el-input type="text" v-model.trim="newIncomeForm.accountDesc" placeholder="请填写收款机构" size="small"></el-input>
                </el-form-item>
              </el-col>
            <el-col :span="12">
                <el-form-item label="流水凭证号" prop="serialNumber"  >
                    <el-input type="text" v-model.trim="newIncomeForm.serialNumber" placeholder="请填写流水凭证号" size="small"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="isAsysHotel">
                <el-form-item label="楼盘名称" prop="communityId">
                    <el-select v-model.trim="communityItem" value-key="id" filterable placeholder="请选择" class="wfull">
                        <el-option
                            v-for="item in communityList"
                            :key="item.id"
                            :label="item.communityName"
                            :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="备注" prop="transferNotes" >
                    <el-input type="textarea" v-model.trim="newIncomeForm.transferNotes" placeholder="请填写备注"  size="small" maxlength="300" show-word-limit></el-input>
                </el-form-item>
            </el-col>
            <el-col :span='24' class='ac'>
                <el-button @click="resetForm('newIncomeForm')" size='small' >取消</el-button>
                <el-button type="primary" @click="submitForm()" size='small' >提交</el-button>
            </el-col>
            </el-row>
        </el-form>
    </div>
</template>
<script>
export default {
  components: {
  },
  props:['dialogInfo', 'userAccountList', 'supportMultiAccount'],
  data() {
    return {
      loading:false,
      newIncomeForm: {
        accountId: null,
        incomeType: "", //收支状态
        payCosts: "", //发生金额
        accountName: "", //对方名称
        accountDate: "", //收支日期
        accountPhone: "", //联系方式
        accountNumber: "", //对方账号
        payMethod: "", //汇款方式
        accountDesc: "", //收款机构
        serialNumber: "", //凭证流水号
        transferNotes: "", //备注
        communityName: "", // 楼盘名称
        communityId: "", //楼盘id
        systemCode: this.$local.fetch('userInfo').syscode,
      },
      newIncomeRules: {
        incomeType: [
          { required: true, message: "请选择收支状态", trigger: "blur" }
        ],
        accountName: [
          { required: true, message: "请输入对方帐户名", trigger: "blur" }
        ],
        accountDate: [
          { required: true, message: "请选择日期时间", trigger: "blur" }
        ],
        payCosts: [{required: true, message: "请输入金额", trigger: "change"}, {type: 'price'}],
        communityId: [
            { required: true, message: "请选择楼盘", trigger: "blur" }
        ],
        accountId: [ { required: true, message: "请选择结算账户", trigger: "blur" }]
      },
      communityItem: null,
      communityList: []
    };
  },
  // created
  // mounted
  // activited
  // update
  // beforeRouteUpdate
  // metods
  created() {
      this.isAsysHotel && this.getCommunityList();
  },
  computed: {
      isAsysHotel(){
        // 判断当前系统为凯亚酒店
        return this.$local.fetch('userInfo').syscode === 'asyshotel';
      }
  },
  methods: {
    submitForm() {

        if(this.communityItem){
            this.newIncomeForm.communityName = this.communityItem.communityName
            this.newIncomeForm.communityId = this.communityItem.id
        }

      this.$refs.newIncomeForm.validate(valid => {
        if (valid) {
          //通过验证
          this.loading = true
          //发送请求保存
          this.$api.seeFinanceService.saveNewFinance(this.newIncomeForm)
            .then(res => {
                //清空表单
                this.$refs.newIncomeForm.resetFields();
                //关闭弹出框
                this.dialogInfo.visible = false
                this.$emit("submit");
            })
            .finally(()=>{
                this.loading = false
            })
        }
      });
    },
    resetForm(formName) {
      //取消
      this.$refs[formName].resetFields();
      this.dialogInfo.visible = false
      //关闭弹出框
      this.$emit("submit");
    },
    getCommunityList(){
        this.$api.seeFinanceService.querySysCodeCommunityList({
            sysCode: this.$local.fetch('userInfo').syscode
        }).then(res => {
            if(res.code == 200){
                this.communityList = res.data;
            }
        })
    }
  }
  // filter
  // computed
};
</script>
<style lang='scss'>
.date-time{
  /deep/ .el-time-panel{
    left: -25px;
  }
}
</style>
