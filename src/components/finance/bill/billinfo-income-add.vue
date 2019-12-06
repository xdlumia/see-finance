<!--账单管理
/**
* 账单管理详情收支流水新增
* @/components/finance/bill 组件存放位置
* @author web-王晓冬
* @date 2018年11月2日
**/
-->
<template>
    <!-- 表单 -->
    <el-form v-loading="loading" :model="addIncomeForm" :rules="addIncomeRules" ref="addIncomeForm" label-width="100px" class="mt15" >
        <form-card>
            <el-row>

            <el-col :span="12">
                <el-form-item label="收支状态" prop="incomeType">
                    <el-select v-model="addIncomeForm.incomeType" size="small" style='width:100%' placeholder="请选择收支状态">
                        <el-option label="收入" value="0"></el-option>
                        <el-option label="支出" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="发生金额" prop="payCosts">
                    <el-input maxlength="14" v-model.number="addIncomeForm.payCosts" size="small" placeholder="请填写金额"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="对方名称" prop="accountName">
                    <el-input maxlength="18" type="text" v-model.trim="addIncomeForm.accountName" size="small" placeholder="请填写名称"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="收支日期" prop="accountDate" >
                    <el-date-picker
                    style='width:100%'
                    v-model="addIncomeForm.accountDate"
                    size="small"
                    type="datetime"
                    value-format='timestamp'
                    placeholder="请选择日期时间"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item prop="accountPhone"  label="联系方式" :rules="[{ required: false },{type:'telePhone', message: '请输入正确的联系方式'}]">
                    <el-input maxlength="20" type="text" v-model.trim="addIncomeForm.accountPhone" size="small" placeholder="请填写联系方式"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="对方账号" >
                    <el-input maxlength="32" type="text" v-model.trim="addIncomeForm.accountNumber" size="small" placeholder="请填写对方账号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="付款方式" prop="payMethod">
                    <d-select
                    v-model="addIncomeForm.payMethod"
                    valueKey="code"
                    size="small"
                    dicCode='HT_ZJ_ZFFS'
                    placeholder="请选择付款方式">
                    </d-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="wfull" label="结算账户" size="small" prop="accountId" v-if="supportMultiAccount">
                <el-select v-model="addIncomeForm.accountId" size="small" placeholder="请选择" class="wfull">
                  <el-option v-for="(item, index) of userAccountList" :key="index" :value="item.id" :label="item.showName">
                  </el-option>
                </el-select>
              </el-form-item>
                <el-form-item label="收款机构" prop="accountDesc" v-else>
                    <el-input maxlength="32" type="text" v-model.trim="addIncomeForm.accountDesc" size="small" placeholder="请填写收款机构"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="流水凭证号" prop="serialNumber">
                    <el-input maxlength="32" type="text" v-model.trim="addIncomeForm.serialNumber" size="small" placeholder="请填写流水凭证号"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12" v-if="isAsysHotel">
                <el-form-item label="楼盘名称" prop="communityId">
                    <el-select v-model.trim="communityItem" value-key='id' filterable placeholder="请选择" class="wfull" disabled>
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
                    <el-input maxlength="32" type="textarea" v-model.trim="addIncomeForm.transferNotes"  size="small" placeholder="请填写备注"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span='24' class='ac'>
                <el-button @click="dialogInfo.visible = false" size='small' >取消</el-button>
                <el-button type="primary" @click="submitForm" size='small' >提交</el-button>
            </el-col>
            </el-row>
        </form-card>
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
      addIncomeForm: {
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
        billId: this.dialogInfo.billId,
        communityName: "", // 楼盘名称
        communityId: "", //楼盘id
        systemCode: this.$local.fetch('userInfo').syscode,
      },
      addIncomeRules: {
        incomeType: [{ required: true, message: "请选择收支状态" }],
        accountName: [{ required: true, message: "请输入对方帐户名" }],
        accountDate: [{ required: true, message: "请选择日期时间" }],
        payCosts: [{required: true, message: "请输入金额"}, {type: 'price'}],
        communityId: [
            { required: true, message: "请选择楼盘", trigger: "blur" }
        ],
        accountId: [ { required: true, message: "请选择结算账户", trigger: "blur" }]
      },
      communityList: [],
      communityItem: null,
      // 公司账户列表
      userAccountList: []
    };
  },
  // created
  created() {
        this.isAsysHotel && this.getCommunityList();
        this.supportMultiAccount && this.getCompanyAccountList()
  },
  // mounted
  // activited
  // update
  // beforeRouteUpdate
  // metods
  computed: {
      isAsysHotel(){
        // 判断当前系统为凯亚酒店
        return this.$local.fetch('userInfo').syscode == 'asyshotel';
      },
     // 是否支持多账号
       supportMultiAccount() {
         return this.$local.fetch('userInfo').syscode === 'asysbusiness';
       }
  },
  methods: {
    //筛选提交
    submitForm(formName) {

      if( this.communityItem ){
          this.addIncomeForm.communityName = this.communityItem.communityName
          this.addIncomeForm.communityId = this.communityItem.id
      }

        //新增流水匹配保存
        this.$refs.addIncomeForm.validate(valid => {
          if (valid) {
            //通过验证
            this.loading = true
            //发送请求保存
            this.$api.seeFinanceService.saveMatchFinance(this.addIncomeForm)
              .then(res => {
                if (res.code == 200) {
                  //关闭弹出框
                  this.dialogInfo.visible = false;
                  this.$emit("submit", "incomeTable");
                }
              })
              .finally(res=>{
                  this.loading = false
              })
          }
        });
    },
    getCommunityList(){
        this.$api.seeFinanceService.querySysCodeCommunityList({
            sysCode: this.$local.fetch('userInfo').syscode,
            communityId: this.dialogInfo.communityId
        }).then(res => {
            if(res.code == 200){
                res.data.forEach(item => {
                    item.id == this.dialogInfo.communityId && (
                        this.communityItem = item
                    )
                })
                this.communityList = res.data;
            }
        })
    },
    getCompanyAccountList() {
      this.$api.seeBaseinfoService.getCompanyAccountList().then(({data}) => {
        this.userAccountList = data || []

        this.userAccountList.forEach(item => {
          let obj = this.dictionaryOptions('PSI_GSSZ_ZHLX').find(op => {
            return op.code === item.accountType
          })
          let accountType = (obj && obj.content) ? obj.content : ''

          item.showName = obj && obj.code === 'PSI_GSSZ_ZHLX-4' ? `${item.corporationName}(${accountType}: ${item.accountName})`:`${item.corporationName}(${accountType}: ${item.account})`
        })
      })
    }
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

