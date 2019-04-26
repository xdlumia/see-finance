<!--私有组件：收支管理列表详情
/**
* 物业抄录
* @/views/finance/receipt/组件存放位置
* @author web-王晓冬
* @date 2018年10月29日
**/
-->

<template>
  <side-popup class="dialog-bg-gray" :modal="false" :visible.sync='popupInfo.visible' :title='popupInfo.title' width='800px'>
    <div slot='header'>
        <!-- 状态（0未开具,1已开具,2回收审核中,3回收审核通过，4作废审核中，5作废审核通过,6作废驳回) -->
        <!-- 收据状态为开具未开具 可打印 -->
        <el-button size="mini" v-if="receiptInfo.status == 0 || receiptInfo.status == 1">
            <a v-if="receiptInfo.filePathUrl" target="_blank" :href="receiptInfo.filePathUrl">打印</a>
            <a v-else @click="printReceipt" >打印</a>
        </el-button>
        <!-- 回收目前不需要审核 -->
        <el-button @click="updateInvalidAudit" type="danger" v-if="popupInfo.status == 1  && !receiptInfo.taskCode" size="mini">作废</el-button>
        <!-- 如果是非操作人员显示作废状态 -->

        <!-- 此作废为显示状态 -->
        <!-- <el-button type="danger" v-if="receiptInfo.status == 6" size="mini">作废驳回</el-button> -->
        <!-- 如果是操作人员显示操作
        asystem_finance_1015 财务审核
        asystem_finance_1016 责任人审核-->
        <span v-if="receiptInfo.status == 4 && receiptInfo.taskCode">
            <el-button @click="updateInvalidAudit(6)" v-if=" checkAuthorityButton(receiptInfo.taskCode == 'asystem_finance_1015' ? 'asystem_finance_1016' : 'asystem_finance_1017', popupInfo.communityId)"
                       type="danger" size="mini">作废驳回</el-button>
            <el-button @click="updateInvalidAudit('asystem_finance_1015')" v-if="receiptInfo.taskCode == 'asystem_finance_1015' && checkAuthorityButton('asystem_finance_1016', popupInfo.communityId)" type="primary" size="mini">财务审核</el-button>
            <el-button @click="updateInvalidAudit('asystem_finance_1016')" v-if="receiptInfo.taskCode == 'asystem_finance_1016' && checkAuthorityButton('asystem_finance_1017', popupInfo.communityId)" type="primary" size="mini">财务责任人审核</el-button>
        </span>



    </div>
    <!--  body区域 -->
    <el-scrollbar class="hfull" v-loading="loading" v-if="popupInfo.visible">
        <el-form size="small" label-width="120px" label-position="top">
        <div class="d-auto-y pr20">
            <!--房源信息-->
            <el-row :gutter="40" class="invoice-header d-text-gray">
                <el-col :span="24" class="title"> <h2>{{receiptInfo.takerCompany ||'-'}}</h2></el-col>
                <el-col :span="6" class="info-item">
                    <p class="mb10">收据金额</p>
                    <p class="f16">{{receiptInfo.money ||'-'}}</p>
                </el-col>
                <el-col :span="6" class="info-item">
                    <p class="mb10">收据状态</p>
                    <!-- 状态(0未开具,1已开具,2回收审核中,3回收审核通过，4作废审核中，5作废审核通过) -->
                    <p class="f16">{{receiptStatus[receiptInfo.status]}}</p>
                </el-col>
                <el-col :span="6" class="info-item">
                    <p class="mb10">收据编号</p>
                    <p class="f16">{{receiptInfo.receiptNum ||'-'}}</p>
                </el-col>
                <el-col :span="6">
                    <p class="mb10">开据时间</p>
                    <p class="f16">{{receiptInfo.issueTime | timeToStr}}</p>
                </el-col>
            </el-row>
            <div class="d-left-line mt20">交款方</div>
            <el-card :body-style="{padding:'10px'}" shadow="never">
                <el-row :gutter="40">
                <el-col :span="8">
                    <el-form-item
                    prop="payCompany"
                    label="交款单位">
                    <p>{{receiptInfo.payCompany ||'-'}}</p>
                    <!-- <el-input v-model="receiptInfo.payCompany" placeholder="请输入交款单位"></el-input> -->
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item
                    prop="payerName"
                    label="交款人">
                    <p>{{receiptInfo.payerName ||'-'}}</p>
                    <!-- <el-input v-model="receiptInfo.payerName" placeholder="请输入纳税人识别号"></el-input> -->
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item
                    prop="payMobile"
                    label="联系方式">
                    <p>{{receiptInfo.payMobile}}</p>
                    <!-- <el-input v-model="receiptInfo.payMobile" placeholder="请输入联系方式"></el-input> -->
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item
                    prop="payWar"
                    label="汇款方式">
                    <p>{{receiptInfo.payWar | dictionary('FM_FUKUAN_FS')}}</p>
                    <!-- <el-input v-model="receiptInfo.payWar" placeholder="请输入汇款方式"></el-input> -->
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item
                    prop="payAddress"
                    label="联系地址">
                    <p>{{receiptInfo.payAddress ||'-'}}</p>
                    <!-- <el-input v-model="receiptInfo.payAddress" placeholder="请输入联系地址"></el-input> -->
                    </el-form-item>
                </el-col>
                </el-row>
            </el-card>
            <div class="d-left-line mt20">收款方</div>
            <el-card :body-style="{padding:'10px'}" shadow="never">
                <el-row :gutter="40">
                <el-col :span="6">
                    <el-form-item
                    prop="takerCompany"
                    label="收款单位">
                    <p>{{receiptInfo.takerCompany ||'-'}}</p>
                    <!-- <el-input v-model="receiptInfo.takerCompany" placeholder="请输入收款单位"></el-input> -->
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item
                    prop="takerName"
                    label="收款人">
                    <p>{{receiptInfo.takerName ||'-'}}</p>
                    <!-- <el-input v-model="receiptInfo.takerName" placeholder="请输入收款人"></el-input> -->
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item
                    prop="takerWar"
                    label="联系方式">
                    <p>{{receiptInfo.takerWar ||'-'}}</p>
                    <!-- <el-input v-model="receiptInfo.takerWar" placeholder="请输入联系方式"></el-input> -->
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item
                    prop="takerAddress"
                    label="联系地址">
                    <p>{{receiptInfo.takerAddress ||'-'}}</p>
                    <!-- <el-input v-model="receiptInfo.takerAddress" placeholder="请输入联系地址"></el-input> -->
                    </el-form-item>
                </el-col>
                </el-row>
            </el-card>
            <div class="d-left-line mt20">款项明细</div>
            <el-card :body-style="{padding:'10px'}" shadow="never">
                <el-row :gutter="40">
                  <el-col :span="6">
                      <el-form-item
                      prop="costCode"
                      label="费用类型">
                      <p>{{receiptInfo.feeType | dictionary('ZD_FY_LX')}}</p>
                      <!-- <el-input v-model="receiptInfo.costCode" placeholder="请输入费用类型"></el-input> -->
                      </el-form-item>
                  </el-col>
                  <el-col :span="6">
                      <el-form-item
                      prop="amount"
                      label="数量">
                      <p>{{receiptInfo.amount ||'-'}}</p>
                      <!-- <el-input v-model="receiptInfo.amount" placeholder="请输入数量"></el-input> -->
                      </el-form-item>
                  </el-col>
                  <el-col :span="6">
                      <el-form-item
                      prop="amount"
                      label="单价">
                      <p>{{receiptInfo.amount ||'-'}}</p>
                      <!-- <el-input v-model="receiptInfo.amount" placeholder="请输入单价"></el-input> -->
                      </el-form-item>
                  </el-col>
                  <el-col :span="6">
                      <el-form-item
                      prop="money"
                      label="金额">
                      <p>{{receiptInfo.money ||'-'}}</p>
                      <!-- <el-input v-model="receiptInfo.money" placeholder="请输入金额"></el-input> -->
                      </el-form-item>
                  </el-col>
                </el-row>
            </el-card>
            <div class="d-left-line mt20">开具账单</div>
            <el-card :body-style="{padding:'10px'}" shadow="never">
                <el-row :gutter="40" class="lh35">
                    <el-col :span="12">账单编号: {{receiptInfo.fBillEntity.billCode ||'-'}}</el-col>
                    <el-col :span="12">付款方: {{receiptInfo.takerName ||'-'}}</el-col>
                    <el-col :span="12">费用类型: {{receiptInfo.feeType | dictionary('ZD_FY_LX')}}</el-col>
                    <el-col :span="12">计费周期: {{receiptInfo.fBillEntity.feeStartDate | timeToStr}} 至 {{receiptInfo.fBillEntity.feeEndDate | timeToStr}}</el-col>
                    <el-col :span="12">合同编号: {{receiptInfo.fBillEntity.businessType  == 0 || receiptInfo.fBillEntity.businessType  == 1?receiptInfo.fBillEntity.businessCode :'-'}}</el-col>
                    <el-col :span="12">应收金额: {{receiptInfo.money ||'-'}}</el-col>
                    <el-col :span="12">已匹配金额: {{receiptInfo.fBillEntity.factAmount ||'-'}}</el-col>
                    <el-col :span="12">开据金额: {{receiptInfo.fBillEntity.factAmount ||'-'}}</el-col>
                    <!-- <el-col :span="6">
                        <el-form-item
                        prop="billCode"
                        label="账单编号">
                        <p>{{receiptInfo.fBillEntity.billCode ||'-'}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item
                        prop="takerName"
                        label="付款方">
                        <p>{{receiptInfo.takerName ||'-'}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item
                        prop="feeType"
                        label="费用类型">
                        <p>{{receiptInfo.feeType | dictionary('ZD_FY_LX')}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item
                        prop="feeStartDate"
                        label="计费周期">
                        <p>{{receiptInfo.fBillEntity.feeStartDate | timeToStr}} 至 {{receiptInfo.fBillEntity.feeEndDate | timeToStr}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item
                        prop="contractCode"
                        label="合同编号">
                        <p>{{receiptInfo.fBillEntity.contractCode ||'-'}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item
                        prop="money"
                        label="应收金额">
                        <p>{{receiptInfo.money ||'-'}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item
                        prop="buyerBankName"
                        label="已匹配金额">
                        <p>{{receiptInfo.fBillEntity.factAmount ||'-'}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item
                        prop="factAmount"
                        label="开据金额">
                        <p>{{receiptInfo.fBillEntity.factAmount ||'-'}}</p>
                        </el-form-item>
                    </el-col> -->
                </el-row>
            </el-card>
            <audit-record :form="receiptInfo"></audit-record>
        </div>
        </el-form>
    </el-scrollbar>
  </side-popup>
</template>
<script>
import {dataAuthority} from "see-web-basic";
import auditRecord from "./audit-record"
export default {
mixins:[dataAuthority],
  components: {
      auditRecord,
  },
  props: ["popupInfo"],
  data() {
    return {
        loading: false,
        receiptStatus:{
            0:'未开具',
            1:'已开具',
            2:'回收审核中',
            3:'已回收',
            4:'作废审核中',
            5:'已作废',
            6:'作废未通过',
        },
        //发票Form
        receiptInfo: {
            fBillEntity:{}
        }
    };
  },
  computed: {},
  created() {
  },
  mounted() {},
  watch: {
    "popupInfo.id": function(id) {
        //  console.log(this.popupInfo)
        this.getFreceiptInfo(id);
    }
  },
  methods: {
    // 查看仪表详情
    getFreceiptInfo(id) {
      this.loading = true;
      this.$api.seeFinanceService.getFreceiptInfo(id)
        .then(res => {
            this.receiptInfo = res.data || {}
            this.receiptInfo.fBillEntity = this.receiptInfo.fBillEntity || {}
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 打印收据
    printReceipt(){
        let newPdf = window.open();
        this.loading = true
        this.$api.seeFinanceService.printFreceipt(this.popupInfo.data)
        .then(res => {
            if(res.data){
    　　　　　　　 newPdf.location.href = res.data;
            }else{
                this.$message.error('打印失败')
                return
            }
        })
        .finally(()=>{
            this.loading = false
        })
    },
    // 作废收据 提交/审核 /驳回  同一个接口  当驳回的时候state是6
    updateInvalidAudit(status){
        let params = {
            id:this.popupInfo.id,
            status:this.receiptInfo.status,
            auditOpinion:'', //审批意见
            taskCode:this.receiptInfo.taskCode
        }
        if(status == 6){
            params.status = 6
        }
        this.$prompt('请输入审核意见', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
            this.loading = true
            params.auditOpinion = value
            this.$api.seeFinanceService.updateInvalidAudit(params)
            .then(res => {
                // console.log('作废审核成功')
                // 刷新数据
                this.getFreceiptInfo(this.popupInfo.id)
                this.$emit('submit','success')
            }).finally(()=>{
                this.loading = false
            })
        }).catch(() => {});


    },
    // 保存账单
    // saveReceipt() {
    //     this.$refs.receiptInfo.validate(valid=>{
    //         if (valid) {
    //             this.loading = true
    //             this.$api.seeFinanceService.updateFinvoice(this.receiptInfo)
    //             .then(res=> {
    //                 this.$emit('submit','success')
    //                 this.popupInfo.visible = false
    //             })
    //             .finally(()=>{
    //                 this.loading = false
    //             })
    //         }
    //     })
    // },
    // 删除发票
    delInvoice() {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
        })
        .then(() => {
          this.$api.seeFinanceService.delFinvoiceList({ id: this.receiptInfo.id })
            .then(res => {
              if (res.code == 200) {
                this.$emit('submit','success')
                this.popupInfo.visible = false
              }
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.invoice-header {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
  .title {
    border-bottom: 1px dotted #ebeef5;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .info-item {
    border-right: 1px solid #ebeef5;
  }
}
</style>
