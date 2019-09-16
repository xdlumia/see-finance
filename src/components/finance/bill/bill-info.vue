/*
 * @Author: web.高鹏
 * @Date: 2019-04-09 10:59:47
 * @LastEditors: web.冀猛超
 * @LastEditTime: 2019-09-16 11:06:10
 * @Description: 财务管理：账单详情组件
 * @/components/finance/bill-info.vue 组件存放位置
 */

<template>
    <el-scrollbar class="hfull" v-loading="loading">
        <!-- 头信息 -->
        <form-card>
            <el-row class="d-text-gray">
                <el-col :span="5">账单信息(<span class='d-text-blue'> {{billInfo.settleStatus==0?'未结清':(billInfo.settleStatus==1?"已结清":"已关闭")}} </span>)</el-col>
                <!-- 如果是分散式租住 -->
                <el-col :span="10" v-if="isRentSystem && !isAsyshotel">账单金额：{{(billInfo.amount - 0)}}元(账单金额+滞纳金金额)</el-col>
                <el-col :span="10" v-else>总金额：{{(billInfo.amount - 0) + (billInfo.lateFeeMoney - 0)}}元(账单金额+滞纳金金额)</el-col>
                <el-col :span="6">实收/付金额：{{billInfo.factAmount}}元</el-col>
                <el-col :span="3" class="ar"><span class='d-text-blue d-pointer' @click='billLogVisible=true'>操作记录</span></el-col>
            </el-row>
        </form-card>
        <!-- 操作记录对话框 -->
        <el-dialog title="操作记录" v-if="billLogVisible" :visible.sync="billLogVisible" :append-to-body = "true" width='800px'>
            <d-table
                style="height:350px;"
                ref="multipleTable"
                api="operlogService.getLogList"
                :params="{
                    limit: 10,
                    page:1,
                    businessType:4,
                    businessId: billIdInfo.billId
                }"
                border
                size='mini'>
                <el-table-column prop="userName" align='center' width='120px' label="操作人"></el-table-column>
                <el-table-column prop="description" align='center' label="操作内容" show-overflow-tooltip></el-table-column>
                <el-table-column prop="createTime" align='center' label="操作时间" width='140'>
                <template slot-scope='scope'>
                        {{scope.row.createTime | timeToStr('YYYY-MM-DD HH:mm:ss')}}
                </template>
                </el-table-column>
            </d-table>
            <div class="ac mt10">
                <el-button size='small' @click='billLogVisible=false'>取消</el-button>
            </div>
        </el-dialog>
        <!-- 详细信息 -->
        <form-card class="mt10">
            <el-row class="d-text-qgray lh35">
                <el-col :span="12">账单编号：{{billInfo.billCode || '-'}}</el-col>
                <el-col :span="12">费用类型：{{billInfo.feeType | dictionary('ZD_FY_LX')}}</el-col>
                <el-col :span="12">账单金额：{{billInfo.amount || '-'}}</el-col>
                <el-col :span="12">应收/付时间：{{billInfo.payEndDate || billInfo.payStartDate | timeToStr}}</el-col>
                <el-col :span="12">关联合同：{{billInfo.businessType==0?billInfo.businessCode:'-'}}</el-col>
                <el-col :span="12">创建时间：{{billInfo.createTime | timeToStr}}</el-col>
                <el-col :span="12">计费周期：{{billInfo.feeStartDate | timeToStr}} - {{billInfo.feeEndDate | timeToStr}}</el-col>
                <el-col :span="12">收/付款方：{{billInfo.accountName || '-'}}</el-col>
                <el-col :span="12">联系方式：{{billInfo.linkmanPhone || '-'}}</el-col>
                <el-col :span="12">逾期状态：{{billInfo.overDays==0?'正常':'逾期(' + billInfo.overDays + '天)'}}</el-col>
                <el-col :span="12">解约类型：{{billInfo.dissolutionType | dictionary('FM_JYLX') || '-'}}</el-col>
                <el-col :span="12" v-if="isAsysbusiness || isAsyshotel">滞纳金上限：{{billInfo.lateFeeLimit || '-'}} %</el-col>
                <el-col :span="12" v-if="isAsysbusiness || isAsyshotel">滞纳金比例：{{billInfo.lateFeeRatio || '-'}} %</el-col>
                <el-col :span="12" v-if="isAsysbusiness || isAsyshotel">滞纳金金额：{{billInfo.lateFeeMoney || '-'}} 元</el-col>
                <el-col :span="24" v-if="!isAsysbusiness">公司银行账号：开户名称【{{frimData.firmAccountName || '-'}}】，开户银行【{{frimData.firmBankName || '-'}}】，开户账号【{{frimData.firmAccountNumber || '-'}}】</el-col>
                <el-col :span="24">备注：{{billInfo.notes || '-'}}</el-col>

                <!-- <el-col :span="12">费用类型：{{billInfo.feeType | dictionary('ZD_FY_LX')}}</el-col>
                <el-col :span="12">逾期状态：{{billInfo.overDays==0?'正常':'逾期(' + billInfo.overDays + '天)'}}</el-col>
                <el-col :span="12">账单类型：{{billInfo.billType==0?'收款':'付款'}}</el-col>
                <el-col :span="12">到期时间：{{billInfo.settleDate | timeToStr}}</el-col>
                <el-col :span="12">应收/付时间：{{billInfo.payStartDate | timeToStr}}</el-col>
                <el-col :span="12" class="d-elip" :title="billInfo.businessCode">合同编号：{{billInfo.businessCode || '-'}}</el-col>
                <el-col :span="12">对方名称：{{billInfo.accountName || '-'}}</el-col>
                <el-col :span="12">账单编号：{{billInfo.billCode || '-'}}</el-col>
                <el-col :span="12" class="d-elip" :title="billInfo.roomAddress">房间地址：{{billInfo.roomAddress || '-'}}</el-col>
                <el-col :span="12">计费周期开始：{{billInfo.feeStartDate | timeToStr}}</el-col>
                <el-col :span="12">计费周期结束：{{billInfo.feeEndDate | timeToStr}}</el-col>
                <el-col :span="12">创建时间：{{billInfo.createTime | timeToStr}}</el-col>
                <el-col :span="12">创建人：{{billInfo.creator || '-'}}</el-col> -->
            </el-row>
        </form-card>
        <!-- 收支流水 -->
        <form-card :title="true" v-if="authorityButtons.includes('asystem_finance_1006')">
            <el-row slot="title">
                <el-col :span="12" class='d-text-gray'><h3>收支流水</h3></el-col>
                <el-col :span="12" class='ar f14 d-text-blue' v-show="billInfo.settleStatus==0">
                    <span class='d-pointer mr15 el-icon-plus' @click="addIncome" v-if="authorityButtons.includes('asystem_finance_1008')">新增</span>
                    <span class='d-pointer mr15' @click='matchIncome'>匹配</span>
                </el-col>
            </el-row>
            <!-- 收支流水 -->
            <d-table
                style="height:200px;"
                size='mini'
                ref="incomeTable"
                api="seeFinanceService.getBillInfoListOfBillId"
                :paging="false"
                :params="billIdInfo.billId">
                <el-table-column
                    prop="accountName"
                    label="对方名称"
                    width="180"
                    align='center'>
                </el-table-column>
                <el-table-column
                    label="收支时间"
                    width="180"
                    align='center'>
                    <template slot-scope="scope">
                        {{scope.row.accountDate | timeToStr}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="收支状态"
                    align='center'>
                    <template slot-scope="scope">
                        {{scope.row.incomeType==0?'收入':'支出'}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="payCosts"
                    label="发生金额"
                    align='center'>
                </el-table-column>
                <el-table-column
                    prop="matchedAmount"
                    label="匹配金额"
                    align='center'>
                </el-table-column>
                <el-table-column label="操作" align='center'>
                    <template slot-scope="scope">
                        <i class="el-icon-delete d-text-red d-pointer" @click="delIncomeList(scope.row)"></i>
                    </template>
                </el-table-column>
            </d-table>
        </form-card>
        <!-- 账单调整 -->
        <form-card :title="true" >
            <el-row slot="title">
                <el-col :span="12" class='d-text-gray'><h3>账单调整</h3></el-col>
                <el-col :span="12" class='ar f14 d-text-blue'>
                    <span class='d-pointer mr15' @click="adjustmentBill" v-if="authorityButtons.includes('asystem_finance_1021')">调整</span>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <d-table
                size='mini'
                ref="billTable"
                :paging="false"
                api="seeFinanceService.getBillChangeList"
                :params="{ limit:10,page:1, billId:billIdInfo.billId}"
                style="height:200px;">
                <el-table-column
                    prop="adjustAmount"
                    label="调整金额"
                    width="180"
                    align='center'>
                </el-table-column>
                <el-table-column
                    label="调整时间"
                    width="180"
                    align='center'>
                    <template slot-scope='scope'>
                        {{scope.row.adjustDate | timeToStr}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="调整类型"
                    align='center'>
                    <template slot-scope='scope'>
                        {{scope.row.adjustType | dictionary('ZD_TZ_LX')}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="notes"
                    label="备注"
                    align='center'>
                </el-table-column>
                <el-table-column label="操作" align='center'>
                    <template slot-scope="scope">
                        <i class="el-icon-delete d-text-red d-pointer" @click="delBillList(scope.row)"></i>
                    </template>
                </el-table-column>
            </d-table>
        </form-card>
        <!-- 收据记录 -->
        <form-card :title="true" v-if="authorityButtons.includes('asystem_finance_1014')">
            <el-row slot="title">
                <el-col :span="12" class='d-text-gray'><h3>收据记录</h3></el-col>
                <el-col :span="12" class='ar f14 d-text-blue'>
                    <span class='d-pointer mr15 el-icon-plus' @click="addReceiptRecord">开具</span>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <d-table
                size='mini'
                ref="receiptRecordTable"
                :paging="false"
                api="seeFinanceService.getFreceiptList"
                :params="{ limit:20,page:1, fbillId:billIdInfo.billId}"
                style="height:200px;">
                <el-table-column
                    prop="payCompany"
                    label="交款单位"
                    width="180"
                    align='center'>
                </el-table-column>
                <el-table-column
                    prop="receiptNum"
                    label="收据编号"
                    width="180"
                    align='center'>
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="收据金额"
                    align='center'>
                </el-table-column>
                <el-table-column
                    prop="notes"
                    label="开具时间"
                    align='center'>
                    <template slot-scope='scope'>
                        {{scope.row.issueTime | timeToStr}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align='center'>
                    <template slot-scope="scope">
                        {{invoiceStatus[scope.row.status]}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align='center'>
                    <template slot-scope="scope">
                        <p class="f14">
                            <!-- 判断filePathUrl 是否有pdf地址 有直接下载 没有点击下载打开pdf -->
                            <a :href="scope.row.filePathUrl" target="_blank" v-if="scope.row.filePathUrl" class="el-icon-printer d-pointer mr5" title="打印"></a>
                            <i class="el-icon-printer d-pointer mr5" v-else @click="printReceipt(scope.row)" title="打印"></i>
                            <el-button
                                @click="delReceipt(scope.row)"
                                type="text"
                                size="small"
                                icon="el-icon-delete f14"
                                class="d-pointer"
                                :class="{'d-text-red': scope.row.status == 0}"
                                :disabled="scope.row.status != 0">
                                <!-- <i class="el-icon-delete d-pointer d-text-red" title="删除"></i> -->
                            </el-button>
                        </p>

                    </template>
                </el-table-column>
            </d-table>
        </form-card>
        <!-- 开票记录 -->
        <form-card :title="true" v-if="authorityButtons.includes('asystem_finance_1013')">
            <el-row slot="title">
                <el-col :span="12" class='d-text-gray'><h3>开票记录</h3></el-col>
                <el-col :span="12" class='ar f14 d-text-blue'>
                    <span class='d-pointer mr15 el-icon-plus' v-show="invoiceMultipleSelection.length" @click="mergeInvoice">合并</span>
                    <span class='d-pointer mr15 el-icon-printer' v-show="invoiceMultipleSelection.length" @click="priveInvoice">打印</span>
                    <span class='d-pointer mr15 el-icon-plus' @click="addInvoice">开票</span>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <d-table
                size='mini'
                ref="invoiceTable"
                :paging="false"
                api="seeFinanceService.getFinvoiceList"
                :params="{ limit:20,page:1, fbillId:billIdInfo.billId}"
                @selection-change="invoiceSelect"
                style="height:200px;">
                <el-table-column
                align='center'
                type="selection"
                width="50"
                :selectable="invoiceRowSelect">
                </el-table-column>
                <el-table-column
                    prop="buyerName"
                    label="购买方名称"
                    width="180"
                    align='center'>
                </el-table-column>
                <el-table-column
                    prop="invoiceNo"
                    label="发票号码"
                    align='center'>
                </el-table-column>
                <el-table-column
                    prop="money"
                    label="开票金额"
                    align='center'>
                </el-table-column>
                <el-table-column
                    prop="issueTime"
                    label="开票时间"
                    align='center'>
                    <template slot-scope='scope'>
                        {{scope.row.issueTime | timeToStr}}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align='center'>
                    <template slot-scope="scope">
                        <p>{{scope.row.status==1?'已开具':'未开具'}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align='center'>
                    <template slot-scope="scope">
                        <!--已开具 的不能操作-->
                        <p class="f14" v-if="scope.row.status==1">
                            <i class="el-icon-share d-pointer d-text-qgray mr5" title="拆分"></i>
                            <i class="el-icon-edit d-pointer d-text-qgray mr5" title="编辑"></i>
                            <i class="el-icon-delete d-pointer d-text-qgray" title="删除"></i>
                        </p>
                        <!--未开具-->
                        <p class="f14" v-else>
                            <el-popover
                                placement="top-start"
                                v-model="scope.row.splitInvoiceVisble"
                                title="拆分"
                                width="200"
                                trigger="click">
                                <div>
                                    <p>开票金额</p>
                                        <el-input size="mini" v-model.trim="splitData.unitPrice" placeholder="请输入开票金额"></el-input>
                                    <p class="mt5">份数</p>
                                        <el-input size="mini" v-model.trim="splitData.amount" placeholder="请输入份数"></el-input>
                                    <p class="mt10 ar">
                                        <el-button size="mini" @click="scope.row.splitInvoiceVisble = false">取消</el-button>
                                        <el-button type="primary" size="mini" @click="splitInvoice(scope.row)">确定</el-button>
                                    </p>
                                </div>
                                <i class="el-icon-share d-pointer d-text-blue mr5" slot="reference" @click="slpitInvoiceHandle(scope.row)" title="拆分"></i>
                            </el-popover>
                            <i class="el-icon-edit d-pointer d-text-blue mr5" @click="editInvoice(scope.row)" title="编辑"></i>
                            <i class="el-icon-delete d-pointer d-text-red" @click="delInvoice(scope.row)" title="删除"></i>
                        </p>
                    </template>
                </el-table-column>
            </d-table>
        </form-card>


        <!-- 其他信息 -->
        <form-card :title="true" v-loading="otherLoading">
            <el-row slot="title">
                <el-col :span="12" class='d-text-gray'><h3>其他信息</h3></el-col>
                <el-col :span="12" class='ar f14 d-text-blue' v-if="authorityButtons.includes('asystem_finance_1022')">
                    <span class='d-pointer mr15' v-if="!isShowEdit" @click="toggleOtherInfo">编辑</span>
                    <template v-else>
                        <span class='d-pointer mr15' @click="saveOtherInfo">保存</span>
                        <span class='d-pointer mr15' @click="cleanOtherInfo">取消</span>
                    </template>
                </el-col>
            </el-row>

            <el-form>
                <el-col :span="24">
                    <el-form-item label="备注" prop="notes" size='small'>
                        <el-input type="textarea" v-model="billInfo.notes" :disabled="!isShowEdit" placeholder="请填写备注"></el-input>
                    </el-form-item>
                </el-col>
                
                <el-col :span="24">
                    <upload-otherfile ref="fileForm" :fileData="fileForm" :disabled="!isShowEdit" />
                </el-col>
            </el-form>
        </form-card>

        <!-- 操作弹出框 -->
        <el-dialog :title="dialogInfo.title" :visible.sync="dialogInfo.visible" v-dialogDrag :append-to-body = "true" :close-on-click-modal="false" top="20px" :width="dialogInfo.width">
            <!-- dialogInfo.component 切换组件
            dialogInfo prop数据
            @submit  刷新列表 -->
            <component :is="dialogInfo.component" :dialogInfo="dialogInfo" v-if="dialogInfo.visible" @submit="tableReload"></component>
        </el-dialog>
        <!-- <billinfo-edit-invoice  :popupInfo="popupInfo" @submit="tableReload"></billinfo-edit-invoice> -->
    </el-scrollbar>
</template>
<script>
import billinfoIncomeAdd from "./billinfo-income-add"; //流水新增
import billinfoIncomeMacth from "./billinfo-income-match"; //流水匹配
import billinfoBillAdjustment from "./billinfo-bill-adjustment"; //账单调账
import billinfoReceiptAdd from "./billinfo-receipt-add"; //开具收据
import invoiceAdd from "../invoice/invoice-add.vue"; //新增发票
import uploadOtherfile from "./upload-otherfile"; //其他信息

export default {
    // components
    components:{
        billinfoIncomeAdd,
        billinfoIncomeMacth,
        billinfoBillAdjustment,
        billinfoReceiptAdd,
        invoiceAdd,
        uploadOtherfile
    },
    // props
    props:['billCodeInfo','billIdInfo'],
    // data
    data(){
        return{
            loading:false,
            billLogVisible:false, //账单记录
            // 发票状态
            invoiceStatus:{
                0: '未开具',
                1: '已开具',
                2: '回收审核中',
                3: '回收审核通过',
                4: '作废审核中',
                5: '作废审核通过',
                6: '作废审核已驳回'
            },
            // 账单详情
            billInfo:{
                settleStatus:'',
                billType:'', //账单类型
                settleDate:'', //到期时间
                payStartDate:'', //应收/付时间
                contractCode:'', //合同编号
                accountName:'', //对方名称
                billCode:'', //账单编号
                roomAddress:'', //房间地址
                feeStartDate:'', //计费周期
                feeEndDate:'', //计费周期
                createTime:'', //创建时间
                creator:'', //创建人
                businessCode:'',
            },
            splitData:{
                amount:'', //份数
                unitPrice:'', //金额
            }, //拆分数据
            // 弹出框信息
            dialogInfo:{
                title:'',// 弹出框标题
                width:'',// 弹出框宽度
                component:'',//组件切换
                data:'', //传值的数据
            },
            invoiceMultipleSelection:[],//发票多选
            isShowEdit: false, // 其他信息 编辑
            // 附件
            fileForm: { 
                filename: '',
                attachmentList: [],
                contractAttachment: ''
            },
            oldFileForm: {
                filename: '',
                attachmentList: [],
                contractAttachment: ''
            },
            notes: '',
            otherLoading: false,
            frimData: {}
        }
    },
    // created
    created(){
        this.getBillInfo()
    },
    computed: {
        isAsysbusiness(){
            // 判断当前系统为集中式
            return this.$local.fetch('userInfo').syscode == 'asysbusiness';
        },
        isRentSystem(){
            return this.$local.fetch('userInfo').syscode == 'asystem';
        },
        isAsyshotel(){
            return this.$local.fetch('userInfo').syscode == 'asyshotel';
        }
    },
    // mounted
    // activited
    // update
    // beforeRouteUpdate
    // metods
    watch:{
        'billIdInfo.billId':function(){
            this.getBillInfo()
            // 刷新收支流水表格数据
            this.$refs.incomeTable.reload()
            //刷新账单调整表格数据
            this.$refs.billTable.reload()
            //刷新收据表格数据
            this.$refs.receiptRecordTable.reload()
            //刷新发票表格数据
            this.$refs.invoiceTable.reload()
        }
    },
    methods:{
        // 取消逻辑
        cleanOtherInfo(){
            this.toggleOtherInfo();
            this.fileForm = JSON.parse(JSON.stringify(this.oldFileForm));
            this.billInfo.notes = this.notes;
        },
        // 编辑 显隐
        toggleOtherInfo(){
            this.isShowEdit = !this.isShowEdit
        },
        // 保存 其他信息
        saveOtherInfo(){
            let otherFbillContent = JSON.stringify({file: {
                filename: this.fileForm.filename,
                url: this.fileForm.contractAttachment,
                fileNames: this.fileForm.attachmentList.map(item => item.attachmentName)
            }})

             this.$refs.fileForm.$refs.fileForm.validate(res => {
                 if(res){
                        this.otherLoading = true;
                        this.$api.seeFinanceService.updateBatchFbill([{ id:this.billInfo.id, notes: this.billInfo.notes ,otherFbillContent }]).then(res => {
                            this.toggleOtherInfo();
                            this.oldFileForm = Object.assign({}, {
                                filename: this.fileForm.filename || '',
                                attachmentList: [...this.fileForm.attachmentList] || [],
                                contractAttachment: this.fileForm.contractAttachment
                            })
                            this.notes = this.billInfo.notes
                        }).finally(() => {
                            this.otherLoading = false;
                        })
                 }
                
            })
        },
        //默认请求刷新页面
        getBillInfo(){
            //发送请求基本信西
            this.loading = true
            this.$api.seeFinanceService.getBillInfo({billCode:this.billCodeInfo.billCode})
            .then(res => {
                if(res.code==200){
                    this.billInfo = res.data || {}

                    this.notes = res.data.notes
                    if( res.data.otherFbillContent ){
                        let otherFbillContent = JSON.parse(res.data.otherFbillContent || '{}');
                        this.frimData = otherFbillContent.firmAccountVo || {}

                        if(!otherFbillContent.file) return ;
                        this.fileForm = {
                            filename: otherFbillContent.file.filename || '',
                            attachmentList: (otherFbillContent.file.fileNames || []).map(item => ({ attachmentName: item })),
                            contractAttachment: otherFbillContent.file.url
                        }

                        this.oldFileForm = {
                            filename: otherFbillContent.file.filename || '',
                            attachmentList: (otherFbillContent.file.fileNames || []).map(item => ({ attachmentName: item })),
                            contractAttachment: otherFbillContent.file.url
                        }

                        
                    }
                }
            })
            .finally(()=>{
                this.loading = false
            })
        },
        //新增流水
        addIncome(){
            this.dialogInfo={
                visible:true,
                title:'添加流水',
                width:'700px',
                component:'billinfoIncomeAdd',
                billId:this.billIdInfo.billId,
                communityId: this.billInfo.communityId
            }
        },
        // 匹配流水
        matchIncome(){
            this.dialogInfo={
                visible:true,
                title:'选择流水',
                width:'900px',
                component:'billinfoIncomeMacth',
                billId:this.billIdInfo.billId,
                billType:this.billInfo.billType,
                data:this.billInfo,
                billPayingAmount:(+this.billInfo.amount + +this.billInfo.lateFeeMoney) - +this.billInfo.factAmount,
            }
        },
        //收支流水列表删除
        delIncomeList(row){
            // console.log(row)
            //发送请求
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
            }).then(() => {
                let params = {
                  matchAmount:row.matchedAmount,
                  incomeRecordId:row.id,
                  billId:this.billIdInfo.billId,
                  id:row.fIncomeRecordMatchId
                }
                this.$api.seeFinanceService.delBillFinanceItem(params).then(res=>{
                    if(res.code==200){
                        //刷新流水表格
                        this.tableReload('incomeTable')
                        // this.$refs.incomeTable.reload()
                        // this.$emit('changeModuleInfo')
                        this.getBillInfo()
                    }
                })
            }).catch(() => {
                this.$message('已取消删除')
            })
        },
        //调整账单
        adjustmentBill(){
            this.dialogInfo={
                visible:true,
                title:'调整账单',
                width:'450px',
                component:'billinfoBillAdjustment',
                billId:this.billIdInfo.billId,
                adjustBeforAmount:this.billInfo.amount, //调整之前的金额
            }
        },

        //账单调整删除
        delBillList(row){
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                    }).then(() => {
                        let id = {id:row.id}
                        this.$api.seeFinanceService.delBillChangeItem(id).then(res=>{
                            if(res.code==200){
                                //刷新账单表格
                                this.tableReload('billTable')
                                // this.$refs.billTable.reload()
                            }
                        })
                    }).catch(() => {})
        },
        // 打印收据
        printReceipt(item){
            this.loading = true
            this.$api.seeFinanceService.printFreceipt(item)
            .then(res=>{
                if(res.data){
                    window.open(res.data)
                    //刷新收据表格
                    this.$refs.receiptRecordTable.reload()
                }else{
                    this.$message.error('打印失败')
                    return
                }
                // console.log('打印成功')
            })
            .finally(()=>{
                this.loading = false
            })
        },
        // 删除收据
        delReceipt(item){
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
            }).then(() => {
                this.$api.seeFinanceService.delFreceiptList({id:item.id}).then(res=>{
                    if(res.code==200){
                        //刷新收据表格
                        this.$refs.receiptRecordTable.reload()
                        // this.$emit('changeModuleInfo')
                    }
                })
            }).catch(() => {})
        },
        // 开具收据记录
        addReceiptRecord(){
            this.dialogInfo={
                visible:true,
                title:'添加收据',
                width:'800px',
                component:'billinfoReceiptAdd',
                billId:this.billIdInfo.billId,
                adjustBeforAmount:this.billInfo.amount, //调整之前的金额
            }
        },
        //拆分发票
        slpitInvoiceHandle(item){
            let data = Object.assign({},item)
            this.splitData = data
        },
        // 保存拆分发票
        splitInvoice(item){
            let params = {
                copies: this.splitData.amount,
                id: item.id,
                money: this.splitData.unitPrice
            }
            this.loading = true
            this.$api.seeFinanceService.splitFinvoice(params)
            .then(res=>{
                // console.log('拆分成功')
                item.splitInvoiceVisble = false
                //刷新开票记录表格
                this.$refs.invoiceTable.reload()

            })
            .finally(()=>{
                this.loading = false
            })
        },
        // 合并发票
        mergeInvoice(){
            this.$confirm('此操作将合并发票, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
            }).then(() => {
                let ids = this.invoiceMultipleSelection.map(item=>{return item.id})
                this.$api.seeFinanceService.mergeFinvoice(ids)
                .then(res=>{
                    //刷新开票记录表格
                    this.$refs.invoiceTable.reload()
                })
            }).catch(() => {})
        },
        // 发票多选
        invoiceSelect(val){
            this.invoiceMultipleSelection = val
        },
        renderContent(h, { node, data, store }) {
            return (
            <span class="custom-tree-node">
                <span>{node.label}</span>
                <span>
                <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
                <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
                </span>
            </span>);
        },
        // 打印发票
        priveInvoice(){
            // 一次打印多个数据会合并数据, 是否合并打印?
            const h = this.$createElement;
            this.$confirm('<div id="priveInvoice"><p>一次打印多个数据会合并数据, 是否合并打印</p>'+
            '<input type="radio" name="priveInvoice" value="0" checked><lable>不合并</lable>'+
            '<input type="radio" name="priveInvoice" value="1" class="ml30"><lable>合并</lable></div>',
            '提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
            }).then(() => {
                let val = document.querySelector('#priveInvoice input:checked').value
                // val=0 不合并 val==1 合并
                this.fnPriveInvoice(val)
                //刷新开票记录表格
                this.$refs.invoiceTable.reload()
            }).catch(() => {})
        },
        // 打印发票方法
        fnPriveInvoice(isMerge){
            let params = {
                ids:this.invoiceMultipleSelection.map(item=>{return item.id}),
                isMerge: isMerge,
            }
            this.loading = true
            this.$api.seeFinanceService.printFinvoice(params).then(res=>{
                this.$message.success('打印成功')
                // 目前假打印 只是为了刷新状态
                // if(res.data){
                //     window.open(res.data)
                // }
                // else{
                //     this.$message.error('打印失败')
                //     return
                // }
                //刷新开票记录表格
                this.$refs.invoiceTable.reload()
            })
            .finally(()=>{
                this.loading = false
            })
        },
        // 添加发票
        addInvoice(){
            this.dialogInfo={
                visible:true,
                title:'添加发票',
                id:null,
                component:'invoiceAdd',
                billId:this.billIdInfo.billId,
                businessCode: this.billInfo.businessCode,
                businessType: this.billInfo.businessType,
                type: 'add'
            }
        },
        // 编辑发票
        editInvoice(item){
            let data = Object.assign({},item)
            this.dialogInfo={
                visible:true,
                title:'编辑发票',
                id:item.id,
                data:data,
                component:'invoiceAdd',
                billId:this.billIdInfo.billId,
                type: 'edit'
            }
        },
        // 删除发票
        delInvoice(item){
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
            }).then(() => {
                this.$api.seeFinanceService.delFinvoiceList({id:item.id}).then(res=>{
                    if(res.code==200){
                        //刷新开票记录表格
                        this.$refs.invoiceTable.reload()
                        // this.$emit('changeModuleInfo')
                    }
                })
            }).catch(() => {})
        },
        // 表单刷新
        tableReload(tableRef,type){
            // 刷新当前操作列表
            this.$refs[tableRef].reload()
            // 刷新账单列表
            this.$emit("submit")
            // 刷新详情
            this.getBillInfo()
            // 如果当前是保存或者打印匹配 刷新收支流水列表 并且刷新账单详情
            // if(type == 'printFreceipt' || type == 'saveFreceipt'){
            //   this.getBillInfo()
            // }
        },
        // 帐单详情开票记录checkbox状态
        invoiceRowSelect(row, index) {
            if(row.status == 1) {
                return false
            }
            else{return true}
        }
    }
    // filter
    // computed
}
</script>
<style scoped>

</style>
