<template>
    <div :class="test">
        <!-- <input @change="dataChange" type="file" accept="image/*;" capture="camera" /> -->
        <input @change="dataChange" type="file" />
        <img class="img_wrap" :src="imgSrc" alt="" v-show="isImg" />
        <video class="img_wrap" :src="videoSrc" alt="" v-show="!isImg" controls="controls" >video</video>

        <button type="primary" @click="postPage">提交</button>

        <iframe ref="iframe" src="../../src/pages/index.html"></iframe>
    </div>
</template>

<script>
    import axios from '../service/service'
    // import html from '../../src/pages/index.html'
    export default {
        name: 'page2',
        data() {
            return {
                text: 'yuan page22',
                test: 'test',
                imgSrc: '',
                videoSrc: '',
                isImg: true, 
                dataFile: null
            }
        },
        mounted() {
            // console.log(html)
        },
        methods: {
            dataChange(e) {
                var target = e.target
                var that = this
                var reader = new FileReader();
                let fileType = target.files[0].type
                if (fileType.indexOf('image/') >= 0) {
                    this.isImg = true
                } else if (fileType.indexOf('video/') >= 0) {
                    this.isImg = false
                }
                if (this.isImg) {
                    reader.onload = function(e) {
                        that.getMedia(this.result);
                    };
                    reader.readAsDataURL(target.files[0]);
                } else {
                    this.videoSrc = this.getObjectURL(target.files[0])
                }
                this.dataFile = new FormData()
                this.dataFile.append('data',target.files[0])
            },
            getObjectURL(file) {
                var url = null;
                if (window.createObjectURL != undefined) { // basic
                    url = window.createObjectURL(file);
                } else if (window.URL != undefined) { // mozilla(firefox)
                    url = window.URL.createObjectURL(file);
                } else if (window.webkitURL != undefined) { // webkit or chrome
                    url = window.webkitURL.createObjectURL(file);
                }
                return url;
            },
            getMedia(res) {
                var that = this;
                var img = new Image(),
                    maxH = 300;
                img.onload = function() {
                    var cvs = document.createElement('canvas'),
                        ctx = cvs.getContext('2d');
                    if (img.height > maxH) {
                        img.width *= maxH / img.height;
                        img.height = maxH;
                    }
                    cvs.width = img.width;
                    cvs.height = img.height;
                    ctx.clearRect(0, 0, cvs.width, cvs.height);
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    var dataUrl = cvs.toDataURL('image/jpeg', 1);
                    that.imgSrc = dataUrl;
                };
                img.src = res;
            },
            postPage(){
                axios('post','http://192.168.27.215:4000/upload',this.dataFile,{"Content-Type":'mutipart/form-data'}).then((r) => {
                    if(r.status === 200){
                        alert('上傳成功！')
                    }
                })
            }
        }
    }
</script>

<style lang="stylus" scoped>
.test
    font-size 16px
.img_wrap
    width: 300px;
    height: 300px;
    border: 1px solid black;
    display: inline-block;
</style>


