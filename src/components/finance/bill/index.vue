/*
 * @Author: web.王晓冬
 * @Date: 2019-04-09 10:59:47
 * @LastEditors: web.冀猛超
 * @LastEditTime: 2019-09-20 09:28:47
 * @Description: 财务组件：财务主页
 */

<template>
    <div>
        <div class="d-relative">
            <el-row style="height:30px">
                <el-col :span="15">
                    <!-- <el-checkbox :indeterminate="isFundIndeterminate" v-model="Fund" @change="checkAllFund">全选</el-checkbox> -->
                    <article class="d-text-gray">
                        收付款方(笔):
                        <el-checkbox-group class="d-inline" :min="1" v-model="queryForm.revenueArray" @change="tableReload(1)">
                            <el-checkbox v-for="(item,index) of revenueData" :key="index" :label="item.value">{{item.label}}({{item.count}})</el-checkbox>
                        </el-checkbox-group>
                    </article>
                </el-col>
                <el-col :span="9">
                    <!-- <el-checkbox :indeterminate="isUnclearIndeterminate" v-model="checkAll" @change="checkAllUnclear">全选</el-checkbox> -->
                    <article class="d-text-gray">
                        未结清(笔):
                        <el-checkbox-group class="d-inline" v-model="queryForm.unclearedArray" @change="tableReload(1)">
                            <el-checkbox v-for="(item,index) of unclearedData" :key="index" :label="item.value">{{item.label}}({{item.count}})</el-checkbox>
                        </el-checkbox-group>
                    </article>
                </el-col>
            </el-row>
            <!-- <el-tabs v-model="queryForm.billType" @tab-click="tabsHandle">
                <el-tab-pane label="应收账单" name="0"></el-tab-pane>
                <el-tab-pane label="应付账单" name="1"></el-tab-pane>
                <el-tab-pane label="全部" name="9"></el-tab-pane>
            </el-tabs> -->
            <div class="handle-filter">
                <el-button
                    size="medium"
                    v-if="authorityBtn.includes('asystem_finance_1002')"
                    @click="addBillHandle"
                >新增账单</el-button>
                <el-button
                    size="medium"
                    v-if="authorityBtn.includes('asystem_finance_1003')"
                    @click="exportTable"
                >导出表格</el-button>
                <el-button
                    size="medium"
                    v-show="multipleSelection.length"
                    v-if="authorityBtn.includes('asystem_finance_1004')"
                    type="danger"
                    @click="delItem('all')"
                >批量删除</el-button>
                <el-button
                    size="medium"
                    v-show="multipleSelection.length"
                    v-if="authorityBtn.includes('asystem_finance_1004')"
                    @click="bulkPrintBill()"
                >批量打印</el-button>
                <!-- 责任人设置 -->
                <dutySetting
                    v-if="authorityButtons.includes('asystem_finance_res_1001')"
                    title="分配财务-账单管理责任人"
                    parent="账单管理" size="16"
                    color="#666"
                    :syscode="syscode"
                    pageCode="asystem_finance_1001"
                    module="finance"
                ></dutySetting>
                <!-- <dutySetting key="1" title="分配已成交合同责任人" parent="已成交合同" size="16" syscode="asysbusiness" pageCode="asystem_contract_bargain_1009"
                    v-if="authorityButtons.includes('asystem_contract_res_1001')&&activeContract=='seeContractService.getContractList'" module="contract"
                ></dutySetting> -->
                <!-- 筛选组件 -->
                <bill-filter @submit="tableReload(1)" :projectList="projectList" :isAsysbusiness="isAsysbusiness" :params="queryForm"></bill-filter>
            </div>
        </div>
        <div class="d-flex-tcb" style="height:calc(100vh - 176px);">
            <!-- 表格 -->
            <d-table
                class="hfull d-hidden"
                ref="billTable"
                api="seeFinanceService.getBillList"
                :params="queryForm"
                size="small"
                @selection-change="handleSelectionChange">
                <el-table-column show-overflow-tooltip align="center" type="selection" width="50"></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    label="账单编号"
                    width="230"
                    prop="billCode">
                    <template slot-scope="scope">
                        <p
                            class="d-text-blue d-pointer"
                            @click="viewBillInfo(scope.row)"
                        >{{scope.row.billCode}} <el-tag class="ml5" v-if="scope.row.instalBank" size="mini" >{{scope.row.instalBank}}</el-tag></p>
                    </template>
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="accountName"
                    label="对方名称"
                    width="140"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    v-if="!isRentSystem"
                    align="center"
                    prop="houseArray"
                    min-width="140"
                    label="楼盘名称"
                >
                    <template slot-scope="scope">{{getCommunityName (scope.row.houseArray)}}</template>
                </el-table-column>
                <el-table-column
                    v-if="isRentSystem"
                    show-overflow-tooltip
                    align="center"
                    prop="roomAddress"
                    label="房间地址"
                    min-width="140"
                ></el-table-column>
                <el-table-column
                    v-if="!isRentSystem"
                    show-overflow-tooltip
                    align="center"
                    prop="houseArray"
                    label="房间号"
                    min-width="140"
                >
                    <template slot-scope="scope">{{getHouseNumber(scope.row.houseArray)}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="解约类型" width="90">
                    <template slot-scope="scope">{{scope.row.dissolutionType | dictionary('FM_JYLX') || '-'}}</template>
                </el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="费用类型" width="90">
                    <template slot-scope="scope">{{scope.row.feeType | dictionary('ZD_FY_LX')}}</template>
                </el-table-column>
                <!-- <el-table-column show-overflow-tooltip
                    align='center'
                    prop="roomAddress"
                    label="房间地址"
                    width="110">
                    <template slot-scope="scope">
                        <el-popover
                            placement="top-start"
                            trigger="hover"
                            :content="scope.row.roomAddress">
                            <div class="d-elip" slot="reference">{{scope.row.roomAddress}}</div>
                        </el-popover>
                    </template>
                </el-table-column>-->
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="billType"
                    :formatter="billState"
                    label="账单类型"
                    width="90"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="amount"
                    label="账单金额"
                    width="100"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="lateFeeMoney"
                    label="滞纳金"
                    width="100"
                    v-if="!isRentSystem || isAsyshotel"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="factAmount"
                    label="实收/付费用"
                    min-width="100"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="overDays"
                    min-width="140"
                    :formatter="overDaysState"
                    label="逾期状态"
                ></el-table-column>
                <el-table-column show-overflow-tooltip align="center" label="计费周期" width="200">
                    <template
                        slot-scope="scope"
                    >{{scope.row.feeStartDate | timeToStr('YYYY-MM-DD')}}~{{scope.row.feeEndDate | timeToStr('YYYY-MM-DD')}}</template>
                </el-table-column>

                <el-table-column align="center" label="预付款" width="80" v-if="isAsyshotel">
                    <template slot-scope="scope">{{!+scope.row.isBargainMoney ? '否' : '是'}}</template>
                </el-table-column>

                <el-table-column show-overflow-tooltip align="center" label="应收/应付时间" width="140">
                    <template
                        slot-scope="scope"
                    >{{scope.row.payEndDate || scope.row.payStartDate | timeToStr('YYYY-MM-DD HH:mm')}}</template>
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="settleStatus"
                    :formatter="formatSettleStatus"
                    label="结清状态"
                    :width="isAsysbusiness ? 130 : 80"
                ></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="billSource"
                    label="账单来源"
                    width="120"
                >
                    <template
                        slot-scope="scope"
                    >{{ billSourceType[scope.row.billSource] || '未知' }}</template>
                </el-table-column>
                <el-table-column label="操作" align="center" :width="isAsysbusiness ? 180 : 80">
                    <template slot-scope="scope">
                      <!--应收 && 未结清的，显示催缴-->
                      <el-button
                        size="mini"
                        type="primary"
                        v-if="isAsysbusiness && scope.row.billType == 0 && scope.row.settleStatus == 0 && authorityBtn.includes('asystem_finance_1023')"
                        @click.stop="startBusinessDunning(scope.row)"
                      >催缴</el-button>
                      <!--应收 && 未结清的 && 审核状态为新增or驳回的，显示付款申请-->
                      <el-button
                        size="mini"
                        type="primary"
                        v-if="isAsysbusiness && scope.row.billType == 1 && scope.row.settleStatus == 0 && (scope.row.payApprovalStatus == 1  || scope.row.payApprovalStatus == 3) && authorityBtn.includes('asystem_finance_1024')"
                        @click.stop="startPaymentApplication(scope.row)"
                      >付款申请</el-button>
                      <el-button
                        size="mini"
                        type="primary"
                        v-if="isAsysbusiness && scope.row.billType == 1 && scope.row.settleStatus == 0 && (scope.row.payApprovalStatus == 2) && scope.row.approvalPromoter === userInfo.id && authorityBtn.includes('asystem_finance_1024')"
                        @click.stop="cancelPaymentApplication(scope.row)"
                      >撤销</el-button>
                      <el-button
                        size="mini"
                        type="danger"
                        :disabled="scope.row.factAmount > 0 ||  scope.row.billSource!=1 || scope.row.settleStatus!=0 || scope.row.settleStatus==3 || scope.row.billSource == 6"
                        v-if="authorityBtn.includes('asystem_finance_1005')"
                        @click.stop="delItem(scope.row)"
                      >删除</el-button>
                    </template>
                </el-table-column>
            </d-table>
            <!-- 底部悬浮层 -->
            <div class="bill-footer" :class="{active:isShirk==true}">
                <i class="bill-footer-shirk el-icon-arrow-down" :title="(isShirk?'展开':'收缩')+'数据统计'" @click="isShirk = !isShirk"></i>
                <bill-footer :params="queryForm" :class="{billFooterMain:isShirk==true}"></bill-footer>
            </div>
        </div>
        <!-- 新增账单弹出 -->
        <side-popup :visible.sync="addBillVisible" title="新增账单" width="800px">
            <bill-add :visible.sync="addBillVisible" @submit="tableReload" v-if="addBillVisible"></bill-add>
        </side-popup>
        <!-- 账单详情弹出 -->
        <side-popup :visible.sync="billInfoVisible" :modal="false" title="账单信息" width="800px">
            <span slot="header">
                <el-button
                    size="mini"
                    v-if="billRowData.systemCode != '-1' && authorityBtn.includes('asystem_finance_1018')"
                    @click="dunningFbill"
                >付款单</el-button>
                <el-button
                    size="mini"
                    @click="saveLateFee"
                    v-if="!billRowData.ifLock && (!isAsysbusiness || (billRowData.billType !== 1 || (billRowData.payApprovalStatus === 1 || billRowData.payApprovalStatus === 3))) && authorityBtn.includes('asystem_finance_1019')"
                >收滞纳金</el-button>
                <el-button
                    size="mini"
                    @click="closeFbill"
                    v-if="!billRowData.ifLock && (!isAsysbusiness || (billRowData.billType !== 1 || (billRowData.payApprovalStatus !== 2))) && authorityBtn.includes('asystem_finance_1020') && billRowData.billSource != 6"
                >关闭账单</el-button>
            </span>
            <bill-info
                v-if="billInfoVisible"
                :billCodeInfo="billCodeInfo"
                :billIdInfo="billIdInfo"
                @submit="tableReload"
            ></bill-info>
        </side-popup>
        <!-- 操作弹出框 -->
        <el-dialog
            :title="dialogInfo.title"
            :visible.sync="dialogInfo.visible"
            v-dialogDrag
            :append-to-body="true"
            :close-on-click-modal="false"
            top="20px"
            :width="dialogInfo.width">
            <!--dialogInfo.component 切换组件
                dialogInfo prop数据
            @submit  刷新列表-->
            <component
                :queryForm="queryForm"
                :is="dialogInfo.component"
                :dialogInfo="dialogInfo"
                v-if="dialogInfo.visible"
                @submit="tableReload"
            ></component>
        </el-dialog>
        <side-popup :visible.sync="businessDunningVisible" title="催缴" width="800px">
          <business-dunning :visible.sync="businessDunningVisible" :bill-info="currentBillInfo" v-if="businessDunningVisible"></business-dunning>
        </side-popup>
        <side-popup :visible.sync="paymentApplicationVisible" title="付款申请" width="800px">
          <payment-application :visible.sync="paymentApplicationVisible" :projectList="projectList"  :bill-info="currentBillInfo" @submit="tableReload" v-if="paymentApplicationVisible"></payment-application>
        </side-popup>
    </div>
</template>
<script>
    import billAdd from "./bill-add"; //新增账单组件
    import billBulkprint from "./bill-bulkprint"; //新增账单组件
    import billInfo from "./bill-info"; //账单详情
    import billFilter from "./bill-filter"; //筛选组件
    import billDunning from "./bill-dunning"; //催缴组件
    import billFooter from "./bill-footer"; //账单列表底部浮层
    import businessDunning from './business-dunning'
    import paymentApplication from './payment-application'

    let baseURL = window.g.ApiUrl;
    export default {
        // components
        components: {
            billAdd,
            billInfo,
            billFilter,
            billDunning,
            billFooter,
            billBulkprint,
            businessDunning,
            paymentApplication
        },
        // props
        // data
        data () {
            return {
                userInfo: this.$local.fetch('userInfo'),
                syscode:this.$local.fetch("userInfo").syscode, //系统编码
                authorityBtn: this.$local.fetch("authorityBtn").asystem_finance || [],
                currentBillInfo: {},
                billIdInfo: "",
                billCodeInfo: "", //帐单编号查询
                multipleSelection: [], //当前表格多选
                // 弹出框信息
                dialogInfo: {
                    title: '',// 弹出框标题
                    width: '',// 弹出框宽度
                    component: '',//组件切换
                    data: '', //传值的数据
                },
                addBillVisible: false, //新增账单弹框标识
                billInfoVisible: false, //账单详细标识
                billRowData: {}, //当前账单行数据
                isFundIndeterminate:false, // 款项样式
                isUnclearIndeterminate:false, // 未结清样式
                businessDunningVisible: false, // 催缴页面
                paymentApplicationVisible: false, // 付款申请页面
                // 收付款筛选数据
                revenueData:[
                    {label:'租客应收',value:1,count:0,},
                    {label:'租客应付',value:2,count:0,},
                    {label:'业主应收',value:3,count:0,},
                    {label:'业主应付',value:4,count:0,},
                    {label:'其他',value:5,count:0,},
                ],
                // 审核状态数据
                payApprovalStatusList:[
                  {label:'新增',value:1},
                  {label:'审核中',value:2},
                  {label:'驳回',value:3},
                  {label:'审核通过',value:4},
                ],
                // 未结清筛选数据
                unclearedData:[
                    {label:'本期',value:1,count:0,key:'currentPeriodCount'},
                    {label:'逾期',value:2,count:0,key:'overdueCount'},
                    {label:'退租',value:3,count:0,key:'terminationCount'},
                    {label:'自建',value:4,count:0,key:'manualCount'},
                ],
                // 项目列表，托管系统用
                projectList: [],
                queryForm: {
                    //筛选表单
                    revenueArray:[1,2,3,4,5], // 付款方快捷检索条件
                    unclearedArray:[1], // 未结清快捷检索条件
                    billCode: "", // 账单编号
                    contractCode:"",// 合同号
                    accountName: "", // 对方名称
                    communityName: "", // 楼盘名称
                    feeType: "", //费用类型
                    projectId: '', // 项目id
                    overDays: "", //逾期状态
                    settleStatus: "9", //结清状态 0 未结清 1 已结清，2已关闭 9 全部
                    payApprovalStatus: '', // 审核状态
                    payStartDate: "",
                    payEndDate: "",
                    paymentRange:'',//最近收/付款日期 范围
                    feeStartbeginDate: "", // 计费周期起始时间的开始时间
                    feeStartFinishDate: "", // 计费周期起始时间的结束时间
                    feeEndbeginDate: "", // 计费周期结束时间的开始时间
                    feeEndFinishDate: "", // 计费周期结束时间的结束时间
                    sidx: "",
                    order: "",
                    limit: 15,
                    page: 1,
                    systemCode:this.$local.fetch('userInfo').syscode,
                    dissolutionType: "", // 解约状态
                    isZero: 0
                },
                isShirk:false, //是否显示金额统计

            };
        },
        computed: {
            // 账单来源类型
            billSourceType(){
                return {
                    0: '合同生成',
                    1: '手动添加',
                    2: '物业生成',
                    3: '退租结算',
                    4: '服务订单',
                    5: '合同手动添加',
                    6: '酒店自动生成',
                    7: '房态入账生成'
                }
            },
            isRentSystem(){
                return this.$local.fetch('userInfo').syscode == 'asystem';
            },
            isAsyshotel(){
                return this.$local.fetch('userInfo').syscode == 'asyshotel';
            },
            isAsysbusiness() {
              return this.$local.fetch('userInfo').syscode === 'asysbusiness';
            }
        },
        // created
        created () {
            // 根据条件统计客户账单数量
            this.queryFbillClientTypeStatistics(this.queryForm)
            // 根据条件统计客户账单数量
            this.getFbillUnclearedStatistics(this.queryForm)
            this.isAsysbusiness && this.getProjectList();
        },
        // mounted
        // activited
        // update
        // beforeRouteUpdate
        // metods
        methods: {
            //导出
            exportTable () {
                // let strParams = `token=${localStorage.token}&finger=${localStorage.finger}&`

                // for(let key in this.queryForm){
                //     if(this.queryForm[key] instanceof Array){
                //         this.queryForm[key].forEach(item => {
                //            strParams += `${key}=${item}&`
                //         })
                //     }else{
                //         strParams += `${key}=${this.queryForm[key]}&`
                //     }
                // }


                // let url = baseURL.seeFinanceService + "/fbill/exportFbill?" + strParams;;
                // window.location.href = url;
                let ids = this.multipleSelection.map(item => item.id) || [];
                let params = this.queryForm
                ids.length && (params.ids = ids);
                this.$api.seeFinanceService.downloadExportFbill(params).then(res => {
                    this.$store.commit('setIsDownShow', true);
                })


            },
            // 切换账单类型
            // tabsHandle (data) {
            //     //判断查询
            //     if (this.queryForm.billType == 0) {
            //         this.queryForm.settleStatus = "0";
            //         this.costChange = "实收费用";
            //     } else if (this.queryForm.billType == 1) {
            //         this.queryForm.settleStatus = "0";
            //         this.costChange = "实付费用";
            //     } else {
            //         this.queryForm.settleStatus = " ";
            //         this.timeChange = "应收/付时间";
            //         this.costChange = "实收/付费用";
            //     }
            //     this.tableReload()
            // },
            //款项全选
            // checkAllFund(val){
            //     console.log(val);
            //     this.queryForm.revenueArray = val ? [1,2,3,4,5] : [];
            //     // this.isFundIndeterminate = false
            // },
            // 款项查询
            checkedFund(val){
                // let checkedCount = val.length;
                // this.checkAll = checkedCount === 5;
                // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
                this.tableReload()
            },
            // 未结清全选
            // checkAllUnclear(){

            // },
            // 未结清查询
            checkedUnclear(val){
                this.tableReload()
            },

            //批量删除 和删除
            delItem (row) {
                let ids = []
                if (row == 'all') {
                    //如果 row =='all' 是批量删除
                    for (let item of this.multipleSelection) {
                        if (item.factAmount > 0 || item.billSource != 1 || item.settleStatus != 0 || item.settleStatus == 3) {
                            this.$message.error('选中的有不能删除的账单')
                            return false
                        } else {
                            ids.push(item.id);
                        }
                    }
                } else {
                    ids = [row.id]
                }
                this.$confirm("此操作将永久删除, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    center: true
                })
                    .then(() => {
                        this.$api.seeFinanceService.delBillList({ ids: ids })
                        .then(res => {
                            // 刷新列表
                            this.tableReload()
                            // 清空多选
                            this.multipleSelection = [];
                        });
                    })
                    .catch(() => {
                        this.$message('已取消删除');
                    });
            },
            // 批量打印
            bulkPrintBill(){
                this.dialogInfo = {
                    visible: true,
                    title: '批量打印账单',// 弹出框标题
                    width: '1120',// 弹出框宽度
                    component: 'billBulkprint',//组件切换
                    data: this.multipleSelection, //传值的数据
                }
            },
            getProjectList() {
              return this.$api.seeTenementBusinessService.projectDropDownList({}).then(res => {
                this.projectList = res.data
              })
            },
            // 初始化数据
            tableReload (page = '') {
                // 表格数据刷新
                page && (this.queryForm.page = page);
                this.$refs.billTable.reload(page)
                // 根据条件统计客户账单数量
                this.queryFbillClientTypeStatistics(this.queryForm)
                // 根据条件统计客户账单数量
                this.getFbillUnclearedStatistics(this.queryForm)

            },

            billState (row) {
                //账单类型判断
                if (row.billType == 0) {
                    return "收款";
                } else if (row.billType == 1) {
                    return "付款";
                }
            },
            overDaysState (row) {
                //逾期状态判断
                if (row.overDays == 0) {
                    return "正常";
                } else if (row.overDays > 0) {
                    return "逾期(" + row.overDays + "天)";
                }
            },
            //根据条件统计客户账单数量
            queryFbillClientTypeStatistics(params){
                this.$api.seeFinanceService.queryFbillClientTypeStatistics(params)
                .then(res=>{
                    let data = res.data || []
                    // 数据对象
                    let objectData = {}
                    data.forEach(item => {
                        objectData[item.billClientType] = item.totalCount
                    })
                    // 根据数据value值获取收付款count
                    this.revenueData.forEach(item => {
                        item.count = objectData[item.value] || 0
                    })
                })
            },
            //未结清快捷检索条件账单数量统计
            getFbillUnclearedStatistics(params){
                this.$api.seeFinanceService.getFbillUnclearedStatistics(params)
                .then(res=>{
                    let data = res.data || {}
                    // 根据数据key值获取未结清count
                    this.unclearedData.forEach(item => {
                        item.count = data[item.key] || 0
                    })
                })
            },
            //批量选择
            handleSelectionChange (val) {
                this.multipleSelection = val;
            },
            //新增账单
            addBillHandle () {
                this.addBillVisible = true;
            },
            //账单详情
            viewBillInfo (row) {
                this.billRowData = row
                this.billCodeInfo = { billCode: row.billCode };
                this.billIdInfo = { billId: row.id };
                this.billInfoVisible = true;
            },
            // 催缴账单
            dunningFbill () {
                this.dialogInfo = {
                    visible: true,
                    title: '费用付款单',// 弹出框标题
                    width: '550',// 弹出框宽度
                    component: 'billDunning',//组件切换
                    fbillId: this.billIdInfo.billId,
                    data: this.billRowData, //传值的数据
                }
            },
            // 收滞纳金
            saveLateFee () {
                this.$prompt('滞纳金金额：', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    let params = {
                        id: this.billIdInfo.billId,
                        lateFeeMoney: value,
                    }
                    this.$api.seeFinanceService.saveLateFee(params)
                        .then(res => {
                            //  console.log('关闭成功')
                        })
                }).catch(() => { });
            },
            // 关闭账单
            closeFbill () {
                this.$prompt('请输入关闭意见', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    let params = {
                        id: this.billIdInfo.billId,
                        settleStatus: 2,
                        notes: value
                    }
                    this.$api.seeFinanceService.closeFbill(params)
                        .then(res => {
                            // 关闭账单详情窗口
                            this.billInfoVisible = false
                            this.tableReload()
                            //  console.log('关闭成功')
                        })
                }).catch(() => { });
            },
            // 处获取格数据房间信息
            getHouseNumber (houseStr) {
                let str = '';
                if (houseStr) {
                    let arr = JSON.parse(houseStr);
                    arr.forEach((item, index) => {
                        let build = item.bulidingBlock || ''
                        let unit = item.unitInfoName || ''
                        let room = item.roomNum || ''
                        let s = build + '-' + unit + '-' + room
                        if (!index) {
                            str = s;
                        }
                        else {
                            str += ',' + s
                        }
                    })
                }
                return str;
            },
            // 获取表格数据楼盘名称
            getCommunityName (houseStr) {
                let houseArray = JSON.parse(houseStr) || []
                let str = '-'
                if (houseArray.length) {
                    str = houseArray[0].communityName || '-'
                }
                return str;
            },
            // 开启催缴
            startBusinessDunning(row) {
                this.currentBillInfo = {...row}
                this.businessDunningVisible = true;
            },
            // 开启付款申请
            startPaymentApplication(row) {
                this.currentBillInfo = {...row}
                this.paymentApplicationVisible = true;
            },
            // 撤销付款申请
            cancelPaymentApplication(row) {
              this.$confirm('流程正在审核中，是否确定要撤销?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
              }).then(() => {
                return this.$api.seeFinanceService.payBillPayCancel(row.id)
              }).then(() => {
                this.tableReload()
              })
            },
            // 格式化结清状态
            formatSettleStatus (row) {
                if ( row.settleStatus == 0) {
                  let status = '未结清'

                  // 项目托管系统付款需要审批
                  if (this.isAsysbusiness && row.billType == 1) {
                    if([1, 2, 3].includes(row.payApprovalStatus) ) {
                      status += '(' + this.payApprovalStatusList.find(item => item.value === row.payApprovalStatus).label + ')'
                    }
                  }

                  return status
                } else if (row.settleStatus == 1) {
                    return '已结清'
                } else if (row.settleStatus == 2) {
                    return '已关闭'
                } else if (row.settleStatus == 3) {
                    return  '转退租结算'
                }
            },
        },
        // filter
        // computed
        watch: {
        }

    };
</script>
<style scoped>
    /deep/ .el-table:before{
        background: transparent;
    }
    /deep/ .el-pagination{
        border-top: 1px solid #e5e5e5;
    }
    .bill-footer{
        padding:5px 10px;
        box-sizing: border-box;
        height: 120px;
        background:#fff;
        box-shadow: 0 0 5px rgba(0,0,0,.1);
        border-top:1px solid #efefef;
        position: relative;
        transition:all .2s;
        overflow: hidden;
    }
    .bill-footer-shirk{
        cursor: pointer;
        position:absolute;
        width: 80px;
        height: 16px;
        font-size: 16px;
        line-height: 16px;
        text-align: center;
        color:#333;
        background:#e4e7ed;
        border-radius: 0 0 8px 8px;
        left: 0;
        right: 0;
        margin: 0 auto;
        top: 0;
        transition:all .2s
    }
    .bill-footer.active{
        height: 18px;
        padding: 0;
        border:none;
        box-shadow: none;
    }
    .bill-footer.active .billFooterMain{
        height: 0;
        transform:scale(1,0)
    }
    .bill-footer.active .bill-footer-shirk{
        top: 0px;
        transform:rotateX(180deg)
    }

    .handle-filter {
        position: absolute;
        right: 5px;
        top: -60px;
    }
</style>

