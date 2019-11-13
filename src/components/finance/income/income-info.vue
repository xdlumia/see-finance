<!--财务组件-收支流水-流水详情组件：流水详情组件
/**
* 收支流水：流水详情组件
* @/components/finance/furnover-info.vue 组件存放位置
* @author web-高鹏
* @date 2018年8月7日
**/
-->
<template>
    <div>
        <div class='d-hidden mt30 d-text-qgray' v-loading="loading">
            <p class='ba h50 br5 pl15 pr15' style='line-height:50px'>流水详情（<span class='d-text-blue'>{{resDataMatchState}}</span>）</p>
            <div class='p15'>
                <span class='fl mt10' style='width:50%'>费用类型：{{resData.feeType}}</span>
                <span class='fl mt10' style='width:50%'>对方名称：{{resData.accountName}}</span>
                <span class='fl mt10' style='width:50%'>发生金额：{{resData.payCosts}}</span>
                <span class='fl mt10' style='width:50%'>联系方式：{{resData.accountPhone}}</span>
                <span class='fl mt10' style='width:50%'>已匹配：{{resData.matchedAmount}}</span>
                <span class='fl mt10' style='width:50%'>对方账号: {{resData.accountNumber}}</span>
                <span class='fl mt10' style='width:50%'>未匹配: {{resData.unmatchAmount}}</span>
                <span class='fl mt10' style='width:50%'>流水凭证号: {{resData.serialNumber}}</span>
                <span class='fl mt10' style='width:50%'>收支状态: {{resData.incomeType}}</span>
                <span class='fl mt10' style='width:50%'>收款机构: {{resData.accountDesc}}</span>
                <span class='fl mt10' style='width:50%'>入账日期: {{resData.accountDate | timeToStr('YYYY-MM-DD HH:mm:ss')}}</span>
                <span class='fl mt10' style='width:50%'>付款方式: {{resData.payMethod|dictionary('HT_ZJ_ZFFS')}}</span>
                <span class='fl mt10' style='width:50%'>公司名称: {{resData.companyAccountName}}</span>
                <span class='fl mt10' style='width:50%'>开户行账号: {{resData.companyAccountNo}}</span>
                <span class='fl mt10' style='width:50%'>楼盘名称: {{resData.communityName || '-'}}</span>
                <span class='fl mt10' style='width:50%'>备注: {{resData.transferNotes}}</span>
            </div>
        </div>
        <div class='d-hidden mt30 d-text-qgray'>
            <p class='ba h50 br5 pl15 pr15' style='line-height:50px'>匹配账单</p>
            <div class='p15 mt10 ba br5 d-hidden' v-for="(item,index) in matchBillInfo" :key='index'>
                <span class='fl mt10' style='width:50%'>账单编号：{{item.billCode}}</span>
                <span class='fl mt10' style='width:50%'>账单金额：{{item.amount}}</span>
                <span class='fl mt10' style='width:50%'>对方名称：{{item.accountName}}</span>
                <span class='fl mt10' style='width:50%'>匹配金额: {{item.matchAmount}}</span>
                <span class='fl mt10' style='width:50%'>费用类型: {{item.feeType| dictionary('ZD_FY_LX')}}</span>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    // components
    // props
    props:['dialogInfo', 'userAccountList', 'supportMultiAccount'],
    // data
    data(){
        return{
            loading:false,
            resData:{},
            resDataMatchState:'',
            matchBillInfo:[]
        }
    },
    // created
    created(){
        //发送详细信息请求
        this.loading = false
        this.$api.seeFinanceService.getFurnoverInfo(this.dialogInfo.id)
        .then(res=>{
                if(res.data.incomeType == 0 ){
                    res.data.incomeType='收入'
                }else if(res.data.incomeType == 1 ){
                    res.data.incomeType ='支出'
                }
                if(res.data.matchState==0){
                  this.resDataMatchState='未匹配'
                }else if(res.data.matchState==1){
                  this.resDataMatchState='部分匹配'
                }else if(res.data.matchState==2){
                  this.resDataMatchState='全部匹配'
                }
                this.resData=res.data || {}

                if (this.supportMultiAccount) {
                  if (this.resData.accountId) {
                    let account = this.userAccountList.find((item) =>  item.id = this.resData.accountId)

                    if (account) {
                      this.resData.companyAccountName = account.corporationName
                      this.resData.companyAccountNo = account.account
                    } else {
                      this.resData.companyAccountName = '未知的公司'
                      this.resData.companyAccountNo  = '未知的账号'
                    }
                  } else {
                    this.resData.companyAccountName = '-'
                    this.resData.companyAccountNo  = '-'
                  }
                }

        })
        .finally(()=>{
            this.loading = false
        })
        //发送详细账单信息请求
        this.$api.seeFinanceService.getFinanceBillInfo(this.dialogInfo.id).then(res=>{
          if(res.code==200){
                this.matchBillInfo=res.data
          }else{
            this.$message.error(res.msg)
          }
        })
    },
    // mounted
    // activited
    // update
    // beforeRouteUpdate
    // metods
    // filter
    // computed
}
</script>
<style scoped>

</style>
