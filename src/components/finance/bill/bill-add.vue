<!--财务组件-财务管理-新增账单组件：新增账单组件
/**
* 财务管理：新增账单组件
* @/components/finance/new-bill.vue 组件存放位置
* @author web-高鹏
* @date 2018年8月7日
**/
-->
<template>
    <div>
        <!-- 表单 -->
        <div class="popup-header">
            <el-button @click="$emit('update:visible', false)" size='small' class=''>取消</el-button>
            <el-button type="primary" @click="submitForm()" size='small' class=''>保存</el-button>
        </div>
        <el-form :model="newBillForm" v-loading="loading" :rules="rules" ref="newBillForm" size="small" label-width="100px" class="pr20 bill-add-box"  >
            <el-row :gutter="30">
                <el-col :span="12">
                    <el-form-item label="关联合同"
                    :rules="{ required: false, message: '请选择合同'}"
                    prop="contractCode"
                    style="height:32px">
                        <el-input placeholder="请输入姓名/合同编号" disabled v-model.trim="newBillForm.contractCode">
                            <el-button slot="append" icon="el-icon-search" @click='choiceContract()'></el-button>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="账单类型" prop="billType"  size='small' >
                        <el-radio :label="0" v-model="newBillForm.billType" >收款</el-radio>
                        <el-radio :label="1" v-model="newBillForm.billType" >付款</el-radio>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="对方名称" prop="accountName">
                        <el-input type="text" v-model.trim="newBillForm.accountName" placeholder="请输入名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="费用类型" prop="feeType" :rules="[{required:true,message:'请选择费用类型'}]">
                        <d-select
                            placeholder="请选择费用类型"
                            v-model="newBillForm.feeType"
                            valueKey="code"
                            size="mini"
                            dicCode='ZD_FY_LX'>
                        </d-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="账单金额" prop="amount"
                    :rules="[{required:true,message:'请输入账单金额'},{type:'price'}]">
                        <el-input type="text" v-model.trim="newBillForm.amount" placeholder="请输入金额"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系人" prop="linkman"
                    :rules="[{required:!isAsysbusiness,message:'请输入联系人'},{type:'name'}]">
                        <el-input type="text" v-model.trim="newBillForm.linkman" placeholder="请输入联系人"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系人方式" prop="linkmanPhone"
                    :rules="[{required:!isAsysbusiness,min:7,max:20,message:'请输入正确的联系方式'}]">
                        <el-input type="text" v-model.trim="newBillForm.linkmanPhone" placeholder="请输入联系人方式"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="应收/付时间" prop="payEndDate" :rules="[{required:true,message:'请选择时间'}]">
                        <el-date-picker
                        style='width:100%'
                        v-model="newBillForm.payEndDate"
                        value-format='timestamp'
                        type="datetime"
                        placeholder="请选择日期时间"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="计费周期" size='small' >
                        <el-date-picker
                            clearable
                            style='width:100%'
                            v-model="newBillForm.feeDateArray"
                            value-format='timestamp'
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="备注" prop="notes" size='small'  >
                        <el-input type="textarea" v-model.trim="newBillForm.notes" placeholder="请填写备注"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <upload-otherfile ref="fileInfo" :fileData="fileForm" />
                </el-col>
            </el-row>
        </el-form>
        <!-- 弹出合同选择对话框 -->
        <el-dialog title="选择合同" :visible.sync="dialogTableVisible" width='812px' center :append-to-body = "true">
            <el-input type="text" class="w240" size="mini" @keyup.13.native="$refs.contractTable.reload()" v-model.trim="contractFrom.matchingStr" placeholder="请输入租客/业主名称">
                <el-button class="el-icon-search" @click='$refs.contractTable.reload()' slot="append"></el-button>
            </el-input>
            <d-table
                class="mt5"
                v-if="dialogTableVisible"
                ref="contractTable"
                style="height:400px"
                size="mini"
                api="seeFinanceService.getChoiceContract"
                :params="contractFrom"
                @current-change="handleSelectionChange">
                <el-table-column
                label="合同编号"
                width="70"
                align='center'>
                <template slot-scope="scope">
                    <el-radio v-model="newBillForm.contractCode" :label="scope.row.contractCode">&nbsp;</el-radio>
                </template>
                </el-table-column>
                <el-table-column
                label="合同编号"
                prop="contractCode"
                width="180"
                align='center'>
                </el-table-column>
                <el-table-column
                align='center'
                label="租客/业主姓名"
                width="110">
                <template  slot-scope="scope">
                    <p v-if="scope.row.sourceCode == 'HT_LYBM-0'">{{ scope.row.firstParty}}</p>
                    <p v-else>{{ scope.row.secondParty }}</p>
                </template>
                </el-table-column>
                <el-table-column
                align='center'
                prop="address"
                show-overflow-tooltip
                label="房间地址">
                </el-table-column>
                <el-table-column
                align='center'
                :formatter="formatPeopleState"
                prop='sourceCode'
                width='80'
                label="合同来源">
                    <!-- <template slot-scope="scope">
                        {{scope.row.sourceCode | dictionary('HT_LYBM')}}
                    </template> -->
                </el-table-column>
                <el-table-column
                label="到期日期"
                width="120"
                align='center'>
                <template slot-scope="scope">
                    {{scope.row.endDate | timeToStr('YYYY-MM-DD')}}
                </template>
                </el-table-column>
                <el-table-column
                prop="state"
                align='center'
                width='120'
                label="合同状态"
                :formatter="formatState">
                </el-table-column>
            </d-table>
        </el-dialog>
    </div>
</template>
<script>
import uploadOtherfile from "./upload-otherfile"; //其他信息

export default {
  // components
  components: {
    uploadOtherfile
  },
  // props:[''],
  // data
  data() {
    return {
      loading:false,
      newBillForm: {
        billType: "", //账单类型
        contractCode: "", //合同编号
        systemCode: "", //合同来源
        accountName: "", //对方名称
        feeType: "", //费用类型
        amount: "", //账单金额
        factAmount: "", //应收/付费金额
        feeDateArray: [], //计费时间数组
        feeStartDate: "", //计费开始
        feeEndDate: "", //计费结束
        notes: "" //备注
      },
      fileForm: {
        filename: '',
        attachmentList: [],
        contractAttachment: ''
      },
      rules: {
        billType: [
          { required: true, message: "请输入账单类型", trigger: "blur" }
        ],
      },
      dialogTableVisible: false,
      // 合同请求参数
      contractFrom: {
        page: 1,
        limit: 10,
        matchingStr: ""
      }
    };
  },
  computed: {
    systemCodeNum () {
      let  code = this.$local.fetch('userInfo').syscode;

      return code === 'asyshotel' ? 9 : code === 'asysbusiness' ? 7 : 5
    },
    isAsysbusiness(){
        // 判断当前系统为集中式
        return this.$local.fetch('userInfo').syscode == 'asysbusiness';
    }
  },
  // created
  // mounted
  // activited
  // update
  // beforeRouteUpdate
  // metods
  methods: {
    formatState(row, column) {
      //收支状态转换
      if (row.state == -1) {
        return "已签约未执行";
      } else if (row.state == 0) {
        return "生效中";
      } else if (row.state == 1) {
        return "已失效";
      } else if (row.state == 3) {
        return "合同作废";
      }
    },
    formatPeopleState(row, column) {
      //收支状态转换
      if (row.sourceCode == "HT_LYBM-0") {
        return "委托合同";
      } else if (row.sourceCode == "HT_LYBM-1") {
        return "承租合同";
      }
    },
    // 新增表单提交
    submitForm(formName) {
      this.$refs.newBillForm.validate(valid => {
        if (valid) {
          this.loading = true
          if(this.newBillForm.feeDateArray.length){
            this.newBillForm.feeStartDate = this.newBillForm.feeDateArray[0];
            this.newBillForm.feeEndDate = this.newBillForm.feeDateArray[1];
          }
        //   systemCode区分是分散式还是集中式 5是分散式 7是集中式
          this.newBillForm.systemCode = this.systemCodeNum
          this.newBillForm.settleStatus = "0";

          // 验证附件
          this.$refs.fileInfo.$refs.fileForm.validate(res => {
            if( res ){

                let otherFbillContent = JSON.stringify({file: {
                    filename: this.fileForm.filename,
                    url: this.fileForm.contractAttachment,
                    fileNames: this.fileForm.attachmentList.map(item => item.attachmentName)
                }})

                let params = Object.assign({}, this.newBillForm, {otherFbillContent});

                //发送请求
                this.$api.seeFinanceService.getSaveNewBill(params)
                  .then(res => {
                    if (res.code == 200) {
                      // 关闭侧边栏
                      this.$emit("update:visible", false);
                      // 提交刷新
                      this.$emit("submit", "reload");
                    }
                  })
                  .finally(()=>{
                      this.loading = false
                  })
            }

          });

        }
      });
    },
    //弹出合同选择
    choiceContract() {
      this.dialogTableVisible = true;
    },
    handleSelectionChange(data) {
        if (data.sourceCode == "HT_LYBM-0") { //委托合同
          this.newBillForm.accountName = data.firstParty;
          this.newBillForm.billType = 1
        } else if (data.sourceCode == "HT_LYBM-1") { //租赁合同
          this.newBillForm.accountName = data.secondParty;
          this.newBillForm.billType = 0
        }
        this.newBillForm.roomAddress = data.address;
        this.newBillForm.contractCode = data.contractCode;
        this.newBillForm.systemCode  = data.contractKind;
        this.newBillForm.communityId = data.communityId;
        this.dialogTableVisible = false;
    },
  }
  // filter
  // computed
};
</script>
<style lang="scss">
.bill-add-box{
  /deep/ .el-form-item{
    padding-bottom: 10px;
  }
}
</style>
