<!-- Name: audit-record -->
<!-- Description: 合同-审核一路 -->
<!-- Author: 吴宇枫 -->
<!-- Data: 2018.11.13 -->

<template>
    <div>
        <form-card title="审核记录">
            <div class="ac d-text-gray" v-if="form.approvalRecordVoList == null || !form.approvalRecordVoList.length">暂无审核记录</div>
            <li class="bb p5 d-hidden d-text-gray" v-for="(item,index) of form.approvalRecordVoList" :key="index">
              <span>
                {{item.approvaUserName}} [{{item.taskName}}] : 
                {{item.approvalState==1?'通过':'驳回'}}
                <template v-if="item.approvalOpinion && item.approvalOpinion != 'null'">
                    {{item.approvalOpinion}}
                </template>
              </span>
              <span class="fr f12">{{item.approvalTime | timeToStr('YYYY-MM-DD HH:mm')}}</span>
            </li>
        </form-card>
    </div>
</template>

<script>
    export default {
        props: {
            form: {
                required: true,
                type: Object
            },
            columns: {
                type: Number,
                default: 4
            }
        },
        data () {
            return {

            }
        }
    }
</script>

<style>
    
</style>