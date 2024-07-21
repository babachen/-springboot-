<template>
    <div class="film-list">
         <el-input
    type="text"
    size="small"
    prefix-icon="el-icon-search"
    v-model="search"
    placeholder="请输入店铺名称"
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

<el-button
      
      icon="el-icon-circle-plus"
      type="success"
      size="small"
      style="margin-left: 30px;float: right"
      @click="AddBT">
      添加
    </el-button>

        <el-table
                v-loading="tableLoading"
                :data="storeList"
                style="width: 100%"
                
                >

            <el-table-column label="序号" type="index" width="60" :index="indexMethod">
                
            </el-table-column>

            <el-table-column
                    label="店铺名称"
                    prop="storeName"
                    >
            </el-table-column>
            <el-table-column label="图片" prop="logoUrl" width="125">
             <template scope="scope">
              <div @click="handleImagePreview(scope.row.logoUrl)">
               <el-image
                  style="width: 100px; height: 100px"
                 :src="scope.row.logoUrl"
                 fit="cover"
                 >
               </el-image>
              </div>
             </template>
            </el-table-column>

            <el-table-column label="店铺地址" prop="storeAddress" width="180">
                
            </el-table-column>
            <!-- <el-table-column
                    label="店铺描述"
                    prop="description"
                    show-overflow-tooltip>
            </el-table-column> -->


            

            
            <el-table-column label="联系电话" prop="contactPhone" width="120" >
            </el-table-column>
            <el-table-column
                    label="店铺状态"
                    prop="status">
            </el-table-column>
            <el-table-column label="创建人" prop="userName" ></el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="180">
                
            </el-table-column>
            <el-table-column width="240" align="right">
                
                <template style="white-space: nowrap" slot-scope="scope">
                    <el-button
                            size="mini"
                            icon="el-icon-edit"
                            type="primary"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-popconfirm
                            confirm-button-text='确定'
                            cancel-button-text='不用了'
                            icon="el-icon-info"
                            icon-color="red"
                            @confirm=handleDelete(scope.$index,scope.row)
                            title=" 确定要删除该店铺吗？ "
                    >
                        <el-button
                                style="margin-left: 8px"
                                size="mini"
                                icon="el-icon-delete"
                                type="danger"
                                slot="reference">删除
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

    <el-dialog title="信息" :visible.sync="dialog1" @close='quitAdd'>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="店铺名称" label-width="120px" prop="storeName">
          <el-input
            type="text"
            v-model="form.storeName"
            placeholder="店铺名称"
            style="width: 200px; cursor: pointer"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择图片" label-width="120px" prop="file">
          <el-upload
              class="upload-demo"
              action="#"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :on-change="handleChange"
              :limit="1"
              :auto-upload="false"
              multiple>
            <el-button type="primary" icon="el-icon-upload">上传店铺Logo</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1000kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="店铺地址" label-width="120px" prop="storeAddress">
          <el-input
            type="text"
            v-model="form.storeAddress"
            placeholder="店铺地址"
            style="width: 200px; cursor: pointer"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建人用户名" label-width="120px" prop="createUserName">
          <el-input
            type="text"
            v-model="form.createUserName"
            placeholder="创建人用户名"
            style="width: 200px; cursor: pointer"
          ></el-input>
        </el-form-item>
        <el-form-item style="padding-right: 100px" label="店铺描述" label-width="120px">    
          <el-input :rows="8" type="textarea" v-model="form.storeDescription"></el-input>
        </el-form-item>
        <el-form-item label="当前状态" label-width="120px" prop="status">
            <el-radio-group v-model="form.status">
            <el-radio label="营业"></el-radio>
            <el-radio label="停业"></el-radio>
            <el-radio label="审核中"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="联系电话" label-width="120px" prop="contactPhone">
            <el-input
            type="text"
            v-model="form.contactPhone"
            placeholder="联系电话"
            style="width: 200px; cursor: not-allowed"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quitAdd">取 消</el-button>
        <el-button type="primary" @click="saveStore('form')">确 定 保 存</el-button>
      </div>
    </el-dialog>
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
    import {uploadAll} from "@/api/information";
    import {getStoreByPage,saveStore,updateStore,deleteStore} from "@/api/user";
    import config from "@/config";
    import service from "../../utils/request"; 
    import {StoreLogoPrefix} from "../../utils/filePrefix"
    export default {
        data() {
            return {
                rules:{
                status: [
                     { required: true,message: '状态不能为空', trigger: 'blur'}
                ],
                storeName :[
                     { required: true,message: '店铺名称不能为空', trigger: 'blur'},
                     { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                ],
                storeAddress:[
                     { required: true,message: '店铺地址不能为空', trigger: 'blur'},
                     { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                createUserName:[
                     { required: true,message: '创建人用户名不能为空', trigger: 'blur'},
                ],
                file: [
                     { validator: this.validateFile, trigger: 'blur'}
                ],
                contactPhone: [ // 联系电话的验证规则
                     { 
                       required: true, 
                       message: '请输入联系电话', 
                       trigger: 'blur' 
                     },
                     {
                       pattern: /^1[3456789]\d{9}$/, 
                       message: '请输入正确的手机号码', 
                       trigger: ['blur', 'change']
                     }
                   ]
                     },
                header: {
                    "Authorization": localStorage.getItem("token")
                },
                pageInfo:{
                    page:1,
                    rows:5,
                    total:0,
                },
                isAdding:false,
                // uploadAction: config.API_URL + '/admin/upload',
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
            this.loadAllStore();
        },
        methods: {
            //展示分页数据
            loadAllStore(){
                var param={...this.pageInfo,storeName:this.search,}
                getStoreByPage(param).then(res => {
                setTimeout(() => {
                    this.storeList = res.data;
                    this.tableLoading = false;
                    this.pageInfo.total=parseInt(localStorage.getItem('total'))   
                }, 700)
            })
            },
    handleRemove(file,fileList){
      if(file.url==this.form.logoUrl){
        this.form.logoUrl='';
      }
      this.fileList=fileList;
      console.log(this.fileList);
    },
    handlePreview(file) {
      // 清除之前的图片数据
      this.currentFile = {};
      console.log(file);
      if (file.url) {
        // 文件已经上传到服务器并具有 URL
        this.currentFile = file;
        this.dialogVisible1 = true;  // 打开预览对话框
      } else if (file.raw instanceof Blob) {
        // 文件未上传到服务器，使用FileReader来读取文件并显示预览
        const reader = new FileReader();
        reader.onload = (e) => {
          this.currentFile.base64Data = e.target.result;
          this.dialogVisible1 = true;  // 打开预览对话框
        };
        reader.readAsDataURL(file.raw);
      } else {
        // 处理文件无效的情况
        console.error('Invalid file');
      }
    },
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
            this.fileList=fileList;
            }else{
              const index = fileList.indexOf(file);
              fileList.splice(index, 1);
            };
        }
        ,
        handleUploadSuccess(res) {
      this.form.logoUrl = res
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
            //点击编辑
            handleEdit(index, row) {
                this.isAdding=false;
                this.form={...row}
                if(row.logoUrl){
                  const name = "图" + 1;
                  const param={"name":name,"url":row.logoUrl}
                  this.fileList.push(param)
                  console.log(this.fileList);
                }
                this.dialog1 = true;
            },
            handleDelete(index, row) {
                deleteStore(row.storeId).then(res=>{
                    if(res.code==200){
                        this.$message({
                    type: 'success',
                    message: '删除成功!'
                    });
                    this.loadAllStore(); 
                    }
                })
                
            },
            handleCurrentChange(newPage){
                this.pageInfo.page=newPage;
                this.tableLoading = true;
              this.loadAllStore();
            },
            handleImagePreview(url){
                 this.image=url;
                 this.dialogVisible=true;
             },
            handleSizeChange(newSize){
                this.pageInfo.rows=newSize;
                this.loadAllStore();
            },
            searchByTitle(){
            this.loadAllStore();
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
                    this.loadAllStore();
                })
                }else{
                    updateStore(params).then(res=>{
                    this.dialog1=false;
                    this.loadAllStore();            
                })
              }
            })
          }else{
            updateStore(this.form).then(res=>{
                    this.dialog1=false;
                    this.loadAllStore();            
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
