<!--财务组件：财务主页
/**
* 财务组件：财务主页
* @/components/finance/index.vue 组件存放位置
* @author web-王晓冬
* @date 2018年11月6日
**/
-->
<template>
    <div>
        <article class="footer-bill-tabs">
            <p class="put" @click="activeName='put'" :class="{active:activeName == 'put'}">收款总额</p>
            <p class="pay" @click="activeName='pay'" :class="{active:activeName == 'pay'}">付款总额</p>
        </article>
        <!-- 应收 -->
        <el-row class="footer-bill-articel" v-show="activeName=='put'">
            <el-col :span="5">
                <p>应收({{billPutStats.totalCount}}笔)</p>
                <b>{{billPutStats.totalShouldPayMoney | thousandBitSeparator}}</b>
            </el-col>
            <el-col :span="5">
                <p>滞纳金</p>
                <b>{{billPutStats.totalLateFeeMoney | thousandBitSeparator}}</b>
            </el-col>
            <el-col :span="5">
                <p>实收</p>
                <b>{{billPutStats.totalFactAmount | thousandBitSeparator}}</b>
            </el-col>
            <el-col :span="4">
                <p>调整</p>
                <b>{{billPutStats.totalAdjustAmount | thousandBitSeparator}}</b>
            </el-col>
            <el-col :span="5">
                <p>需收({{billPutStats.totalWantCount}}笔)</p>
                <b>{{billPutStats.totalWantAmount | thousandBitSeparator}}</b>
            </el-col>
        </el-row>
        <!-- 应付 -->
        <el-row class="footer-bill-articel" v-show="activeName=='pay'">
            <el-col :span="5">
                <p>应付({{billPayStats.totalCount}}笔)</p>
                <b>{{billPayStats.totalShouldPayMoney | thousandBitSeparator}}</b>
            </el-col>
            <el-col :span="5">
                <p>滞纳金</p>
                <b>{{billPayStats.totalLateFeeMoney | thousandBitSeparator}}</b>
            </el-col>
            <el-col :span="5">
                <p>实付</p>
                <b>{{billPayStats.totalFactAmount | thousandBitSeparator}}</b>
            </el-col>
            <el-col :span="4">
                <p>调整</p>
                <b>{{billPayStats.totalAdjustAmount | thousandBitSeparator}}</b>
            </el-col>
            <el-col :span="5">
                <p>需付({{billPayStats.totalWantCount}}笔)</p>
                <b>{{billPayStats.totalWantAmount | thousandBitSeparator}}</b>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
  components: {},
  props:['params'],
  // data
  data() {
    return {
      activeName: "put", //默认显示收款总额
      //数据应收统计
      billPutStats:{}, 
      //数据应付统计
      billPayStats:{}, 

    };
  },
  created(){
      this.querybillStatistics(this.params)
  },
  // mounted
  // activited
  // update
  // beforeRouteUpdate
  // metods
  computed:{},
  watch:{
    params:{
        handler:function(obj){
            this.querybillStatistics(obj)
        },
        deep:true
    },
    },
  methods: {
    // 查询账单数据统计信息
    querybillStatistics(params){
        this.$api.seeFinanceService.querybillStatistics(params)
        .then(res=>{
            let data = res.data || []
            data.forEach(item => {
                // 如果值为null 则修改成0
                for(let key in item){
                    item[key] = item[key] || 0
                }
                // 获取应收数据
                if(item.billType == 0){
                    this.billPutStats =item || {}
                }
                // 获取应付数据
                else if(item.billType == 1){
                    this.billPayStats = item || {}
                }
            })
        })
    },
  }
  // filter
  // computed
};
</script>
<style>
    .footer-bill-tabs p{
        width: 130px; 
        height: 24px;
        line-height: 24px;
        text-align:center;
        border:1px solid #dcdcdc;
        border-radius: 13px;
        box-sizing: border-box;
        font-size: 13px;
        display:inline-block;
        cursor: pointer;
    }
    .footer-bill-tabs p.active{
        border:none;
        color:#fff;
    }
    .footer-bill-tabs .put.active{
        background: #4689fb
    }
    .footer-bill-tabs .pay.active{
        background: #ec0d00
    }
    .footer-bill-articel p{ color:#979797; font-size:14px;}
    .footer-bill-articel b{ color:#333; font-size:26px;}
    
</style>

