<!--
/**
* 财务管理：项目组托管系统-催缴
* @author yanchao
* @date 2019-11-13 17:16:31
**/
-->
<template>
    <el-form :model="dunningForm" :rules="dunningFormRules" ref="dunningForm" v-loading="loading">
      <form-card>
        <el-row>
          <el-col :span="12">
            <el-form-item label="反馈类型" prop="dunningType">
              <el-select v-model="dunningForm.dunningType" size="small" style='width:100%' placeholder="请选择">
                <el-option label="正常" value="1"></el-option>
                <el-option label="退租" value="2"></el-option>
                <el-option label="有问题" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="反馈详情" prop="detail">
            <el-input v-model="dunningForm.detail" type="textarea" style='width:100%' :rows="5" placeholder="请选择" maxlength="300" show-word-limit>
            </el-input>
          </el-form-item>
        </el-row>
      </form-card>

      <el-row class="pt35">
        <el-col :span='24' class='ac'>
          <el-button @click="cancelForm()" size='small' >取消</el-button>
          <el-button type="primary" @click="submitForm()" size='small' >提交</el-button>
        </el-col>
      </el-row>
    </el-form>
</template>
<script>

export default {
  components: {
  },
  props: ['billInfo'],
  data() {
    return {
      loading: false,
      dunningForm: {
        dunningType: '',
        detail: ''
      },
      dunningFormRules: {
        dunningType: [ { required: true, message: "请选择反馈类型", trigger: "blur" }]
      }
    };
  },
  computed: {
  },
  methods: {
    cancelForm() {
      this.$emit("update:visible", false)
    },
    submitForm() {
      this.$refs.dunningForm.validate(valid => {
        if (valid) {
          this.loading = true
          return this.$api.seeFinanceService.receiveBillDunning({
            ...this.dunningForm,
            billId: this.billInfo.id
          }).then(_ => {
            this.$emit("update:visible", false)
            this.$emit("submit");
          }).finally(() => {
            this.loading = false;
          })
        }
      })
    }
  }
};
</script>
<style lang="scss">

</style>
