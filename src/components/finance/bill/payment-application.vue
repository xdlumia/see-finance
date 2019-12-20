<!--
/**
* 财务管理：项目托管系统-付款申请
* @author yanchao
* @date 2019-11-13 17:16:31
**/
-->
<template>
  <div v-loading="loading">
    <el-form :model="billInfo" :rules="paymentFormRules" size="small" :disabled="true" ref="paymentForm">
      <form-card class="mt10">
        <label class="b p5">
          房源信息
        </label>
        <el-row v-if="roomInfoArray.length">
          <el-col>
            <el-form-item label="房间" prop="houseArray" >
              <el-input v-for="(roomInfo, index) in roomInfoArray" :index="index" :value="roomInfo" class="mb5">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请人" prop="userName">
              <el-input  :value="userInfo.userName">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptName">
              <el-input  :value="userInfo.deptName">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目" prop="projectName">
              <el-input  :value="projectName">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账单编号" prop="billCode">
              <el-input  :value="billInfo.billCode">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <label class="b p5">
          付款明细
        </label>
        <el-row>
          <el-col :span="12">
            <el-form-item label="付款金额" prop="paymentType">
              <el-input  :value="billInfo.shouldPayMoney">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用类型" prop="paymentType">
              <el-input  :value="billInfo.feeType | dictionary('ZD_FY_LX')">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="应付日期" prop="paymentType">
              <el-input  :value="billInfo.payEndDate | timeToStr">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收款方" prop="paymentType">
              <el-input  :value="billInfo.accountName">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="备注" prop="detail">
              <el-input :value="billInfo.notes" type="textarea" style='width:100%' :rows="5" maxlength="300" show-word-limit>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </form-card>
    </el-form>

      <el-row class="pt35">
        <el-col :span='24' class='ac'>
          <el-button @click="cancelForm()" size='small' >取消</el-button>
          <el-button type="primary" @click="submitForm()" size='small' >提交</el-button>
        </el-col>
      </el-row>
  </div>
</template>
<script>

export default {
  components: {
  },
  props: ['billInfo', 'projectList'],
  data() {
    return {
      loading: false
    };
  },
  computed: {
    userInfo() {
      return this.$local.fetch("userInfo")
    },
    roomInfoArray() {
      return this.billInfo.houseArray ? JSON.parse(this.billInfo.houseArray).map((item) => {
        return item.communityName + '-' + (item.bulidingBlock ? item.bulidingBlock + '栋-' : '') + item.unitInfoName + '单元-' + item.labelFloor + '层-' + item.roomNum
      }): []
    },
    projectName() {
      let projectName = null;
      this.billInfo.projectId && (projectName = this.projectList.find((item) => item.projectId === this.billInfo.projectId)) && (projectName = projectName.projectName)

      return projectName;
    }
  },
  methods: {
    cancelForm() {
      this.$emit("update:visible", false)
    },
    submitForm() {
      this.loading = true
      this.$api.seeFinanceService.payBillPayApply(this.billInfo.id).then(_ => {
        this.$emit("update:visible", false)
        this.$emit("submit");
      }).finally(() => {
        this.loading = false
      })
    }
  }
};
</script>
<style scoped lang="scss">
  .el-row {
    .el-col {
      padding: 0 5px;
    }
  }

</style>
