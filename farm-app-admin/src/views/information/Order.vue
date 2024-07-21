<template>
    <div class="film-list">
         <el-input
    type="text"
    size="small"
    prefix-icon="el-icon-search"
    v-model="search"
    placeholder="请输入订单编号"
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
      
      icon="el-icon-circle-plus"
      type="success"
      size="small"
      style="margin-left: 30px;float: right"
      @click="AddBT">
      添加
    </el-button>

        <el-table
                v-loading="tableLoading"
                :data="productList"
                style="width: 100%"
                :row-class-name="tableRowClassName"
                >

            <el-table-column label="序号" type="index" width="100" :index="indexMethod">
                
            </el-table-column>

            <el-table-column
                    label="下单用户"
                    prop="createNickName"
                    >
            </el-table-column>
            <el-table-column
                    label="订单编号"
                    prop="orderNumber"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>

            <el-table-column width="200"
                    label="下单时间"
                    prop="createTime"
                    >
            </el-table-column>

            
            <el-table-column label="订单价格" prop="totalAmount" sortable :sort-method="sortProductCount">
            </el-table-column>
            <el-table-column label="订单状态" prop="status" sortable :sort-method="sortProductCount">
            </el-table-column>
            <el-table-column width="300" align="right">
                
                <template  slot-scope="scope" >
                    <el-button
                            size="mini"
                            icon="el-icon-view"
                            type="primary"
                            style="margin-left:-100px"
                            @click="handleQueryDetail(scope.$index, scope.row)">查看详情
                    </el-button>
                    <el-button
                            size="mini"
                            icon="el-icon-edit"
                            type="primary"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <!-- <el-popconfirm
                            confirm-button-text='确定'
                            cancel-button-text='不用了'
                            icon="el-icon-info"
                            icon-color="red"
                            @confirm=handleDelete(scope.$index,scope.row)
                            title=" 确定要删除此产品吗？ "
                    >
                        <el-button
                                style="margin-left: 8px"
                                size="mini"
                                icon="el-icon-delete"
                                type="danger"
                                slot="reference">删除
                        </el-button>
                    </el-popconfirm> -->
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
        <el-form-item label="产品名称" label-width="120px" prop="productName">
          <el-input
            type="text"
            v-model="form.productName"
            placeholder="请输入产品名称"
            style="width: 200px; cursor: pointer"
          ></el-input>
          <span class="demonstration" style="margin-left:20px">生产日期</span>
            <el-date-picker
              v-model="form.productionDate"
              type="date"
              style="margin-left:20px"
              placeholder="选择日期">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="产品图片" label-width="120px" prop="fileList">
        <el-upload
          class="upload-demo"
          action="#"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
           multiple
          :limit="3"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :on-change="handleChange"
          :auto-upload="false">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        </el-form-item>
        <el-form-item label="产品类别" label-width="120px">
          <!-- <el-select v-model="form.categoryName" placeholder="请选择类名" style="width: 200px; cursor: pointer">
            <el-option v-for="(item,index) in parentCategoryOptions" :key="index" :label="item" :value="item"></el-option>
          </el-select> -->
          <el-cascader
             :options="cascaderOptions"
             :props="{ checkStrictly: true }"
             clearable v-model="form.categoryName" ></el-cascader>
          <span class="demonstration" style="margin-left:20px">保质期</span>
            <el-input
              type="text"
              v-model="form.shelfLife"
              placeholder="保质期"
              style="width: 80px; cursor: pointer;margin-left: 20px"
            ></el-input>
            <span class="demonstration" style="margin-left:5px">天</span>
        </el-form-item>
        <el-form-item label="当前状态" label-width="120px" prop="status">
            <el-radio-group v-model="form.status">
            <el-radio label="上架"></el-radio>
            <el-radio label="下架"></el-radio>
            <el-radio label="审核中"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="库存量" label-width="120px" >
            <el-input
            type="text"
            v-model="form.stockQuantity"
            placeholder="库存量"
            style="width: 80px; cursor: not-allowed"
          ></el-input>
          <span class="demonstration" style="margin-left:5px">斤</span>
           <span class="demonstration" style="margin-left:32px">价格</span>
           <el-input
              type="text"
              v-model="form.price"
              placeholder="价格"
              style="width: 80px; cursor: pointer;margin-left: 20px"
            ></el-input>
            <span class="demonstration" style="margin-left:5px">元/斤</span>
            <span class="demonstration" style="margin-left:32px">产地</span>
           <el-input
              type="text"
              v-model="form.origin"
              placeholder="产地"
              style="width: 150px; cursor: pointer;margin-left: 20px"
            ></el-input>
        </el-form-item>
        <el-form-item style="padding-right: 100px" label="产品描述" label-width="120px">    
          <el-input :rows="8" type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quitAdd">取 消</el-button>
        <el-button type="primary" @click="saveCategory('form')">确 定 保 存</el-button>
      </div>
    </el-dialog>
<el-dialog :visible.sync="dialogVisible">
  <img v-if="currentFile.url" :src="currentFile.url" alt="文件预览" style="max-width: 100%; max-height: 100%;">
  <img v-else-if="currentFile.base64Data" :src="currentFile.base64Data" alt="文件预览" style="max-width: 100%; max-height: 100%;">
</el-dialog>
    </div>
</template>

<script>
    import {getOrderByPage,uploadAll,getCategoryNameList,AddProduct,UpdateProduct,getCascaderOption,DeleteProduct,getParentAndSon} from "@/api/information";
    import config from "@/config";
    import service from "../../utils/request"; 
import axios from 'axios';
    export default {
        data() {
            return {
                rules:{
                status: [
                     { required: true,message: '状态不能为空', trigger: 'blur'}
                ],
                productName :[
                     { required: true,message: '产品名称不能为空', trigger: 'blur'},
                     { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
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
                uploadAction: config.API_URL + '/admin/upload',
                url: '',
                tableLoading: false,
                form: {
                    'status':'',
                    'productName':''
                },
                productList: [],
                parentCategoryOptions: [
                
                ],
                search: '',
                dialog1: false,
                dialog2: false,
                parentCount:0,
                sonCount:0,
                isParent:'',
                imgUrlList:[],
                fileList:[],
                productDate:'',
                dialogVisible: false,
                currentFile: {},
                cascaderOptions: [],  // 用于存储后端返回的级联选择器数据
                selectedValues: [] ,
                statusOption:[
                  {
                    value: '上架',
                    label: '上架'
                  },
                  {
                    value: '下架',
                    label: '下架'
                  },
                  {
                    value: '审核中',
                    label: '审核中'
                  }
                ], // 用于存储选中的值
                categoryNameSearch:'',
                statusSearch:'',
                oldList:[],
                preList:[]
            }
        },
        mounted() {
            this.tableLoading = true;
            service.defaults.headers['Authorization'] = localStorage.getItem('token');
            this.loadAllOrder();
        },
        methods: {
            //展示分页数据
            loadAllOrder(){
                var param={...this.pageInfo,orderNumber:this.search,status:this.statusSearch}
                console.log(param);
                getOrderByPage(param).then(res => {
                setTimeout(() => {
                    this.productList = res.data;
                    this.tableLoading = false;
                    this.pageInfo.total=parseInt(localStorage.getItem('total'))
                    this.setOptions();     
                }, 700)
            })
            this.getParentAndSon();
            },
            //父级类名标记
            tableRowClassName({row, rowIndex}) {    
             if (!row.parentCategoryName) {
               return 'success-row';
             } 
             return '';
           },
           //获取级联选择器数据
           getOptions(){
              getCascaderOption().then(res=>{
                this.cascaderOptions=res.data;
              })
           },
           handleQueryDetail  (index, row) {
               // 获取要跳转的页面路径，假设为 /detail/${row.id}
               const detailPath = `/information/order/detail/${row.id}`;
               // 使用 $router.push 进行页面跳转
               this.$router.push(detailPath);
             },
            //产品数量的排序
            sortProductCount(a, b) {
              if (this.sortOrder === 'ascending') {
                return a.productCount - b.productCount;
              } else {
                return b.productCount - a.productCount;
              }
            },
            handleRemove(file, fileList){
                this.fileList=fileList;
                console.log(this.preList);
                if(this.preList){
                  for(var i=0;i<this.preList.length;i++){
                    if(this.preList[i]===file.url){
                        //删除this.preList[i]
                        this.preList.splice(i, 1);  // 从 this.preList 中删除与被移除文件 URL 相匹配的项
                        break;
                    }
                  }
                  this.imgSrcList=this.preList;
                  console.log(this.imgSrcList);
                }
            },
            handleExceed(response, file, fileList){
                console.log("上传成功");
            },
            handlePreview(file) {
             
                // 清除之前的图片数据
                this.currentFile = {};
                console.log(file);
                if (file.url) {
                  // 文件已经上传到服务器并具有 URL
                  this.currentFile = file;
                  this.dialogVisible = true;  // 打开预览对话框
                } else if (file.raw instanceof Blob) {
                  // 文件未上传到服务器，使用FileReader来读取文件并显示预览
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    this.currentFile.base64Data = e.target.result;
                    this.dialogVisible = true;  // 打开预览对话框
                  };
                  reader.readAsDataURL(file.raw);
                } else {
                  // 处理文件无效的情况
                  console.error('Invalid file');
                }
              },
            handleChange(file, fileList){
               this.fileList=fileList;
                console.log(this.fileList);
            },
            //获取父级标签和子级标签个数
            getParentAndSon(){
                getParentAndSon().then(res=>{
                    this.parentCount=res.data.parent;
                    this.sonCount=res.data.son;
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
            //设置多选框数据
            setOptions(){
                getCategoryNameList().then(res=>{
                    if(res.code==200){
                        this.parentCategoryOptions=res.data
                    }
                })
            },
            submitUpdate() {
                this.form.cover = this.url;
                UpdateFilm(this.form).then(res => {
                    this.dialog1 = false;
                })
            },
          // 定义一个方法，将URL转换为文件对象
              async urlToFile(url, filename) {
                try {
                  // 使用Fetch API获取URL对应的数据
                  const response = await fetch(url);
                  const blob = await response.blob();

                  // 创建文件对象
                  const file = new File([blob], filename, { type: blob.type });

                  // 将文件对象存入fileList数组
                  this.fileList.push(file);
                } catch (error) {
                  console.error('Error:', error);
                }
              },
            //点击编辑
            handleEdit(index, row) {
                this.isAdding = false;
               if (row.imgSrcList) {    
                for(var i=0;i<row.imgSrcList.length;i++){
                const name = "图" + (i + 1);
                const param={"name":name,"url":row.imgSrcList[i]}
                this.fileList.push(param)
                }
            }   
                this.imgUrlList=[];
                if(row.imgSrcList){
                  console.log(row.imgSrcList);
                this.oldList=row.imgSrcList;
                this.preList=row.imgSrcList;
                this.imgUrlList=row.imgSrcList;
                }
                console.log(this.preList);
                this.form = { ...row };
                this.dialog1 = true;
            },

            handleArrange(index, row) {
                this.dialog2 = true;
                this.arrangement.name = row.name
                this.arrangement.fid = row.id
            },

            handleDelete(index, row) {
                DeleteProduct(row.id).then(res=>{
                    if(res.code==200){
                    this.loadAllOrder(); 
                    }
                })
                
            },

            handleUploadSuccess(res) {
                this.url = res;
            },
            handleCurrentChange(newPage){
                this.pageInfo.page=newPage;
                this.tableLoading = true;
                this.loadAllOrder()
            },
            handleSizeChange(newSize){
                this.pageInfo.rows=newSize;
                this.loadAllOrder()
            },
            searchByTitle(){
              console.log(this.categoryNameSearch);
            this.loadAllOrder();
            },
            quitAdd(){
                this.dialog1=false;
                this.fileList=[];
                this.form={};
                this.selectedValues=[]
            },
            saveCategory(formName){
                const formData = new FormData();
                 // 获取日期选择器选择的日期
                var selectedDate = new Date(this.form.productionDate);
                // 将日期转换为时间戳（单位：毫秒）
                var timestamp = selectedDate.getTime();
                this.form.productionDate=timestamp;      
                this.$refs[formName].validate((valid) => {
                        if (valid) {
                      var isAdd=this.form.id;
                      console.log(isAdd);
                      if(!isAdd){
                        for(var i=0; i<this.fileList.length;i++){
                          formData.append("files",this.fileList[i].raw) 
                        }  
                        uploadAll(formData).then(res=>{
                          this.imgUrlList=res.data;
                          var params={...this.form,imgSrcList:this.imgUrlList}
                          AddProduct(params).then(res=>{
                          this.dialog1=false;
                          this.loadAllOrder();
                      })})
                      }else{  
                        for(var i=0; i<this.fileList.length;i++){
                          formData.append("files",this.fileList[i].raw) 
                        }  
                        uploadAll(formData).then(res=>{
                          console.log(res.data.length);
                          for(var i=0;i<res.data.length;i++){
                          this.imgUrlList.push(res.data[i])
                          }
                          var params={...this.form,imgSrcList:this.imgUrlList}
                          UpdateProduct(params).then(res=>{
                                this.dialog1=false;
                                this.loadAllOrder();
                              })
                        })
                      }
                      }
                    })
                
                 
            }
        },
    }
</script>

<style>
    .film-list {
        padding: 20px;
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
