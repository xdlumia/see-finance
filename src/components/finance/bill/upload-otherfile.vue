<!--账单管理
/**
* 账单管理详情其他信息
* @/components/finance/bill 组件存放位置
* @author web-冀猛超
**/
-->
<template>
    <el-form-item label="上传附件">
        <el-row>
            <el-col :span="24">
                <template v-if="!disabled">
                    <upload-file
                        @addPictureUrl="uploadAttachment"
                        :limit="uploadOptions"
                    >
                        <el-button size="small" type="primary" >
                            上传打包文件
                            <i class="el-icon-upload el-icon--right"></i>
                        </el-button>
                        <span class="d-text-gray">支持扩展名：.zip</span>
                    </upload-file>
                </template>
                <template v-else>
                    <el-button size="small" type="primary" :disabled="disabled" >
                        上传打包文件
                        <i class="el-icon-upload el-icon--right"></i>
                    </el-button>
                    <span class="d-text-gray">支持扩展名：.zip</span>
                </template>
            </el-col>
            <el-col :span="24" class="d-color-qray f14"></el-col>
            <el-col :span="24" v-show="fileData.contractAttachment">
                <div>
                    <a :href="fileData.contractAttachment" class="d-text-blue">{{fileData.contractAttachment}}</a>
                    <i class="el-icon-remove-outline d-pointer ml10" @click="clearUploadAttachment" v-if="fileData.contractAttachment && !disabled"></i>
                </div>
            </el-col>
            <!-- <el-col :span="18" class="mt10 mb10" v-show="fileData.contractAttachment">
                <el-input  v-model.trim="fileData.contractAttachment" size="small" disabled></el-input> 
            </el-col>
            <el-col :span="4" class="mt10 mb10" :offset="1" v-show="fileData.contractAttachment">
                 <a :href="fileData.contractAttachment" >
                    <el-button type="primary" size="small">下载附件</el-button>
                </a>
            </el-col> -->
        </el-row>

        <el-row class="mb20" v-show="fileData.attachmentList && fileData.attachmentList.length > 0">
            <el-col :span="24">附件文件名称清单</el-col>
        </el-row>
        <el-form ref="fileForm" :model="fileData">
            <el-form-item 
                v-for="(item, index) in fileData.attachmentList" 
                :key="index" 
                :prop='"attachmentList."+index+".attachmentName"'
                :rules="{ required: true, message: '请填写附件名称，或者删除此项！', trigger: 'change' }"
                class="mb10"
            >
                <el-col :span="1">{{index + 1}}、</el-col>
                <el-col :span="15">
                    <el-input size="mini" v-model.trim="item.attachmentName" :disabled="disabled"></el-input>
                </el-col>
                <el-col :span="1" v-show="!disabled">
                    <i
                        class="el-icon-remove-outline f20 d-pointer"
                        @click="deleteAttachment(index)"
                        style="cursor: pointer;"
                    ></i>
                </el-col>
            </el-form-item>
        </el-form>
        <el-row class="mb20" v-show="!disabled">
            <el-col :span="20">
                <div @click="addAttachmentDetail" class="d-pointer">
                    <i class="el-icon-circle-plus-outline f20"></i>
                    增加附件文件名称
                </div>
            </el-col>
        </el-row>
    </el-form-item>
</template>
<script>
export default {
    props: {
        fileData: {
            type: Object
        },
        disabled: Boolean
    },
  // components
    components: {},
    // data
    data() {
        return {
            isShowEdit: false,
            uploadOptions: {
                type: ["zip"]
            },
            attachmentListRule: {
                attachmentName: []
            },
        };
    },
    created() {},
    methods: {
        uploadAttachment (fileInfo) {
            this.fileData.contractAttachment = fileInfo.url;
            this.$message({
                type: 'success',
                message: '上传附件成功！'
            })
        },
        addAttachmentDetail () {
            if (this.fileData.contractAttachment)
                this.fileData.attachmentList.push({ attachmentName: "" })
            else {
                this.$message({
                    type: 'warning',
                    message: '请先上传附件'
                })
            }
        },
        deleteAttachment (index) {
            this.fileData.attachmentList.splice(index, 1);
        },
        clearUploadAttachment () {
            this.fileData.contractAttachment = ''
            this.fileData.attachmentList = []
        }
    },
};
</script>
<style scoped>

</style>

