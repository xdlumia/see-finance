<!--财务组件-财务管理-催缴
/**
* 财务管理：账单催缴
* @/components/finance/ 组件存放位置
* @author web-王晓冬
* @date 2018年11月8日
**/
-->
<template>
    <el-form
        v-loading="loading"
        :model="dunningForm"
        size="small"
        :rules="dunningForm"
        ref="dunningForm"
        label-width="100px"
    >
        <form-card title="基本信息">
            <el-row :gutter="40">
                <el-col :span="12">
                    <el-form-item label="楼宇名称:">
                        <el-input v-model.trim="dunningForm.tenementName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="房间编号:">
                        <el-input v-model.trim="dunningForm.roomsName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="付款方:">
                        <el-input v-model.trim="dunningForm.payerName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="应付款日期:">
                        <el-input v-model.trim="dunningForm.payDate"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </form-card>
        <form-card title="账单信息">
            <el-table size="mini" :data="dunningForm.fundDetailVoList" border>
                <el-table-column prop="feeType" width="100" label="费用类型"></el-table-column>
                <el-table-column prop="feeStartAndEndDate" label="账期"></el-table-column>
                <el-table-column prop="amount" width="100" label="数量"></el-table-column>
                <el-table-column prop="unitPrice" label="单价"></el-table-column>
                <el-table-column prop="monay" width="100" label="金额"></el-table-column>
            </el-table>
        </form-card>

        <!-- 合同预览 -->
        <contract-preview :visible.sync="viewTemplateVisible" :templateData="receiptTemplate"></contract-preview>
        <div class="ac mt10">收据模板:
            <el-select
                v-model="dunningForm.templateId"
                value-key="id"
                size="small"
                placeholder="请选择"
            >
                <el-option
                    v-for="(item,index) of receiptOptions"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                ></el-option>
            </el-select>
            <el-button size="small" @click="submitForm('previewDunningFbill')" class="mr30">预览</el-button>
            <el-button type="primary" size="small" @click="submitForm('dunningFbill')">打印</el-button>
        </div>
    </el-form>
</template>
<script>
    import contractPreview from "@/views/asistant/templateManage/contract-preview"; // 合同预览信息
    let baseURL = window.g.ApiUrl;
    export default {
        // components
        components: {
            contractPreview
        },
        // props
        props: ['dialogInfo'],
        // data
        data () {
            return {
                baseURL: baseURL,
                receiptOptions: [], //合同模板列表
                viewTemplateVisible: false,
                // 合同预览
                receiptTemplate: {
                    name: "",
                    context: ""
                },
                loading: false,
                // 催缴表单
                dunningForm: {
                    fbillId: '', //账单id,
                    payDate: '', //付款时间,
                    payerName: '', //付款方名称,
                    fundDetailVoList: [], //账单明细列表
                    templateId: '', //模板id
                    roomsName: '', //房间编号,
                    templateId: '', //模板id,
                    tenementName: '', //楼宇名称
                },
            }
        },
        // created
        created () {
            this.getFbillDunning({ fbillId: this.dialogInfo.fbillId })
            // 查询账单模板
            this.getTemplateList(6)
        },
        // mounted
        // activited
        // update
        // beforeRouteUpdate
        // metods
        watch: {},
        methods: {
            // 账单催缴信息查询
            getFbillDunning (params) {
                this.loading = true
                this.$api.seeFinanceService.getFbillDunning(params)
                    .then(res => {
                        this.dunningForm = res.data || {}
                    }).finally(() => {
                        this.loading = false
                    })
            },
            // 获取收据模板
            getTemplateList: function (params) {
                this.$api.seeContractService.getTemplateList(params).then(res => {
                    if (res.code == 200) {
                        this.receiptOptions = res.data || [];
                    }
                });
            },
            // 催缴账单 预览 / 打印
            submitForm (type) {
                this.$api.seeFinanceService[type](this.dunningForm)
                    .then(res => {
                        if (type == 'previewDunningFbill') {
                            // 如果是预览
                            this.receiptTemplate.context = res.data || "";
                            this.viewTemplateVisible = true;
                        } else if (type == 'dunningFbill') {
                            // 如果是打印
                            if (res.data) {
                                window.open(res.data)
                            } else {
                                this.$message.error('打印失败')
                                return
                            }
                        }
                    })
            },
        }
        // filter
        // computed
    }
</script>
<style scoped>
</style>
