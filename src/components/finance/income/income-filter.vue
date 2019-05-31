<!--财务组件：财务管理-发票记录筛选
/**
* 财务组件：财务管理-发票记录-筛选
* @/components/finance/invoice/invoice-filter.vue 组件存放位置
* @author web-王晓冬
* @date 2018年10月18日
**/
-->
<template>
  <!-- 筛选对话框 -->
  <el-popover
      placement="bottom"
      width="300"
      v-model="filterFlag"
      trigger="click">
      <el-form :model="params" ref="params" label-width="80px">
            <div class='ar mt10 d-text-blue' @click="resetFormItem('params')">清空筛选</div>
            <el-form-item label="流水筛选" class='mb5' prop='incomeWaterCode'>
                <el-input type="text" v-model.trim="params.incomeWaterCode" placeholder='请输入流水号' style='width:100%' size='mini'></el-input>
            </el-form-item>

            <el-form-item label="对方名称" class='mb5' prop='accountName'>
                <el-input type="text" v-model.trim="params.accountName"  placeholder='请输入名称' style='width:100%' size='mini'></el-input>
            </el-form-item>

            <el-form-item class='mb5' label="楼盘名称" prop="communityName">
                <el-input
                    type="text"
                    v-model.trim="params.communityName"
                    placeholder="请输入楼盘名称"
                    style="width:100%"
                    size="mini"
                ></el-input>
            </el-form-item>

            <el-form-item label="费用类型" style='width:100%' size='mini' prop='feeType' class='mb5'>
                <d-select v-model="params.feeType"  placeholder='请选择费用类型' valueKey="code" size="mini" dicCode='ZD_FY_LX'>
                </d-select>
            </el-form-item>

            <el-form-item label="收支状态" style='width:100%' size='mini' prop='incomeTypes' class='mb5'>
                <el-checkbox-group v-model="params.incomeTypes">
                    <el-checkbox label="0">收入</el-checkbox>
                    <el-checkbox label="1">支出</el-checkbox>
                </el-checkbox-group>
            </el-form-item>

            <el-form-item label="匹配状态" style='width:100%' size='mini' prop='matchStates' class='mb5'>
                <el-checkbox-group v-model="params.matchStates">
                    <el-checkbox label="0">未匹配</el-checkbox>
                    <el-checkbox label="1" style='margin-left:0px'>部分匹配</el-checkbox>
                    <el-checkbox label="2" style='margin-left:0px'>全部匹配</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="入账日期" size='mini' class='mb5' prop='accountDateArry'>
                <el-date-picker 
                style='width:100%' 
                v-model="params.accountDateArry" 
                type="daterange" 
                value-format='timestamp' :picker-options="$pickerOptionsRange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                </el-date-picker>
            </el-form-item>

            <div class='ac'>
                <el-button type="primary" @click="submitForm('params')" size='mini'>确定</el-button>
                <el-button @click="resetForm('params')" size='mini'>取消</el-button>
            </div>
        </el-form>
        <el-button size="small" class="ml5" type="text" slot="reference"><i class="iconfont icon-filter mr20" ></i></el-button>
  </el-popover>
</template>
<script>
export default {
  // components
  components: {
  },
  props:['params'],
  // data
  data() {
    return {
      filterFlag:false
    };
  },
  // created
  created() {

  },
  // mounted
  // activited
  // update
  // beforeRouteUpdate
  // metods
  methods: {
    //清空筛选条件
    resetFormItem(formName) {
      this.$refs[formName].resetFields();
    },
    //取消筛选
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.filterFlag = false;
    },
    //筛选提交
    submitForm(formName) {
      this.filterFlag = false
      this.$emit('submit')
    },
  },
  // filter
  // computed
  watch: {
    'params.accountDateArry':function(time){
      if(time.length){
        this.params.accountBeginDate = time[0]
        this.params.accountEndDate = time[1]
      }
    }
  }
};
</script>
<style scoped>
    .handle-filter{ position:absolute; right: 5px; top:0px}
</style>

