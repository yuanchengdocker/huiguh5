<template>
    <div>
        <!-- <el-upload 
            class="avatar-uploader" 
            action="http://192.168.27.215:4000/upload" 
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            name="data" 
            :file-list="fileList"
            :show-file-list="true" 
            :on-success="handleAvatarSuccess" 
            :before-upload="beforeAvatarUpload"
        >
            <transition name="fade">
                <img v-show="isImg&&imageUrl" :src="imageUrl" class="avatar"/>
            </transition>
            <transition name="fade">
                <video v-show="!isImg&&imageUrl" :src="imageUrl" class="avatar" controls="controls"/>
            </transition>
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog> -->
        page1
    </div>
</template>

<script>
    export default {
        name: 'page1',
        data() {
            return {
                fileList: [],
                imageUrl: '',
                isImg: true, 
                dialogImageUrl: '',
                dialogVisible: false
            };
        },
        methods: {
            handlePreview(file){
                this.checkType(file.raw)
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleAvatarSuccess(res, file, fileList) {
                this.checkType(file.raw)
                this.imageUrl = URL.createObjectURL(file.raw);
                console.log(file, fileList);
            },
            beforeAvatarUpload(file) {
                return true;
            },
            checkType(file){
                const fileType = file.type;
                // const isLt2M = file.size / 1024 / 1024 < 2;

                if (fileType.indexOf('image/') >= 0) {
                    this.isImg = true
                } else if (fileType.indexOf('video/') >= 0) {
                    this.isImg = false
                }
            }
        }
    }
</script>

<style lang="stylus">
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

