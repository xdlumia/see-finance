<!--财务组件：财务-账单管理-筛选
/**
* 财务组件：财务-账单管理-筛选
* @/components/finance/bill/index.vue 组件存放位置
* @author web-王晓冬
* @date 2018年10月18日
**/
-->
<template>
    <!-- 筛选对话框 -->
    <el-popover placement="bottom" width="390" v-model="filterFlag" trigger="click">
        <el-form :model="params" ref="params" size="mini" label-width="125px">
            <div class="ar mt10 d-text-blue d-pointer" @click="resetFormItem('params')">清空筛选</div>
            <el-form-item label="账单筛选" prop="billCode">
                <el-input
                    type="text"
                    v-model.trim="params.billCode"
                    style="width:100%"
                    placeholder="请输入账单编号"
                    size="mini"
                ></el-input>
            </el-form-item>
            <el-form-item label="合同号" prop="contractCode">
                <el-input
                    type="text"
                    v-model.trim="params.contractCode"
                    style="width:100%"
                    placeholder="请输入合同号"
                    size="mini"
                ></el-input>
            </el-form-item>
            <el-form-item label="对方名称" prop="accountName">
                <el-input
                    type="text"
                    v-model.trim="params.accountName"
                    placeholder="请输入名称"
                    style="width:100%"
                    size="mini"
                ></el-input>
            </el-form-item>
            <el-form-item label="楼盘名称/房间地址" prop="communityName">
                <el-input
                    type="text"
                    v-model.trim="params.communityName"
                    placeholder="请输入楼盘名称/房间地址"
                    style="width:100%"
                    size="mini"
                ></el-input>
            </el-form-item>
            <el-form-item label="费用类型" style="width:100%" size="mini" prop="feeType">
                <el-select
                    v-model="params.feeType"
                    placeholder="请选择费用类型">
                    <el-option label="全部" value=""></el-option>
                    <el-option
                        :label="item.content"
                        :value="item.code"
                        v-for="(item,index) of dictionaryOptions('ZD_FY_LX')"
                        :key="index"
                    ></el-option>
                </el-select>
                <!-- <d-select
                    placeholder="请选择费用类型"
                    v-model="params.feeType"
                    valueKey="code"
                    size="mini"
                    dicCode="ZD_FY_LX"
                ></d-select> -->
            </el-form-item>
            <el-form-item label="逾期状态" style="width:100%" size="mini" class="mb5" prop="overDays">
                <el-select v-model="params.overDays" style="width:100%" placeholder="请选择逾期状态">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="逾期" value="2"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item
                label="结清状态"
                style="width:100%"
                size="mini"
                class="mb5"
                prop="settleStatus"
            >
                <el-select v-model="params.settleStatus" style="width:100%" placeholder="请选择结清状态">
                    <el-option label="未结清" value="0"></el-option>
                    <el-option label="已结清" value="1"></el-option>
                    <el-option label="关闭" value="2"></el-option>
                    <el-option label="转退租结算" value="3"></el-option>
                    <el-option label="全部" value="9"></el-option>
                </el-select>
            </el-form-item>

            <!-- <el-form-item label="账单类型" style='width:100%'  size='mini'  class='mb5' prop='billType'>
              <el-select v-model="params.billType" style='width:100%' placeholder="请选择账单类型">
                  <el-option label="收款" value="0"></el-option>
                  <el-option label="付款" value="1"></el-option>
                  <el-option label="全部" value="9"></el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item label="计费周期开始时间" size="mini" class="mb5" prop="feeStartArr">
                <el-date-picker
                    style="width:100%"
                    v-model="feeStartArr"
                    type="daterange"
                    value-format="timestamp"
                    :picker-options="$pickerOptionsRange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="计费周期结束时间" size="mini" class="mb5" prop="feeEndArr">
                <el-date-picker
                    style="width:100%"
                    v-model="feeEndArr"
                    type="daterange"
                    value-format="timestamp"
                    :picker-options="$dateOptionsAfter"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="最近收/付款日期" size="mini" class="mb5" prop="accountDateArry">
                <el-date-picker
                    style="width:100%"
                    v-model="accountDateArry"
                    type="daterange"
                    value-format="timestamp"
                    :picker-options="timeFilter"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                ></el-date-picker>
            </el-form-item>
            <el-form-item label="最近收/付款日期" size="mini" class="mb5" prop="accountDateArry">
                <el-select v-model="params.paymentRange" placeholder="请选择">
                    <el-option
                    v-for="(item,index) of paymentRangeOption"
                    :key="index"
                    :label="item.label"
                    :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-row>
                <el-col :span="24" class="ac">
                    <el-button type="primary" @click="saveForm('params')" size="mini">保存快捷筛选</el-button>
                    <el-button type="primary" @click="submitForm('params')" size="mini">确定</el-button>
                    <el-button @click="resetForm('params')" size="mini">取消</el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-button size="small" class="ml5" type="text" slot="reference">
            <i class="iconfont icon-filter mr20"></i>
        </el-button>
    </el-popover>
</template>
<script>
    export default {
        // components
        components: {
        },
        props: ['params'],
        // data
        data () {
            return {
                filterFlag: false,
                // 最近收付款范围
                paymentRangeOption:[{
                    label:'后一周',
                    code:7,
                },{
                    label:'后二周',
                    code:14,
                },{
                    label:'后一月',
                    code:30,
                },{
                    label:'后三月',
                    code:90,
                }],
            };
        },
        // created
        created () {
            this.getFilterInfo()
        },
        // mounted
        // activited
        // update
        // beforeRouteUpdate
        // metods
        methods: {
            //清空筛选条件
            resetFormItem (formName) {
                this.accountDateArry = []
                this.feeStartArr = []
                this.feeEndArr = []
                this.$refs[formName].resetFields();
            },
            //取消筛选
            resetForm (formName) {
                this.accountDateArry = []
                this.feeStartArr = []
                this.feeEndArr = []
                this.$refs[formName].resetFields();
                this.filterFlag = false;
            },
            //筛选提交
            submitForm (formName) {
                this.$emit('submit')
            },
            // 保存快捷筛选
            saveForm(){
                let params = {
                    pageCode:'bill',
                    sysCode:this.$local.fetch('userInfo').syscode,
                    queryCondition:JSON.stringify(this.params),
                }
                this.$api.bizSystemService.saveFilter(params)
                .then(res=>{
                    // 保存成功
                })
            },
            // 查询快捷筛选
            getFilterInfo(){
                let params = {
                    pageCode:'bill',
                    sysCode:this.$local.fetch('userInfo').syscode,
                }
                this.$api.bizSystemService.getFilterInfo(params)
                .then(res=>{
                    let data = res.data || {}
                    if(data.queryCondition){
                        let queryCondition = JSON.parse((data.queryCondition || '')) || {}
                        for(let key in this.params){
                            if(key == 'page' || key == 'limit'){
                                this.params[key] = this.params[key]
                            }else if(key == 'payStartDate' || key == 'payEndDate'){
                                var start = new Date();
                                // this.params['payStartDate'] = start //开始时间
                                // this.params['payEndDate'] = start.getTime() + 3600 * 1000 * 24 * queryCondition['paymentRange'] //结束时间
                                
                                let end = start.getTime() + 3600 * 1000 * 24 * queryCondition['paymentRange'] //结束时间
                                this.accountDateArry = [start,end]
                            }else if(key =='revenueArray' || key =='unclearedArray'){
                                this.params[key] = queryCondition[key] || []
                            }
                            else{
                                this.params[key] = queryCondition[key]
                            }
                        }
                        // 加载完成重新获取数据
                        this.$emit('submit')
                    }
                })
            },
        },
        // filter
        computed: {
            /**
             * 将表单中的日期数组字段迁移出来
             * 原因：表单元素提交数据时不需要提交下列字段
             */
            // 收/付款日期数组
            accountDateArry: {
                get () {
                    let arr = []
                    if (this.params.payStartDate && this.params.payEndDate) {
                        arr[0] = this.params.payStartDate
                        arr[1] = this.params.payEndDate
                    }
                    return arr
                },
                set (arr) {
                    if (arr) {
                        this.params.payStartDate = arr[0];
                        this.params.payEndDate = arr[1];
                    }else{
                        this.params.payStartDate = ''
                        this.params.payEndDate = ''
                    }
                }
            },
            // 计费周期开始时间数组
            feeStartArr: {
                get () {
                    let arr = []
                    if (this.params.feeStartbeginDate && this.params.feeStartFinishDate) {
                        arr[0] = this.params.feeStartbeginDate
                        arr[1] = this.params.feeStartFinishDate
                    }
                    return arr
                },
                set (arr) {
                    if (arr) {
                        this.params.feeStartbeginDate = arr[0];
                        this.params.feeStartFinishDate = arr[1];
                    }else{
                        this.params.feeStartbeginDate = ''
                        this.params.feeStartFinishDate = ''
                    }
                }
            },
            // 计费周期结束时间数组
            feeEndArr: {
                get () {
                    let arr = []
                    if (this.params.feeEndbeginDate && this.params.feeEndFinishDate) {
                        arr[0] = this.params.feeEndbeginDate
                        arr[1] = this.params.feeEndFinishDate
                    }
                    return arr
                },
                set (arr) {
                    if (arr) {
                        this.params.feeEndbeginDate = arr[0];
                        this.params.feeEndFinishDate = arr[1];
                    }else{
                        this.params.feeEndbeginDate = ''
                        this.params.feeEndFinishDate = ''
                    }
                }
            },
            // 时间框快捷筛选
            timeFilter(){
                let shortcuts = [].concat(...this.$pickerOptionsRange.shortcuts, ...this.$dateOptionsAfter.shortcuts);
                return {
                    shortcuts
                };
            }
        },
        watch: {
        }
    };
</script>
<style scoped>
    .handle-filter {
        position: absolute;
        right: 5px;
        top: 0px;
    }
</style>

