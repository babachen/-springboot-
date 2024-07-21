<template>
    <div class="film-list">
         <el-input
    type="text"
    size="small"
    prefix-icon="el-icon-search"
    v-model="search"
    placeholder="请输入用户名"
    style="width: 270px; cursor: pointer"
    @enter="searchByTitle"
  ></el-input>
  <!-- <el-radio v-model="isParent" label="true" size="small" style="margin-left:10px;" border>父级</el-radio>
  <el-radio v-model="isParent" label="false" size="small" style="margin-left:-18px;" border>子级</el-radio> -->

<el-button
      
      icon="el-icon-search"
      type="success"
      size="small"
      style="margin-left: 10px"
      @click="searchByTitle">
      搜索
    </el-button>
<el-button
      
      icon="el-icon-delete"
      type="danger"
      size="small"
      style="margin-right: 10px"
      @click="search=''">
      重置
</el-button>

<!-- <el-button
      
      icon="el-icon-circle-plus"
      type="success"
      size="small"
      style="margin-left: 30px;float: right"
      @click="AddBT">
      添加
    </el-button> -->

        <el-table
                v-loading="tableLoading"
                :data="storeList"
                style="width: 100%"
                
                >

            <el-table-column label="序号" type="index" width="60" :index="indexMethod">
                
            </el-table-column>

            <el-table-column
                    label="用户名"
                    prop="userName"
                    >
            </el-table-column>
            <el-table-column label="头像" prop="profilePhotoUrl" width="125">
             <template scope="scope">
              <div @click="handleImagePreview(scope.row.profilePhotoUrl)">
               <el-image
                  style="width: 100px; height: 100px"
                 :src="scope.row.profilePhotoUrl ? scope.row.profilePhotoUrl : '../../public/notouxiang.jpg'"
                 fit="cover"
                 >
               </el-image>
              </div>
             </template>
            </el-table-column>
            <el-table-column label="用户类型" prop="roleName" width="180">
                
            </el-table-column>
            <el-table-column label="账户余额" prop="amount" width="180">
                
            </el-table-column>
            <!-- <el-table-column
                    label="店铺描述"
                    prop="description"
                    show-overflow-tooltip>
            </el-table-column> -->


            

            
            <el-table-column label="联系电话" prop="phone" width="120" >
            </el-table-column>
            <el-table-column
                    label="账号状态"
                    prop="status">
            </el-table-column>
            <el-table-column label="注册时间" prop="registerTime" ></el-table-column>
            <el-table-column width="240" align="right">
                
                <template style="white-space: nowrap" slot-scope="scope">
                    <el-button
                            size="mini"
                            icon="el-icon-remove"
                            type="primary"
                            v-if="scope.row.status=='正常'"
                            @click="updateStatus(scope.row.id, 1)">冻结
                    </el-button>
                    <el-button
                            size="mini"
                            icon="el-icon-success"
                            type="success"
                            v-if="scope.row.status=='封禁'"
                            @click="updateStatus(scope.row.id, 0)">解冻
                    </el-button>
                    <el-popconfirm
                            confirm-button-text='确定'
                            cancel-button-text='不用了'
                            icon="el-icon-info"
                            icon-color="red"
                            @confirm=reSet(scope.row.id)
                            title=" 确定要重置密码吗？ "
                    >
                        <el-button
                                style="margin-left: 8px"
                                size="mini"
                                icon="el-icon-switch-button"
                                type="warning"
                                slot="reference">重置密码
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
        @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
        :current-page="pageInfo.page"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="pageInfo.rows"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total">
    </el-pagination>
     <el-dialog :visible.sync="dialogVisible1">
  <img v-if="currentFile.url" :src="currentFile.url" alt="文件预览" style="max-width: 100%; max-height: 100%;">
  <img v-else-if="currentFile.base64Data" :src="currentFile.base64Data" alt="文件预览" style="max-width: 100%; max-height: 100%;">
</el-dialog>
  <el-dialog :visible.sync="dialogVisible" title="海报图片">
    <div class="el-dialog-div">
          <el-image :src="image" fit="cover" ></el-image>
    </div >
    </el-dialog>
    </div>
</template>

<script>
    import {getCategoryByPage,uploadAll} from "@/api/information";
    import {getUserList,updateUserStatus,reSetUserPassword} from "@/api/user";
    import config from "@/config";
    import service from "../../utils/request"; 
    import {StoreLogoPrefix} from "../../utils/filePrefix"
    export default {
        data() {
            return {
                header: {
                    "Authorization": localStorage.getItem("token")
                },
                pageInfo:{
                    page:1,
                    rows:5,
                    total:0,
                },
                isAdding:false,
                uploadAction: config.API_URL + '/admin/upload',
                url: '',
                tableLoading: false,
                form: {
                    storeName: '',
                    storeAddress: '',
                    storeDescription: '',
                    status: '',
                    contactPhone: '',
                    logoUrl:'',
                    file:{},
                },
                storeList: [],
                parentCategoryOptions: [
                
                ],
                search: '',
                dialog1: false,
                dialog2: false,
                isParent:'',
                fileList:[],
                currentFile:{},
                dialogVisible1:false,
                dialogVisible:false,
                image:''
            }
        },
        mounted() {
            this.tableLoading = true;
            service.defaults.headers['Authorization'] = localStorage.getItem('token');
            this.loadAllUser();
        },
        methods: {
            //展示分页数据
            loadAllUser(){
                var param={...this.pageInfo,userName:this.search,}
                getUserList(param).then(res => {
                setTimeout(() => {
                    this.storeList = res.data;
                    this.tableLoading = false;
                    this.pageInfo.total=parseInt(localStorage.getItem('total'))   
                }, 700)
            })
            },
            //设置序号
            indexMethod(index) {
                // 假设每页显示10条数据，起始值为 (当前页数 - 1) * 10 + 1
                
                return (this.pageInfo.page - 1) * this.pageInfo.rows + index + 1;
            },
            //点击添加按钮
            AddBT(){
                this.dialog1=true;
                this.isAdding=true;
            },
            //
            updateStatus(id, status) {
                console.log(id);
                console.log(status);
                var params={"userId":id,"status":status}
                 console.log(params);
                updateUserStatus(params).then(res=>{
                  if(res.code==200){
                    this.$message({
                    type: 'success',
                    message: '修改成功!'
                    });
                    this.loadAllUser(); 
                    }
                })
            },
            reSet(id) {
                reSetUserPassword(id).then(res=>{
                    if(res.code==200){
                        this.$message({
                    type: 'success',
                    message: '重置成功!'
                    });
                    // this.loadAllUser(); 
                    }
                })
                
            },
            handleCurrentChange(newPage){
                this.pageInfo.page=newPage;
                this.tableLoading = true;
              this.loadAllUser();
            },
            handleImagePreview(url){
                 this.image=url;
                 this.dialogVisible=true;
             },
            handleSizeChange(newSize){
                this.pageInfo.rows=newSize;
                this.loadAllUser();
            },
            searchByTitle(){
            this.loadAllUser();
            },
            quitAdd(){
                this.dialog1=false;
                this.form={};
                this.fileList=[];
            },
            saveStore(formName){
                this.$refs[formName].validate((valid) => {
                  if (valid) {

                    var _url=this.form.logoUrl; 
                var isAdd=this.form.storeId;
                console.log(isAdd);
                console.log(this.form);
                console.log(_url);
                if(_url==''||_url==undefined){
                    const formData = new FormData();
                    formData.append("files",this.fileList[0].raw) 
                    formData.append("prefix",StoreLogoPrefix)
                    uploadAll(formData).then(res=>{
                     var params={...this.form,logoUrl:res.data[0]}
                    if(!isAdd){
                    saveStore(params).then(res=>{
                    this.dialog1=false;
                    this.loadAllUser();
                })
                }else{
                    updateStore(params).then(res=>{
                    this.dialog1=false;
                    this.loadAllUser();            
                })
              }
            })
          }else{
            updateStore(this.form).then(res=>{
                    this.dialog1=false;
                    this.loadAllUser();            
                })
          }
                
                
      } else {
          console.log('error submit!!');
          return false;
        }
      });
                
 },
      validateFile(rule, value, callback) {
         if (this.fileList.length==1) {
           callback(); // 文件不为空，通过验证
         } else {
           callback(new Error('图片不能为空')); // 文件为空，验证失败
         }
       }
             },
         }
</script>

<style>
    .film-list {
        padding: 20px;
    }
.el-dialog-div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* 设置高度为100%以确保垂直居中 */
}

.el-image {
  max-width: 100%;
  max-height: 100%;
}
.el-table .success-row {
    background: #f0f9eb;
  }
  .item {
  margin-top: 3px;
  margin-right: 20px;
}
.active {
  background-color: #0f89d5; /* 设置选中状态的背景颜色 */
}

</style>
