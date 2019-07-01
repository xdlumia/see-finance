<template>
    <div>
        <el-popover
            placement="top-end"
            v-model="popoverVisible"
            width="350"
            trigger="click"
            @show="show"
            @hide="hide"
            >
            <div class="d-absolute" style="right:10px; top:10px; font-size:20px; z-index:1">
                <i class="el-icon-close d-pointer" title="关闭消息列表" @click="popoverVisible = !popoverVisible"></i>
            </div>
            <h4 class="mb5">下载中心</h4>
            <!-- <div v-loading="loading" class="ac h40 lh40 mb10" v-show="!billList.length"> 暂无下载内容消息 </div> -->
            <div v-loading="loading" style="max-height: 400px;overflow-y: auto;">
                <el-row class="finance-list bt" v-for="(item,index) of billList" :key="index">
                    <el-col :span="14" title="" class="d-elip">{{item.fileName || '-'}}</el-col>
                    <el-col :span="5" class="ac d-pointer">
                      <a v-if="item.state == 0">生成中</a>
                      <a v-else-if="item.state == 1" class="active d-text-gray" :href="item.filePath" traget="_blank">下载</a>
                      <a v-else-if="item.state == 2">生成失败</a>
                      </el-col>
                    <el-col :span="5" v-if="item.state==1" class="ac d-pointer"><i class="active el-icon-delete" @click="delBill(item,index)"></i></el-col>
                </el-row>
                <el-col :span="24" class="ac"><el-button class="d-text-gray" type="text" :disabled="isShowMore" @click="getBillList(true)" :loading="loading">{{isShowMore?'没有了':'加载更多'}}</el-button></el-col>
                <el-col :span="24" class="ac"><el-button class="wfull d-text-gray bt" type="text" @click="delBill(billList)">删除全部</el-button></el-col>
            </div>
            <slot><i slot="reference" class="f18 el-icon-download d-pointer"></i></slot>
        </el-popover>
    </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  },
  props: ['isLockkScreen'],
  data () {
    return {
      loading: false,
      popoverVisible: false,
      // 查询参数。
      queryParams: {
        sysCode: this.$local.fetch('userInfo').syscode,
        limit: 10,
        page: 1
      },
      // 账单列表。
      billList: [],
      isShowMore: false // 是否显示更多
    }
  },

  created () {
  },
  beforeMount () {},
  methods: {
    show(){
      this.$emit('toggle', true);
    },
    hide(){
      this.$emit('toggle', false);
    },
    getBillList (more) {
      if (more) {
          this.queryParams.page+=1
      }
      this.$api.bizSystemService.downloadList(this.queryParams)
        .then(res => {
          let data = res.data || []
          this.isShowMore = res.curr == res.pagers
          if (more) {
            this.billList = [...this.billList, ...data]
          }else{
            this.billList = data
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 删除消息
    delBill (row,index) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        if (!(row instanceof Array)) row = [row]
        let ids = row.map(item => item.id).join(',')
        this.$api.bizSystemService.downloadDelete({ids:ids})
          .then(res => {
            // 删除成功后本地删除
            this.billList.splice(index, 1)
          })
      }).catch(() => { })
    }
  },
  watch: {
    isLockkScreen(bool){
      this.popoverVisible = bool;
      if (bool) {
        this.queryParams.page = 1;
        this.getBillList()
      }
    }
  }
}
</script>

<style scoped lang="scss">
.finance-list{
    padding:10px 0;
    .active{
        &:hover{color:#409EFF}
    }
}
</style>
