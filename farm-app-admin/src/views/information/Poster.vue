<template>
  <div>
    <!-- <el-carousel v-if="posterList.length !== 0" height="500px" indicator-position="outside">
      <el-carousel-item v-for="(item, index) in posterList" :key="index">
        <img alt=""
             :src="item.url"
             class="image">
      </el-carousel-item>
    </el-carousel> -->

    <div class="content">
<el-input
    type="text"
    size="small"
    prefix-icon="el-icon-search"
    v-model="search"
    placeholder="请输入产品名称"
    style="width: 150px; cursor: pointer"
    @enter="searchByTitle"
  ></el-input>
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
          @click="AddBT"
          type="primary"
          icon="el-icon-upload"
          style="margin-left: 30px;float: right">
        上传轮播海报
      </el-button>
      
      <el-table
          ref="filterTable"
          :data="posterList"
          style="width: 100%;margin-top: 15px;">
          <el-table-column label="序号" type="index" width="80" :index="indexMethod">
                
            </el-table-column>
            <el-table-column
                    label="海报标题"
                    prop="title"
                     width="150"
                    >
            </el-table-column>
        <el-table-column
            prop="productName"
            label="产品名称"
            width="150"
        >
        </el-table-column>
        <el-table-column
            prop="createTime"
            label="创建时间"
            width="180">
        </el-table-column>
        <el-table-column label="图片" prop="url" >
             <template scope="scope">
              <div @click="handleImagePreview(scope.row.url)">
               <el-image
                  style="width: 100px; height: 100px"
                 :src="scope.row.url"
                 fit="cover"
                 >
               </el-image>
              </div>
             </template>
            </el-table-column>
        <el-table-column
            prop="status"
            label="是否启用"
            width="0">
          <template slot-scope="scope">
            <el-tag
                v-if="scope.row.status==1"
                type="success"
                disable-transitions>正在使用
            </el-tag>
            <el-tag
                v-else
                type="warning"
                disable-transitions>未使用
            </el-tag>
            <el-button v-if="scope.row.status==1"
                       style="padding: 0 15px;color: #67C23A"
                       type="text"
                       @click="changePosterStatus(scope.$index, scope.row, 0)"
                       icon="el-icon-upload2">下架
            </el-button>
            <el-button v-else
                       style="padding: 0 15px;color: #E6A23C"
                       type="text"
                       @click="changePosterStatus(scope.$index, scope.row, 1)"
                       icon="el-icon-download">上架
            </el-button>
            <el-button slot="reference"
                           style="color: #F56C6Cl;margin-left:10px" type="text"
                           icon="el-icon-edit"
                           @click="handleEdit(scope.$index, scope.row)">编辑
                </el-button>
            <template style="padding-left: 100px">
              <el-popconfirm @confirm="handleDeletePoster(scope.$index, scope.row.id)" title="确定要删除这个海报吗？">
                <el-button slot="reference"
                           style="color: #F56C6C;margin-left:10px" type="text"
                           icon="el-icon-delete">删除
                </el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
        @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
        :current-page="pageInfo.page"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="pageInfo.rows"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total">
    </el-pagination>
    <el-dialog title="轮播海报" :visible.sync="dialogFormVisible" @close='quit'>
      <el-form :model="uploadPoster" ref="uploadPoster" :rules="rules">
        <el-form-item label="海报标题" style="margin-bottom: 35px" label-width="120px" prop="title">
          <el-input style="width: 360px" v-model="uploadPoster.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品名称" style="margin-bottom: 35px" label-width="120px" prop="productName">
                       <el-select
               v-model="uploadPoster.productName"
               filterable
               remote
               :remote-method="handleRemoteSearch"
               placeholder="请选择"
              
             >
               <el-option
                 v-for="item in options"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value"
               >
               </el-option>
               <el-button
                   style="margin-left:20px"
                   type="text"
                   @click="loadMoreOptions"
                   v-if="optionButton"
                 >
                   加载更多
                 </el-button>
             </el-select>
        </el-form-item>
        <!-- <el-form-item label="上架状态" style="margin-bottom: 35px" label-width="120px" prop="status">
          <el-select style="width: 360px" v-model="uploadPoster.status"  placeholder="请选择">
            <el-option label="上架" value="0"></el-option>
            <el-option label="下架" value="1"></el-option>
          </el-select>
        </el-form-item> -->
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
            <el-button type="primary" icon="el-icon-upload">上传轮播海报</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1000kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="调色板" style="margin-bottom: 35px" label-width="120px" prop="background">
          <el-color-picker v-model="uploadPoster.background" :show-alpha="true" :color-format="'rgb'" :value="'rgb(205, 215, 218)'"></el-color-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quit()">取 消</el-button>
        <el-button type="primary" @click="submitUpload('uploadPoster')">确 定</el-button>
      </div>
    </el-dialog>
  <el-dialog :visible.sync="dialogVisible" title="海报图片">
    <div class="el-dialog-div">
          <el-image :src="image" fit="cover" ></el-image>
    </div >
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible1" >
      <div class="el-dialog-div">
            <img v-if="currentFile.url" :src="currentFile.url" alt="文件预览" style="max-width: 100%; max-height: 100%;">
  <img v-else-if="currentFile.base64Data" :src="currentFile.base64Data" alt="文件预览" style="max-width: 100%; max-height: 100%;">
    </div >
</el-dialog>
  </div>
</template>

<script>
import config from "@/config";
import {AddPoster, getProductOptionsByPage, DeletePosterById, ListAllPoster, UpdatePoster,uploadAll} from "@/api/information";
import {PosterPrefix} from "../../utils/filePrefix"
export default {
  data() {
    return {
      rules:{
                status: [
                     { required: true,message: '状态不能为空', trigger: 'blur'}
                ],
                title: [
                     { required: true,message: '标题不能为空', trigger: 'blur'},
                     { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                ],
                productName :[
                     { required: true,message: '产品名称不能为空', trigger: 'blur'},
                     { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                ],
                file: [
                     { validator: this.validateFile, trigger: 'blur'}
                ],
                background: [
                     { required: true,message: '请选择背景颜色', trigger: 'blur'}
                ],
                     },
      dialogVisible1:false,
      header: {
        "Authorization": localStorage.getItem("token")
      },
      dialogFormVisible: false,
      uploadAction: config.API_URL + '/admin/upload',
      uploadPoster: {
        url: '',
        title: '',
        productName:'',
        status: '',
        file:{},
        background:''
      },
      search:'',
      posterList: [],
      productName:'',
      imgSrcList:[],
      dialogVisible:false,
      image:'',
      pageInfo:
      {
         page:1,
         rows:5,
         total:0,
      },
      fileList:[],
      isAdd:false,
      currentFile:{},
      options:[],
      optionButton:true,
      optionsPage:1,
      optionsSize:4,
      tmpOption:"",
    }
  },
  mounted() {
    console.log('Component mounted')
    this.getPosts();
  },
  methods: {
       //getStore
      handleRemoteSearch(query) {
       // this.form.storeName = query;
       this.tmpOption=query;
       this.optionsPage=1;
        // 在这里编写远程搜索的逻辑，发送异步请求到后端接口
        var params={"optionsPage":this.optionsPage,"optionsSize":this.optionsSize,"productName":query}
        // 根据用户输入的内容 query 获取匹配的选项数据
        this.getProductOptionNew(params,1)
      },
      getProductOptionNew(params,type){
        getProductOptionsByPage(params).then(res=>{
           // 然后更新 options 数组
           if(type==1){
            this.options=res.data;
           }else if(type==2){
            this.options = this.options.concat(res.data);
           }
           
           if (this.options.length % this.optionsSize === 0) {
               this.optionButton = true;
             } else {
               this.optionButton = false;
             }
        })
      },
      loadMoreOptions() {
        // 在这里编写加载更多选项的逻辑，发送异步请求到后端接口
        // 根据当前页码和每页大小获取更多的选项数据
        // 然后将新获取的选项数据追加到 options 数组
        this.optionsPage++;
        var params={"optionsPage":this.optionsPage,"optionsSize":this.optionsSize,"productName":this.tmpOption}
        this.getProductOptionNew(params,2)
      },
    getPosts(){
      ListAllPoster({...this.pageInfo,productName:this.search}).then(res=>{
          console.log(res);
          this.pageInfo.total=parseInt(localStorage.getItem('total'))
          this.posterList=res.data;
      })
    },
    handleEdit(index, row){
        this.isAdd=false;
        console.log(this.isAdd);
        this.uploadPoster={...row}
        this.uploadPoster.status==0?this.uploadPoster.status='上架':this.uploadPoster.status='下架'
        if(row.url){
          const name = "图" + 1;
          const param={"name":name,"url":row.url}
          this.fileList.push(param)
          console.log(this.fileList);
        }
        var params={"optionsPage":this.optionsPage,"optionsSize":this.optionsSize,"productName":''}
        this.getProductOptionNew(params,1)
        this.dialogFormVisible=true;
    },
    handleImagePreview(url){
        this.image=url;
        this.dialogVisible=true;
    },
    //添加和修改对话框点击取消
    quit(){
        this.uploadPoster={};
        this.fileList=[];
        this.dialogFormVisible=false;
    },
    AddBT(){
    var params={"optionsPage":this.optionsPage,"optionsSize":this.optionsSize,"productName":''}
    this.getProductOptionNew(params,1)
    this.dialogFormVisible=true;
    this.isAdd=true;
            },
    indexMethod(index) {
                // 假设每页显示10条数据，起始值为 (当前页数 - 1) * 10 + 1
                return (this.pageInfo.page - 1) * this.pageInfo.rows + index + 1;
            },
    handleCurrentChange(newPage){
          this.pageInfo.page=newPage;
          this.loading = true;
        this.getPosts();
      },
      handleSizeChange(newSize){
        console.log(newSize);
          this.pageInfo.rows=newSize;
          this.loading = true;
          this.getPosts();
      },
    handleUploadSuccess(res) {
      this.uploadPoster.url = res
    },
    searchByTitle(){
      this.getPosts();
    },
    handleRemove(file,fileList){
      if(file.url==this.uploadPoster.url){
        this.uploadPoster.url='';
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
    submitUpload(formName) {
      
      this.$refs[formName].validate((valid) => {
      if(valid){
        var _url=this.uploadPoster.url;
        console.log(this.uploadPoster.background);
        this.uploadPoster.status=='上架'?this.uploadPoster.status=0:this.uploadPoster.status=1
        if(_url==''||_url==undefined){
            const formData = new FormData();
            formData.append("files",this.fileList[0].raw) 
            formData.append("prefix",PosterPrefix)
            uploadAll(formData).then(res=>{
                console.log(res);
                var params={...this.uploadPoster,url:res.data[0]}
                console.log(this.isAdd);
                if(this.isAdd==true){
                  console.log("isADD");
                  AddPoster(params).then(res=>{
                this.dialogFormVisible=false;
                this.getPosts();
                })
              }else{
                UpdatePoster(params).then(res=>{
                  this.dialogFormVisible=false;
                  this.getPosts();
                })
              }
           })
        }else{
          var params={...this.uploadPoster}
          UpdatePoster(params).then(res=>{
                  this.dialogFormVisible=false;
                  this.getPosts();
                })
        }
      }
      })
      
    },


    changePosterStatus(index, poster, status) {
      var parmas={...poster,status:status}
      UpdatePoster(parmas).then(res => {
        if(res.code==200){
        poster.status=status
        console.log(poster);
        this.posterList[index].status = status
        }
        this.$message({
          message: res.success?'成功消息：操作成功':res.msg,
          type: res.success?'success':'error'
        });
      })
    },

    handleDeletePoster(index, id) {
      DeletePosterById(id).then(res => {
        this.posterList.splice(index, 1);
        this.$message({
          message: '成功消息：删除成功',
          type: 'success'
        });
      })
    },
    validateFile(rule, value, callback) {
    if (this.fileList.length==1) {
      callback(); // 文件不为空，通过验证
    } else {
      callback(new Error('图片不能为空')); // 文件为空，验证失败
    }
  }
  }
}
</script>

<style scoped>

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

.content {
  padding: 20px 40px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.image {
  width: 100%;
  height: 500px;
}
.el-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-dialog img {
  max-width: 100%;
  max-height: 100%;
}

</style>