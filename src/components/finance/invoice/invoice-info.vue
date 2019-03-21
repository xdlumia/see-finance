<!--私有组件：发票管理列表详情
/**
* 物业抄录
* @/views/finance/invoice/组件存放位置
* @author web-王晓冬
* @date 2018年10月29日
**/
-->

<template>
  <side-popup class="dialog-bg-gray" :modal="false" :visible.sync='popupInfo.visible' :title='popupInfo.title' width='800px'>
    <div slot='header'>
        <el-button @click="popupInfo.visible = false" size="mini">取消</el-button>
        <!-- 之前支持开票编辑发票的功能后来取消了 -->
        <!-- <el-button @click="makeInvoice" size="mini">开票</el-button>
        <el-button @click="editInvoice" v-if="!isEdit" type="primary" size="mini">编辑</el-button>
        <el-button @click="saveInvoice" v-if="isEdit" type="primary" size="mini">保存</el-button>
        <el-button @click="delInvoice" type="danger" size="mini">删除</el-button> -->
    </div>
    <!--  body区域 -->
    <el-scrollbar class="hfull" v-loading="loading">
        <el-form :model="invoiceForm" size="small" ref="invoiceForm" label-width="100px" label-position="top">
        <div class="d-auto-y pr20">
            <!--房源信息-->
            <el-row :gutter="40" class="invoice-header d-text-gray" v-show="!isEdit">
                <el-col :span="24" class="title"> <h2>{{invoiceForm.buyerName ||'-'}}</h2></el-col>
                <el-col :span="4" class="info-item">
                    <p class="mb10">开票金额</p>
                    <p class="f16">{{invoiceForm.money ||'-'}}</p>
                </el-col>
                <el-col :span="4" class="info-item">
                    <p class="mb10">发票类型</p>
                    <p class="f16">{{invoiceForm.invoiceCode | dictionary('ZD_FP_LX')}}</p>
                </el-col>
                <el-col :span="6" class="info-item">
                    <p class="mb10">发票号码</p>
                    <p class="f16 d-elip" :title="invoiceForm.invoiceNo">{{invoiceForm.invoiceNo ||'-'}}</p>
                </el-col>
                <el-col :span="6" class="info-item">
                    <p class="mb10">发票代码</p>
                    <p class="f16 d-elip" :title="invoiceForm.invoiceNum">{{invoiceForm.invoiceNum ||'-'}}</p>
                </el-col>
                <el-col :span="4">
                    <p class="mb10">开票时间</p>
                    <p class="f16">{{invoiceForm.issueTime | timeToStr}}</p>
                </el-col>
            </el-row>
            <form-card title="发票信息" v-if="isEdit">
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item
                        prop="invoiceNo"
                        :rules="{required:isEdit,message:'发票号码'}"
                        label="发票号码">
                        <el-input v-model.trim="invoiceForm.invoiceNo" maxlength="32" :disabled="!isEdit" placeholder="请输入发票号码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                        prop="invoiceNum"
                        :rules="{required:isEdit,message:'请输入纳税人发票代码'}"
                        label="纳税人发票代码">
                        <el-input v-model.trim="invoiceForm.invoiceNum" maxlength="32" :disabled="!isEdit" placeholder="请输入纳税人发票代码"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                        prop="issueTime"
                        :rules="{required:isEdit,message:'选择开票时间'}"
                        label="开票时间">
                            <el-date-picker
                            style='width:100%'
                            v-model="invoiceForm.issueTime"
                            size="small"
                            type="datetime"
                            value-format='timestamp'
                            placeholder="请选择开票时间">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                        prop="invoiceCode"
                        :rules="{message:'请输入发票类型'}"
                        label="发票类型">
                        <el-input v-model.trim="invoiceForm.invoiceCode" maxlength="32" :disabled="!isEdit" placeholder="请输入发票类型"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </form-card>
            <form-card title="购买方">
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item
                        prop="buyerName"
                        :rules="{required:isEdit,message:'请输入名称'}"
                        label="名称">
                        <el-input v-model.trim="invoiceForm.buyerName" maxlength="32" :disabled="!isEdit" placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                        prop="buyerRatepayerCoding"
                        :rules="{required:isEdit,message:'请输入纳税人识别号'}"
                        label="纳税人识别号">
                        <el-input v-model.trim="invoiceForm.buyerRatepayerCoding" maxlength="32" :disabled="!isEdit" placeholder="请输入纳税人识别号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                        prop="buyerAddress"
                        :rules="{message:'请输入地址'}"
                        label="地址">
                        <el-input v-model.trim="invoiceForm.buyerAddress" maxlength="32" :disabled="!isEdit" placeholder="请输入地址"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item
                        prop="buyerPhone"
                        :rules="[{required:false},{min:7,max:20, message:'请输入正确的电话'},{type: 'telePhone', message: '请输入正确的电话'}]"
                        label="电话">
                        <el-input v-model.trim="invoiceForm.buyerPhone" maxlength="32" :disabled="!isEdit" placeholder="请输入电话"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                        prop="buyerBankName"
                        :rules="{message:'请输入开户行'}"
                        label="开户行">
                        <el-input v-model.trim="invoiceForm.buyerBankName" maxlength="32" :disabled="!isEdit" placeholder="请输入开户行"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                        prop="buyerBankAccount"
                        :rules="[{required:false},{type:'bankCard'}]"
                        label="开户行账号">
                        <el-input v-model.trim="invoiceForm.buyerBankAccount" maxlength="32" :disabled="!isEdit" placeholder="请输入卡号"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </form-card>
            <form-card title="销售方">
                <el-row :gutter="40">
                <el-col :span="12">
                    <el-form-item
                    prop="sellerName"
                    :rules="{required:isEdit,message:'请输入名称'}"
                    label="名称">
                    <el-input v-model.trim="invoiceForm.sellerName" maxlength="32" :disabled="!isEdit" placeholder="请输入名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                    prop="sellerRatepayerCoding"
                    :rules="{required:isEdit,message:'请输入纳税人识别号'}"
                    label="纳税人识别号">
                    <el-input v-model.trim="invoiceForm.sellerRatepayerCoding" maxlength="32" :disabled="!isEdit" placeholder="请输入纳税人识别号"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                    prop="sellerAddress"
                    :rules="{required:isEdit,message:'请输入地址'}"
                    label="地址">
                    <el-input v-model.trim="invoiceForm.sellerAddress" maxlength="32" :disabled="!isEdit" placeholder="请输入地址"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                    prop="sellerPhone"
                    :rules="[{required:isEdit,min:7,max:20, message:'请输入正确的电话'},{type: 'telePhone', message: '请输入正确的电话'}]"
                    label="电话">
                    <el-input v-model.trim="invoiceForm.sellerPhone" maxlength="32" :disabled="!isEdit" placeholder="请输入电话"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                    prop="sellerBankName"
                    :rules="{required:isEdit,message:'请输入开户行'}"
                    label="开户行">
                    <el-input v-model.trim="invoiceForm.sellerBankName" maxlength="32" :disabled="!isEdit" placeholder="请输入开户行"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                    prop="sellerBankAccount"
                    :rules="[{required:isEdit,},{type:'bankCard'}]"
                    label="开户行账号">
                    <el-input v-model.trim="invoiceForm.sellerBankAccount" maxlength="32" :disabled="!isEdit" placeholder="请输入卡号"></el-input>
                    </el-form-item>
                </el-col>
                </el-row>
            </form-card>
            <div class="d-left-line mt20">发票内容</div>
            <el-card :body-style="{padding:'10px'}" shadow="never">
                <el-row :gutter="40">
                <el-col :span="12">
                    <el-form-item
                    prop="goodsName"
                    :rules="{message:'请输入货物名称'}"
                    label="货物名称">
                    <el-input v-model.trim="invoiceForm.goodsName" maxlength="32" :disabled="!isEdit" placeholder="请输入货物名称 "></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item
                    prop="modelType"
                    :rules="{message:'请输入规格类型'}"
                    label="规格类型">
                    <el-input v-model.trim="invoiceForm.modelType" maxlength="32" :disabled="!isEdit" placeholder="请输入规格类型"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item
                    prop="unitCode"
                    :rules="{message:'请输入单位'}"
                    label="单位">
                    <el-input v-model.trim="invoiceForm.unitCode" maxlength="32" :disabled="!isEdit" placeholder="请输入单位"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item
                    prop="amount"
                    label="数量">
                    <el-input v-model.trim="invoiceForm.amount" maxlength="32" :disabled="!isEdit" placeholder="请输入数量"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item
                    prop="unitPrice"
                    :rules="[{required:false},{type:'price'}]"
                    label="单价">
                    <el-input v-model.trim="invoiceForm.unitPrice" maxlength="32" :disabled="!isEdit" placeholder="请输入单价"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item
                    prop="money"
                    :rules="[{required:false},{type:'price'}]"
                    label="金额">
                    <el-input v-model.trim="invoiceForm.money" maxlength="32" :disabled="!isEdit" placeholder="请输入金额"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item
                    prop="rate"
                    :rules="{required:false,message:'请输入税率'}"
                    label="税率(%)">
                    <el-input v-model.trim="invoiceForm.rate" maxlength="32" :disabled="!isEdit" placeholder="请输入税率"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item
                    prop="tax"
                    label="税额">
                    <el-input v-model.trim="invoiceForm.tax" maxlength="32" :disabled="!isEdit" placeholder="请输入税额"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="14" :offset="10">
                    <el-form-item prop="">
                        <el-row class="pb5">
                            <el-col :span="8" class="ar pr10">合计：</el-col>
                            <el-col :span="16">
                                <el-col :span="12">{{invoiceForm.money}}</el-col>
                                <el-col :span="12">{{invoiceForm.tax}}</el-col>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8" class="ar pr10">价税合计：</el-col>
                            <el-col :span="16">
                                <el-input v-model.trim="invoiceForm.totalBillTaxMoney" disabled maxlength="32" placeholder="请输入价税合计"></el-input>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="40">
                <el-col :span="24">
                    <el-form-item
                    prop="notes"
                    :rules="{message:'请输入备注'}"
                    label="备注">
                    <el-input type="textarea" v-model="invoiceForm.notes" maxlength="140" :disabled="!isEdit" placeholder="请输入备注(140)"></el-input>
                    </el-form-item>
                </el-col>
                </el-row>
            </el-card>
            <form-card title="关联账单" v-show="!isEdit">
                <el-row :gutter="40" class="lh35">
                    <el-col :span="12">发票编号: {{invoiceForm.invoiceNo || '-'}}</el-col>
                    <el-col :span="12">付款方: {{invoiceForm.buyerName || '-'}}</el-col>
                    <el-col :span="12">费用类型: {{invoiceInfo.feeType | dictionary('ZD_FY_LX') }}</el-col>
                    <el-col :span="12">计费周期: {{invoiceInfo.feeStartDate | timeToStr}}至 {{invoiceInfo.feeEndDate | timeToStr}}</el-col>
                    <el-col :span="12">合同编号: {{invoiceInfo.businessCode || '-'}}</el-col>
                    <el-col :span="12">应收金额: {{invoiceInfo.shouldPayMoney || '-'}}元</el-col>
                    <el-col :span="12">已匹配金额: {{invoiceInfo.factAmount || '-'}}元</el-col>
                    <el-col :span="12">开票金额: {{invoiceForm.money || '-'}}元</el-col>

                    <!-- <el-col :span="12">
                        <el-form-item
                        prop="communityNames"
                        label="账单编号">
                            <p>{{invoiceForm.communityNames}}</p>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item
                        prop="communityNames"
                        label="付款方">
                        <p>{{invoiceForm.communityNames}}</p>
                        </el-form-item>
                    </el-col> -->
                </el-row>
            </form-card>
        </div>
        </el-form>
    </el-scrollbar>
  </side-popup>
</template>
<script>
export default {
  name:'invoiceInfo',
  components: {},
  props: ["popupInfo"],
  data() {
    return {
        isEdit:false,
        loading: false,
        invoiceInfo: {},
        // dialog弹出框
        dialogInfo:{
            title:'', //弹出框标题
            visible:false,//是否显示
            component:'',//组件
            data:'',// 传递的json数据
        },
        //发票Form  (添加此form 是为了防止后期 此表单又要可编辑)
        invoiceForm: {
            amount: "", //数量,
            buyerAddress: "", //示例：买方地址,
            buyerBankAccount: "", //示例：买方开户行账号,
            buyerBankName: "", //示例：买方开户行,
            buyerName: "", //示例：购买方名称,
            buyerPhone: "", //示例：买方电话,
            buyerRatepayerCoding: "", //示例：买方纳税人识别号,
            fbillId: "", //账单id
            goodsName: "", //示例：货物名称,
            id: "", //100000,
            invoiceCode: "", //示例：发票类型(数据字典),
            invoiceNo: "", //示例：发票号码,
            invoiceNum: "", //示例：发票代码,
            issueTime: "", //1539929678402,
            modelType: "", //示例：规格型号,
            money: "", //金额,
            notes: "", //示例：备注,
            rate: "", //税率,
            sellerAddress: "", //示例：卖方地址,
            sellerBankAccount: "", //示例：卖方开户行账号,
            sellerBankName: "", //示例：卖方开户行,
            sellerName: "", //示例：销售方名称,
            sellerPhone: "", //示例：卖方电话,
            sellerRatepayerCoding: "", //示例：卖方纳税人识别号,
            status: "", //0,
            tax: "", //税额
            unitCode: "", //示例：单位,
            unitPrice: "" //单价
        }
    };
  },
  computed: {
    //   invoiceForm(){
    //       return this.popupInfo.data || {}
    //   }
  },
  created() {},
  mounted() {},
  watch: {
    "popupInfo.id": function(id) {
        if(id == null || id == undefined) return
        this.invoiceForm = this.popupInfo.data || {}
        // 如果id为null 此表单为新增 不需要加载详情
        this.getFinvoiceInfo(id);
    },
    // 新增发票都是新打开弹出框.判断是visible为true 并且传过来的isEdit = true就是可编辑操作
    "popupInfo.visible": function(val) {
        if(val){
            // this.isEdit = true
            this.$nextTick(()=>{
                this.isEdit = this.popupInfo.isEdit
            })
        }
    },
  },
  methods: {
    // 查看仪表详情
    getFinvoiceInfo(id) {
      this.loading = true;
      this.$api.seeFinanceService.getFinvoiceInfo(id)
        .then(res => {
            let data = res.data || {}
            this.invoiceInfo = data.fBillEntity || {}
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 开票
    makeInvoice() {
        this.popupInfo.visible = true
    },
    // 编辑发票
    editInvoice() {
        this.isEdit = true;
    },
    // 编辑保存发票
    saveInvoice() {
        this.invoiceForm.fbillId = this.popupInfo.billId
        this.invoiceForm.id = this.popupInfo.id

        this.$refs.invoiceForm.validate(valid=>{
            if (valid) {
                this.loading = true
                let url = 'updateFinvoice'
                // 如果有没有id就是新增发票 否则是编辑发票
                if(this.popupInfo.id==null || this.popupInfo.id==undefined || this.popupInfo.id==''){
                    url = 'saveFinvoice'
                }
                this.$api.seeFinanceService[url](this.invoiceForm)
                .then(res=> {
                    this.$emit('submit','success')
                    this.popupInfo.visible = false
                    this.isEdit = false;
                })
                .finally(()=>{
                    this.loading = false
                })
            }
        })
    },
    // 删除发票
    delInvoice() {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
        })
        .then(() => {
          this.$api.seeFinanceService.delFinvoiceList({ id: this.popupInfo.data.id })
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
