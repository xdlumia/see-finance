<!--财务组件：财务主页
/**
* 财务组件：财务主页
* @/components/finance/index.vue 组件存放位置
* @author web-王晓冬
* @date 2018年10月18日
**/
-->
<template>
    <div class='d-content' style="height: calc(100vh - 80px)">
        <el-tabs v-model="isComponent" type="card">
            <el-tab-pane label="账单管理" name="bill" v-if="authorityBtn.includes('asystem_finance_1001')"></el-tab-pane>
            <el-tab-pane label="收支流水" name="income" v-if="authorityBtn.includes('asystem_finance_1006')"></el-tab-pane>
            <el-tab-pane label="发票记录" name="invoice" v-if="authorityBtn.includes('asystem_finance_1013')"></el-tab-pane>
            <el-tab-pane label="收据记录" name="receipt" v-if="authorityBtn.includes('asystem_finance_1014')"></el-tab-pane>
        </el-tabs>
        <component :is="isComponent"></component>
    </div>
</template>
<script>
import bill from "./bill/index"; //收支流水组件
import income from "./income/index"; //收支流水
import invoice from "./invoice/index"; //发票记录
import receipt from "./receipt/index"; //收据记录
export default {
  // components
  components: {
    bill,
    income,
    invoice,
    receipt,
  },
  // props
  // data
  data() {
    return {
      isComponent:'bill',
      billFlag: true,
      financeFlag: false,
      authorityBtn: this.$local.fetch("authorityBtn").asystem_finance || []
    };
  },
  // created
  // mounted
  // activited
  // update
  // beforeRouteUpdate
  // metods
  methods: {
    // handleClick(tab, event) {
    //   // console.log(tab.index);
    //   if (tab.index == 0) {
    //     this.billFlag = true;
    //     this.financeFlag = false;
    //   } else if (tab.index == 1) {
    //     this.billFlag = false;
    //     this.financeFlag = true;
    //   }
    // }
  }
  // filter
  // computed
};
</script>
<style scoped>
</style>