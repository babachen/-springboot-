<template>
    <div class="main">
        <h3 style="letter-spacing: 1px;font-weight: 400;padding-bottom: 20px">基本设置</h3>

        <div>
            <el-form style="width: 350px;float: left" label-position="top" ref="form" :model="userInfo"
                     label-width="80px">
                <el-form-item style="padding: 0" label="用户名">
                    <el-input v-model="userInfo.userName"></el-input>
                </el-form-item>
                <el-form-item style="padding: 0" label="昵称">
                    <el-input v-model="userInfo.nickName"></el-input>
                </el-form-item>
                <el-form-item style="padding: 0" label="密码">
                    <el-input type="password" v-model="userInfo.password" ></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="userInfo.sex">
                        <el-radio label="男"></el-radio>
                        <el-radio label="女"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item style="padding: 0" label="电话号码">
                    <el-input v-model="userInfo.phone"></el-input>
                </el-form-item>
                <el-form-item style="padding: 0" label="邮箱">
                    <el-input v-model="userInfo.email"></el-input>
                </el-form-item>
                <el-form-item style="padding-top: 20px">
                    <el-button type="primary" @click="update">更新基本信息</el-button>
                </el-form-item>
            </el-form>
            <div>
                <img style="padding-bottom: 10px;padding-left: 150px;width: 150px; height: 150px;" alt=""
                     :src="userInfo.profilePhotoUrl">
                     <!-- :on-success="handleUploadSuccess"
                     accept=".png,.jpg"
                     :headers="header" -->
                     <!-- style="padding-left: 500px;letter-spacing: 1px" -->
                <el-upload
                     style="padding-left: 500px;letter-spacing: 1px"
                       class="upload-demo"
                       action="#"

                       :file-list="fileList"
                       :on-change="handleChange"
                       :limit="1"
                       :auto-upload="false"
                       multiple>
                    <el-button style="width: 150px" size="small" type="primary">
                        <i class="el-icon-upload2"></i> 点击上传
                    </el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                </el-upload>
            </div>
        </div>
    </div>
</template>

<script>
    import config from "@/config";
    // import {FindWorkerById, UpdateWorker} from "@/api/userInfo";
    import {updateToAdmin} from "@/api/user";
    import {uploadAll} from "@/api/information";
    import {userProfilePhoto} from "../utils/filePrefix"
    export default {

        data() {
            return {
                header: {
                    "Authorization": localStorage.getItem("token")
                },
                uploadAction: config.API_URL + '/admin/upload',
                userInfo: {
                    nickname: '',
                    password: '',
                    phone: '',
                    gender: '',
                    avatar: '',
                    department: '',
                },
                userInfo:{

                },
                fileList:[],
                currentFile:{},
            }
        },

        mounted() {
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            console.log(userInfo);
            this.userInfo=userInfo;
        },

        methods: {

            update() {
                console.log(this.userInfo);
                updateToAdmin(this.userInfo).then(res=>{
                    if(res.code==200){
                        this.$message({
                            type: 'success',
                            message: '资料修改成功!'
                        });
                        localStorage.setItem("userInfo",JSON.stringify(this.userInfo))
                    }
                })
            },

            // handleUploadSuccess(res) {
            //     this.userInfo.avatar = res;
            //     UpdateWorker(this.userInfo).then(res => {
            //         if (res.success) {
            //             this.$message({
            //                 type: 'success',
            //                 message: '头像上传成功!'
            //             });
            //         }
            //     })
            // },
            handleChange(file, fileList){
          const isJPG = file.name.toLowerCase().endsWith('.jpg');
          const isPNG = file.name.toLowerCase().endsWith('.png');
           const isLt500K = file.size / 1024 < 1000
           if (!isJPG && !isPNG) {
             this.$message.error('只能上传jpg/png文件');
           }
           if (!isLt500K) {
             this.$message.error('文件大小不能超过500kb');
           }
           if( (isJPG || isPNG) && isLt500K){
                // console.log(file);
                const formData = new FormData();
                let fileList=[]
                fileList.push(file)
                formData.append("files",fileList[0].raw) 
                formData.append("prefix",userProfilePhoto)
                uploadAll(formData).then(res=>{
                    // console.log(res.data);
                    this.userInfo.profilePhotoUrl=res.data[0];
                    console.log(this.userInfo);
                    // this.$message({
                    //         type: 'success',
                    //         message: '头像上传成功!'
                    //     });
                })
            };
        }

        },

    }

</script>

<style scoped>

    .main {
        padding: 50px;
        height: 800px;
    }

     .el-form--label-top .el-form-item__label {
        padding: 0;
    }

    .el-form-item {
        margin-bottom: 5px;
    }
</style>