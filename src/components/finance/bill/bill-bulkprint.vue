<!--财务组件-财务管理-批量打印
/**
* 财务管理：批量打印
* views\finance\bill\bill-bulkprint.vue.vue 组件存放位置
* @author web-王晓冬
* @date 2019年3月14日
**/
-->
<template>
    <div>
        <el-form :model="bulkPrinkForm" v-loading="loading" style="height: calc(100vh - 160px)" ref="bulkPrinkForm" size="small" label-width="100px" class="d-auto-y"  >
            <form-card title="选择基础信息">
                <el-form-item 
                    label="打印范围:"
                    :rules="{ required: false, message: '请选择打印范围'}"
                    prop="contractCode">
                    <el-radio-group v-model="bulkPrinkForm.rangeType">
                        <el-radio :label="0">全部打印</el-radio>
                        <el-radio :label="1">打印选中账单({{dialogInfo.data.length}}张)</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item 
                    label="生成方式:"
                    :rules="{ required: false, message: '请选择生成范围'}"
                    prop="contractCode">
                    <el-radio-group v-model="bulkPrinkForm.mannerType">
                        <el-radio :label="0">按账单生成</el-radio>
                        <el-radio :label="1">按租客生成</el-radio>
                    </el-radio-group>
                </el-form-item>
            </form-card>
            <form-card title="选择通知模板">
                <template-list v-model="bulkPrinkForm.templateId" source='bill-bulkprint' class="bill-bulk-print"></template-list>
            </form-card>
        </el-form>
        <div class="mt20 ac">
            <el-button size="small" @click="dialogInfo.visible = false">取消</el-button>
            <el-button type="primary" @click="submitForm()" size="small">批量生成&下载</el-button>
        </div>
    </div>
</template>
<script>
import templateList from "@/views/asistant/templateManage/index"; // 合同模板列表
export default {
  components: {
      templateList,
  },
  props:['dialogInfo','queryForm'],
  // data
  data() {
    return {
      loading:false,
      bulkPrinkForm: {
        templateId: "", // 模板id
        mannerType: 0, // 生成方式 (0按账单，1按租客)
        rangeType: 1, // 打印范围（0全部，1选中账单）
        ids: "", // 批量数据id
      },
    };
  },
  // created
  // mounted
  // activited
  // update
  // beforeRouteUpdate
  // metods
  methods: {
    // 新增表单提交
    submitForm(formName) {
      this.$refs.bulkPrinkForm.validate(valid => {
        if (valid) {
         // 验证模板id
          if(!this.bulkPrinkForm.templateId){
              this.$message({
                message: '请选择模板id',
                type: "warning",
                showClose: true
            });
            return
          }
          this.loading = true
          this.bulkPrinkForm.ids = this.dialogInfo.data.map(item =>item.id)
          let params = {}
          // 如果打印范围是选中账单
          if(this.bulkPrinkForm.rangeType == 1){
              params = this.bulkPrinkForm
          }
          // 如果打印范围是全部账单
          else if(this.bulkPrinkForm.rangeType == 0){
              params = Object.assign(this.bulkPrinkForm,this.queryForm)
          }
          //发送请求
          this.$api.seeFinanceService.betchPrintBill(params)
            .then(res => {
                // 打印数据
                window.open(res.data)
                // 关闭侧边栏
                this.dialogInfo.visible = false
                // 提交刷新
                this.$emit("submit", "reload");
            })
            .finally(()=>{
                this.loading = false
            })
        }
      });
    },
  }
  // filter
  // computed
};
</script>
<style scoped>
</style>
