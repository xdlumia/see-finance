<!--财务组件：财务管理-新增发票
/**
* 财务组件：财务管理-发票记录
* @/components/finance/invoice 组件存放位置
* @author web-王晓冬
* @date 2018年10月19日
* @remark 此表单在 finance/bill/bill-info里引用
**/
-->

<template>
    <div class="hfull" v-loading="loading">
        <el-form
            :model="invoiceForm"
            size="small"
            ref="invoiceForm"
            label-width="100px"
            label-position="top"
        >
            <div class="d-auto-y pr20" style="max-height: calc(100vh - 150px)">
                <form-card title="发票信息">
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item
                                prop="invoiceNo"
                                :rules="{required:true,message:'发票号码'}"
                                label="发票号码"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.invoiceNo"
                                    maxlength="32"
                                    placeholder="请输入发票号码"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                prop="invoiceNum"
                                :rules="{required:true,message:'请输入纳税人发票代码'}"
                                label="纳税人发票代码"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.invoiceNum"
                                    maxlength="32"
                                    placeholder="请输入纳税人发票代码"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                prop="issueTime"
                                :rules="{required:true,message:'选择开票时间'}"
                                label="开票时间"
                            >
                                <el-date-picker
                                    style="width:100%"
                                    v-model="invoiceForm.issueTime"
                                    size="small"
                                    type="datetime"
                                    value-format="timestamp"
                                    placeholder="请选择开票时间"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                prop="invoiceCode"
                                :rules="{message:'请输入发票类型'}"
                                label="发票类型"
                            >
                                <d-select
                                    v-model="invoiceForm.invoiceCode"
                                    dicCode="ZD_FP_LX"
                                    placeholder="请选择发票类型"
                                ></d-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </form-card>
                <form-card title="购买方">
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item
                                prop="buyerName"
                                :rules="{required:true,message:'请输入名称'}"
                                label="名称"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.buyerName"
                                    maxlength="32"
                                    placeholder="请输入名称"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                prop="buyerRatepayerCoding"
                                :rules="{required:true,message:'请输入纳税人识别号'}"
                                label="纳税人识别号"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.buyerRatepayerCoding"
                                    maxlength="32"
                                    placeholder="请输入纳税人识别号"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="buyerAddress" :rules="{message:'请输入地址'}" label="地址">
                                <el-input
                                    v-model.trim="invoiceForm.buyerAddress"
                                    maxlength="32"
                                    placeholder="请输入地址"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                prop="buyerPhone"
                                :rules="[{required:false},{min:7,max:20, message:'请输入正确的电话'},{type: 'telePhone', message: '请输入正确的电话'}]"
                                label="电话"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.buyerPhone"
                                    maxlength="32"
                                    placeholder="请输入电话"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                prop="buyerBankName"
                                :rules="{message:'请输入开户行'}"
                                label="开户行"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.buyerBankName"
                                    maxlength="32"
                                    placeholder="请输入开户行"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                prop="buyerBankAccount"
                                :rules="[{required:false,},{type:'bankCard'}]"
                                label="开户行账号"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.buyerBankAccount"
                                    maxlength="25"
                                    placeholder="请输入卡号"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </form-card>
                <form-card title="销售方">
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item
                                prop="sellerName"
                                :rules="{required:true,message:'请输入名称'}"
                                label="名称"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.sellerName"
                                    maxlength="32"
                                    placeholder="请输入名称"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                prop="sellerRatepayerCoding"
                                :rules="{required:true,message:'请输入纳税人识别号'}"
                                label="纳税人识别号"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.sellerRatepayerCoding"
                                    maxlength="32"
                                    placeholder="请输入纳税人识别号"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                prop="sellerAddress"
                                :rules="{required:true,message:'请输入地址'}"
                                label="地址"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.sellerAddress"
                                    maxlength="32"
                                    placeholder="请输入地址"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                prop="sellerPhone"
                                :rules="[{required:true,min:7,max:20, message:'请输入正确的电话'},{type: 'telePhone', message: '请输入正确的电话'}]"
                                label="电话"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.sellerPhone"
                                    maxlength="32"
                                    placeholder="请输入电话"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                prop="sellerBankName"
                                :rules="{required:true,message:'请输入开户行'}"
                                label="开户行"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.sellerBankName"
                                    maxlength="32"
                                    placeholder="请输入开户行"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                prop="sellerBankAccount"
                                :rules="[{required:true,message:'请输入开户行账号'},{type:'bankCard'}]"
                                label="开户行账号"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.sellerBankAccount"
                                    maxlength="32"
                                    placeholder="请输入卡号"
                                ></el-input>
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
                                label="货物名称"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.goodsName"
                                    maxlength="32"
                                    placeholder="请输入货物名称 "
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item
                                prop="modelType"
                                :rules="{message:'请输入规格类型'}"
                                label="规格类型"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.modelType"
                                    maxlength="32"
                                    placeholder="请输入规格类型"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="unitCode" :rules="{message:'请输入单位'}" label="单位">
                                <el-input
                                    v-model.trim="invoiceForm.unitCode"
                                    maxlength="32"
                                    placeholder="请输入单位"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item
                                prop="amount"
                                :rules="[{required:true,message:'请输入数量'},{type:'positiveNum', message:'请输入正整数'}]"
                                label="数量"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.amount"
                                    @input="amountCount"
                                    maxlength="32"
                                    placeholder="请输入数量"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item
                                prop="unitPrice"
                                :rules="[{required:true,message:'请输入单价'},{type:'price'}]"
                                label="单价"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.unitPrice"
                                    @input="amountCount"
                                    maxlength="32"
                                    placeholder="请输入单价"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item
                                prop="money"
                                :rules="[{required:false},{type:'price'}]"
                                label="金额"
                            >
                                <el-input
                                    v-model.trim="invoiceForm.money"
                                    disabled
                                    maxlength="32"
                                    placeholder="金额=数量*单价"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item
                                prop="rate"
                                :rules="{required:true,message:'请输入税率'}"
                                label="税率(%)"
                            >
                                <el-input-number
                                    :controls="false"
                                    @change="amountCount"
                                    :max="99.99"
                                    :precision="2"
                                    v-model="invoiceForm.rate"
                                    maxlength="32"
                                    placeholder="请输入税率"
                                ></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item prop="tax" label="税额">
                                <el-input
                                    v-model.trim="invoiceForm.tax"
                                    disabled
                                    maxlength="32"
                                    placeholder="请输入税额"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="14" :offset="10">
                            <el-form-item prop>
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
                                        <el-input
                                            v-model.trim="invoiceForm.totalBillTaxMoney"
                                            disabled
                                            maxlength="32"
                                            placeholder="请输入价税合计"
                                        ></el-input>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="24">
                            <el-form-item prop="notes" :rules="{message:'请输入备注'}" label="备注">
                                <el-input
                                    type="textarea"
                                    v-model.trim="invoiceForm.notes"
                                    maxlength="140"
                                    placeholder="请输入备注(140)"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
            </div>
        </el-form>
        <div slot="footer" class="mt10 ac">
            <el-button size="small" @click="dialogInfo.visible = false">取 消</el-button>
            <el-button size="small" type="primary" @click="saveInvoice('receiptForm')">确定</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'invoiceInfo',
        components: {},
        props: ["dialogInfo"],
        data () {
            return {
                loading: false,
                //发票Form
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
                    rate: "1", //税率,
                    sellerAddress: "", //示例：卖方地址,
                    sellerBankAccount: "", //示例：卖方开户行账号,
                    sellerBankName: "", //示例：卖方开户行,
                    sellerName: "", //示例：销售方名称,
                    sellerPhone: "", //示例：卖方电话,
                    sellerRatepayerCoding: "", //示例：卖方纳税人识别号,
                    status: "", //0,
                    tax: "", //税额
                    unitCode: "", //示例：单位,
                    unitPrice: "", //单价
                    totalBillTaxMoney: ""  //价税合计 金额 + 税额
                }
            };
        },
        computed: {
            //   invoiceForm(){
            //       return this.dialogInfo.data || {}
            //   }
        },
        created () {
            //   如果有id form表单是编辑要回写数据
            if (this.dialogInfo.id) {
                this.invoiceForm = this.dialogInfo.data || {}
            }
            // 查询合同发票信息
            this.getContractInvoice();
        },
        mounted () { },
        watch: {},
        methods: {
            // 查看发票详情
            getFinvoiceInfo (id) {
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
            // 之前支持开票编辑发票的功能后来取消了
            // 开票
            // makeInvoice() {
            //     this.dialogInfo.visible = true
            // },
            // 编辑发票
            // editInvoice() {
            //     this.true = true;
            // },

            // 计算 款项明细 金额 = 单价*数量
            amountCount () {
                this.invoiceForm.money = (this.invoiceForm.unitPrice - 0) * (this.invoiceForm.amount - 0)
                this.invoiceForm.tax = (this.invoiceForm.money - 0) * (this.invoiceForm.rate - 0) / 100
                this.invoiceForm.totalBillTaxMoney = (this.invoiceForm.money - 0) + (this.invoiceForm.tax - 0)
            },

            // 编辑保存发票
            saveInvoice () {
                this.invoiceForm.fbillId = this.dialogInfo.billId
                this.$refs.invoiceForm.validate(valid => {
                    if (valid) {
                        this.loading = true
                        let url = 'updateFinvoice'
                        // 如果有没有id就是新增发票 否则是编辑发票
                        if (this.dialogInfo.id == null || this.dialogInfo.id == undefined) {
                            url = 'saveFinvoice'
                        }
                        this.$api.seeFinanceService[url](this.invoiceForm)
                            .then(res => {
                                this.$emit('submit', 'invoiceTable')
                                this.dialogInfo.visible = false
                                this.true = false;
                            })
                            .finally(() => {
                                this.loading = false
                            })
                    }
                })
            },
            // 删除发票
            delInvoice () {
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true
                })
                    .then(() => {
                        this.$api.seeFinanceService.delFinvoiceList({ id: this.dialogInfo.data.id })
                            .then(res => {
                                if (res.code == 200) {
                                    this.$emit('submit', 'success')
                                    this.dialogInfo.visible = false
                                }
                            });
                    })
                    .catch(() => { });
            },
            /**
             * 查询合同发票信息
             * 备注：合同详情页有编辑发票信息功能，此处需要查询最新的发票信息
             */
            getContractInvoice () {
                // 只有新增并且businessCode存在时才获取下发票信息
                if(this.dialogInfo.type === 'add' && this.dialogInfo.businessCode) {
                    this.loading = true
                    this.$api.seeFinanceService.getContractInvoice({ businessCode: this.dialogInfo.businessCode, businessType: this.dialogInfo.businessType }).then(res => {
                        res.code == 200 && res.data && Object.keys(res.data).forEach((key, index) => {
                            this.invoiceForm[key] = res.data[key]
                        })
                    }).finally(() => {
                        this.loading = false
                    })
                }
            }
        }
    };
</script>

<style lang="scss" scoped>
</style>
