<template>
    <div class="film-list">
         <el-input
    type="text"
    size="small"
    prefix-icon="el-icon-search"
    v-model="search"
    placeholder="请输入产品名称"
    style="width: 150px; cursor: pointer"
    @enter="searchByTitle"
  ></el-input>
  <el-input
    type="text"
    size="small"
    prefix-icon="el-icon-search"
    v-model="searchStore"
    placeholder="请输入店铺名称"
    style="width: 150px; cursor: pointer;margin-left:10px"
    @enter="searchByTitle"
  ></el-input>
<el-cascader
             :options="cascaderOptions"
             placeholder="请选择类型"
             :props="{ checkStrictly: true }"
             size="small"
              style="width: 170px;margin-left:10px"
             clearable v-model="categoryNameSearch" 
             :show-all-levels="false"></el-cascader>
  <!-- <el-radio v-model="isParent" label="true" size="small" style="margin-left:10px;" border>父级</el-radio>
  <el-radio v-model="isParent" label="false" size="small" style="margin-left:-18px;" border>子级</el-radio> -->
<el-select v-model="statusSearch" placeholder="请选择状态" size="small"
      style="width: 120px;margin-left:10px" clearable>  
    <el-option
      v-for="item in statusOption"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      >
    </el-option>
  </el-select>
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
                    label="产品名称"
                    prop="productName"
                    >
            </el-table-column>
            <el-table-column label="图片" prop="imgSrcList">
             <template slot-scope="scope">
               <el-image
                 style="width: 100px; height: 100px"
                 :src="scope.row.imgSrcList?scope.row.imgSrcList[0]:''"
                 :preview-src-list="scope.row.imgSrcList"
                 fit="cover">
               </el-image>
             </template>
            </el-table-column>
            <el-table-column
                    label="产品类别"
                    show-overflow-tooltip>
                    <template slot-scope="scope">
                        {{ scope.row.categoryName[scope.row.categoryName.length - 1] }}
                    </template>
            </el-table-column>

            <el-table-column
                    label="产品状态"
                    prop="status"
                    >
            </el-table-column>

            
            <el-table-column label="价格" prop="price" sortable :sort-method="sortProductCount">
            </el-table-column>
            <el-table-column label="店铺名称" prop="storeName">
            </el-table-column>
            <el-table-column label="销售量" prop="salesVolume">
            </el-table-column>
            <el-table-column width="300" align="right">
                
                <template  slot-scope="scope" >
                    <el-button
                            size="mini"
                            icon="el-icon-view"
                            type="primary"
                            style="margin-left:-100px"
                            @click="handleQueryStore(scope.$index, scope.row)">查看商家
                    </el-button>
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
                            title=" 确定要删除此产品吗？ "
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
          :limit="6"
          :file-list="fileList"
          :on-change="handleChange"
          :auto-upload="false"
          >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        </el-form-item>
        <el-form-item label="产品类别" label-width="120px" prop="categoryName">
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
        <el-form-item style="padding-right: 100px" label="店铺名称" label-width="120px" prop="storeName">    
             <el-select
               v-model="form.storeName"
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
           <span class="demonstration" style="margin-left:32px">折扣</span>
           <el-input
              type="text"
              v-model="form.discount"
              placeholder="不填默认无折扣"
              style="width: 80px; cursor: pointer;margin-left: 20px"
            ></el-input>
            <span class="demonstration" style="margin-left:5px">折</span>
        </el-form-item>
        <el-form-item label="当前状态" label-width="120px" prop="status">
            <el-radio-group v-model="form.status">
            <el-radio label="上架"></el-radio>
            <el-radio label="下架"></el-radio>
            <el-radio label="审核中"></el-radio>
            </el-radio-group>
             <span class="demonstration" style="margin-left:32px">单位</span>
           <el-select v-model="form.unit" placeholder="请选择单位" style="width: 120px; margin-left: 20px">
             <el-option label="斤" value="斤"></el-option>
             <el-option label="箱" value="箱"></el-option>
             <el-option label="公斤" value="公斤"></el-option>
             <el-option label="袋" value="袋"></el-option>
             <el-option label="个" value="个"></el-option>
           </el-select>
        </el-form-item>
        <el-form-item label="库存量" label-width="120px" >
            <el-input
            type="text"
            v-model="form.stockQuantity"
            placeholder="库存量"
            style="width: 80px; cursor: not-allowed"
          ></el-input>
          <!-- <span class="demonstration" style="margin-left:5px">斤</span> -->
           <span class="demonstration" style="margin-left:32px">价格</span>
           <el-input
              type="text"
              v-model="form.price"
              placeholder="价格"
              style="width: 80px; cursor: pointer;margin-left: 20px"
            ></el-input>
            <span class="demonstration" style="margin-left:5px">元</span>
            <span class="demonstration" style="margin-left:32px">产地</span>
           <el-input
              type="text"
              v-model="form.origin"
              placeholder="产地"
              style="width: 150px; cursor: pointer;margin-left: 20px"
            ></el-input>
        </el-form-item>
        <el-form-item label="服务" label-width="120px">
          <el-select  v-model="form.serviceMenu" multiple placeholder="请选择"  >
            <el-option
              v-for="item in serviceMenuList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="padding-right: 100px" label="产品描述" label-width="120px">    
          <el-input :rows="8" type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="内容"  >
            <div class="editor-wrapper">
            <quill-editor 
	             class="ql-editor"
	             v-model="form.detailText" 
	             ref="myQuillEditor" 
	             :options="editorOption" 
	             @blur="onEditorBlur($event)" 
	             @focus="onEditorFocus($event)"
	             @change="onEditorChange($event)">
	          </quill-editor>
            </div>
          </el-form-item>
      </el-form>
      <el-upload
        class="avatar-uploader-img"
        :action="uploadUrl"
        :show-file-list="false"
        :on-success="uploadImgSuccess"
        :before-upload="beforeUploadImg"
        :on-error="uploadImgError"
        :data="{'prefix':'common'}"
        :headers="uploadHeaders"
    />
      <div slot="footer" class="dialog-footer">
        <el-button @click="quitAdd">取 消</el-button>
        <el-button type="primary" @click="saveProduct('form')">确 定 保 存</el-button>
      </div>
    </el-dialog>
<el-dialog :visible.sync="dialogVisible">
  <img v-if="currentFile.url" :src="currentFile.url" alt="文件预览" style="max-width: 100%; max-height: 100%;">
  <img v-else-if="currentFile.base64Data" :src="currentFile.base64Data" alt="文件预览" style="max-width: 100%; max-height: 100%;">
</el-dialog>
<el-drawer
  title="我是标题"
  :visible.sync="drawer"
  :direction="direction"
  :with-header="false"
  >
  <el-card class="box-card" shadow="hover">
  <div slot="header" class="clearfix">
    <span>商家信息</span>
    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
  </div>
  <el-descriptions title="店铺信息">
    <el-descriptions-item label="店铺名称">{{ store.storeName }}</el-descriptions-item>
    <el-descriptions-item label="店铺所有者">{{ store.userName }}</el-descriptions-item>
    <el-descriptions-item label="店铺地址">{{ store.storeAddress }}</el-descriptions-item>
    <el-descriptions-item label="联系电话">
      {{ store.contactPhone }}
    </el-descriptions-item>
    <el-descriptions-item label="店铺创建时间">{{ store.createTime }}</el-descriptions-item>
    <el-descriptions-item label="店铺状态">{{ store.status }}</el-descriptions-item>
    <el-descriptions-item label="店铺描述">{{ store.storeDescription }}</el-descriptions-item>
</el-descriptions>
</el-card>

  <el-card class="box-card" shadow="hover">
  <el-descriptions title="店铺所有者信息">
    <el-descriptions-item label="用户名">{{ storeUser.userName }}</el-descriptions-item>
    <el-descriptions-item label="昵称">{{ storeUser.nickName }}</el-descriptions-item>
    <el-descriptions-item label="邮箱">{{ storeUser.email }}</el-descriptions-item>
    <el-descriptions-item label="联系电话">
      {{ storeUser.phone }}
    </el-descriptions-item>
    <el-descriptions-item label="生日">{{ storeUser.birthDay }}</el-descriptions-item>
    <el-descriptions-item label="性别">{{ storeUser.sex }}</el-descriptions-item>
    <el-descriptions-item label="个性签名">{{ storeUser.introduction }}</el-descriptions-item>
</el-descriptions>
</el-card>
</el-drawer>
    </div>
</template>

<script>
    import {getProduceByPage,uploadAll,getCategoryNameList,AddProduct,UpdateProduct,getCascaderOption,DeleteProduct,getParentAndSon,getServiceMenu} from "@/api/information";
    import config from "@/config";
    import service from "../../utils/request"; 
    import {getStoreByStoreId,getStoreSelectOptionsByPage,getUserByStoreId} from "@/api/user";
    import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Quill from 'quill' // 引入编辑器
import { quillEditor } from 'vue-quill-editor'
import axios from 'axios';
// 自定义字体大小
const Size = Quill.import('attributors/style/size')
Size.whitelist = ['10px', '12px', '16px', '18px', '20px', '30px', '32px']
Quill.register(Size, true)

// 自定义字体类型
var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'sans-serif']
var Font = Quill.import('formats/font')

Font.whitelist = fonts
Quill.register(Font, true)
const toolbarOptions =[['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
					  ['blockquote', 'code-block'], // 引用  代码块
					  [{ header: 1 }, { header: 2 }], // 1、2 级标题
					  [{ list: 'ordered' }, { list: 'bullet' }], // 有序、无序列表
					  [{ script: 'sub' }, { script: 'super' }], // 上标/下标
					  [{ indent: '-1' }, { indent: '+1' }], // 缩进
					  [{ direction: 'rtl' }], // 文本方向
					  [{ size: ['12px', false, '16px', '18px', '20px', '30px'] }], // 字体大小
					  [{ header: [1, 2, 3, 4, 5, 6, false] }], // 标题
					  [{ color: [] }, { background: [] }], // 字体颜色、字体背景颜色
					  [{ font: [false, 'SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial'] }], // 字体种类
					  [{ align: [] }], // 对齐方式
					  ['clean'], // 清除文本格式
					  ['link', 'image', 'video'] ]
export default {
  name: "Arrange",
  components: {
    quillEditor,
  },
        data() {
            return {
                rules:{
                status: [
                     { required: true,message: '状态不能为空', trigger: 'blur'}
                ],
                productName :[
                     { required: true,message: '产品名称不能为空', trigger: 'blur'},
                     { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                ],
                storeName:[
                    { required: true, message: '请选择店铺名称', trigger: 'blur' }
                ],
                categoryName:[
                    { required: true, message: '请选择类别', trigger: 'blur' }
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
                  editorOption: {
	              modules: {
		                toolbar: {
                      container:toolbarOptions,
                      handlers: {
                              image: function (value) {
                                  if (value) { // value === true
                                  document.querySelector('.avatar-uploader-img input').click()
                                  } else {
                                  this.quill.format('image', false)
                                  }
                              }
                          }
                    }// 链接、图片、视频
		              },
		              placeholder: '请输入正文'
	            	} ,
                uploadUrl:config.API_URL+'/v1/minio/upload',
                isAdding:false,
                uploadAction: config.API_URL + '/admin/upload',
                url: '',
                tableLoading: false,
                form: {
                    'status':'',
                    'productName':'',
                    "storeName":""
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
                serviceMenuList:[],
                selectedMenu:[],
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
                preList:[],
                storeName:'',
                options: [],
                optionsPage:1,
                optionsSize:4,
                tmpOption:"",
                searchStore:"",
                drawer: false,
                direction: 'rtl',
                store:{},
                storeUser:{},
                optionButton:true,
                token:localStorage.getItem('token'),
            }
        },
        mounted() {
            this.tableLoading = true;
            service.defaults.headers['Authorization'] = localStorage.getItem('token');
            this.loadAllProduct();
            this.getServiceMenuList()
        },
        computed: {
        uploadHeaders() {
          return {
            'Authorization': this.token  // 根据 token 动态生成 headers
          };
        }
        },
        methods: {
            //getStore
               handleRemoteSearch(query) {
                // this.form.storeName = query;
                this.tmpOption=query;
                this.optionsPage=1;
                 // 在这里编写远程搜索的逻辑，发送异步请求到后端接口
                 var params={"optionsPage":this.optionsPage,"optionsSize":this.optionsSize,"storeName":query}
                 // 根据用户输入的内容 query 获取匹配的选项数据
                 getStoreSelectOptionsByPage(params).then(res=>{
                    // 然后更新 options 数组
                    this.options=res.data;
                    if (this.options.length % this.optionsSize === 0) {
                        this.optionButton = true;
                      } else {
                        this.optionButton = false;
                      }
                 })
               },
               getServiceMenuList(){
                  getServiceMenu().then(res=>{
                    this.serviceMenuList=res.data;
                    console.log(this.serviceMenuList);
                  })
               },
               loadMoreOptions() {
                 // 在这里编写加载更多选项的逻辑，发送异步请求到后端接口
                 // 根据当前页码和每页大小获取更多的选项数据
                 // 然后将新获取的选项数据追加到 options 数组
                 this.optionsPage++;
                 var params={"optionsPage":this.optionsPage,"optionsSize":this.optionsSize,"storeName":this.tmpOption}
                 getStoreSelectOptionsByPage(params).then(res=>{
                    // 然后更新 options 数组
                    this.options = this.options.concat(res.data);
                    if (this.options.length % this.optionsSize === 0) {
                        this.optionButton = true;
                      } else {
                        this.optionButton = false;
                      }
                 })
               },
            //展示分页数据
            loadAllProduct(){
                this.getOptions();
                var param={...this.pageInfo,productName:this.search,categoryName:this.categoryNameSearch,status:this.statusSearch,storeName:this.searchStore}
                console.log(param);
                getProduceByPage(param).then(res => {
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
                const isJPG = file.name.toLowerCase().endsWith('.jpg');
                const isPNG = file.name.toLowerCase().endsWith('.png');
               const isLt500K = file.size / 1024 < 500;

               if (!isJPG && !isPNG) {
                 this.$message.error('只能上传jpg/png文件');
               }
               if (!isLt500K) {
                 this.$message.error('文件大小不能超过500kb');
               }

               if( (isJPG || isPNG) && isLt500K){this.fileList=fileList;
                }else{
                  const index = fileList.indexOf(file);
                  fileList.splice(index, 1);
                };
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
                var params={"optionsPage":this.optionsPage,"optionsSize":this.optionsSize,"storeName":this.storeName}
            getStoreSelectOptionsByPage(params).then(res=>{
                    // 然后更新 options 数组
                    this.options=res.data;
                 })
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
              var params={"optionsPage":this.optionsPage,"optionsSize":this.optionsSize,"storeName":''}
            getStoreSelectOptionsByPage(params).then(res=>{
                    // 然后更新 options 数组
                    this.options=res.data;
                 })
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
                console.log(row);
                this.form = { ...row};
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
                    this.loadAllProduct(); 
                    }
                })
                
            },
            handleQueryStore(index,row){
                getStoreByStoreId(row.storeId).then(res=>{
                  this.store=res.data;
                })
                getUserByStoreId(row.storeId).then(res=>{
                  this.storeUser=res.data;
                })
                this.drawer=true;
            },
            handleUploadSuccess(res) {
                this.url = res;
            },
            handleCurrentChange(newPage){
                this.pageInfo.page=newPage;
                this.tableLoading = true;
            getProduceByPage(this.pageInfo).then(res => {
                setTimeout(() => {
                    this.productList = res.data;
                    this.tableLoading = false;
                }, 700)
            })
            },
            handleSizeChange(newSize){
                this.pageInfo.rows=newSize;
                this.loadAllProduct()
            },
            searchByTitle(){
              console.log(this.categoryNameSearch);
            this.loadAllProduct();
            },
            quitAdd(){
                this.dialog1=false;
                this.fileList=[];
                this.form={};
                this.selectedValues=[];
                this.optionButton=true;
                this.optionsPage=1;
                this.optionsSize=4;
            },
            saveProduct(formName){
                const formData = new FormData();
                 // 获取日期选择器选择的日期
                var selectedDate = new Date(this.form.productionDate);
                // 将日期转换为时间戳（单位：毫秒）
                var timestamp = selectedDate.getTime();
                this.form.productionDate=timestamp;      
                this.$refs[formName].validate((valid) => {
                        if (valid) {
                      var isAdd=this.form.id;
                      if(!isAdd){
                        for(var i=0; i<this.fileList.length;i++){
                          formData.append("files",this.fileList[i].raw) 
                        }  
                        formData.append("prefix","product")  
                        uploadAll(formData).then(res=>{
                          this.imgUrlList=res.data;
                          var params={...this.form,imgSrcList:this.imgUrlList}
                          AddProduct(params).then(res=>{
                          this.dialog1=false;
                          this.loadAllProduct();
                      })})
                      }else{
                        for(var i=0; i<this.fileList.length;i++){
                          formData.append("files",this.fileList[i].raw) 
                        }  
                        formData.append("prefix","product") 
                        uploadAll(formData).then(res=>{
                          console.log(res.data.length);
                          for(var i=0;i<res.data.length;i++){
                          this.imgUrlList.push(res.data[i])
                          }
                          var params={...this.form,imgSrcList:this.imgUrlList}
                          UpdateProduct(params).then(res=>{
                                this.dialog1=false;
                                
                                setTimeout(() => {
                                    this.loadAllProduct();
                                }, 500);
                              })
                        })
                      }
                      }
                    })
                
                 
            },
                // 失去焦点事件
		  onEditorBlur(quill) {
		    console.log('editor blur!', quill)
		  },
		// 获得焦点事件
		  onEditorFocus(quill) {
		    console.log('editor focus!', quill)
		  },
		// 准备富文本编辑器
		  onEditorReady(quill) {
		    console.log('editor ready!', quill)
		  },
		// 内容改变事件
		  onEditorChange({ quill, html, text }) {
		    console.log('editor change!', quill, html, text)
        html = html.replace(/<img/gi, '<img style="width:100%;height:auto"');
		    // this.form.detailText = html
		  },
      beforeUploadImg(file) {//富文本图片上传前
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG，PNG, GIF 格式!')
      } else {
        // 显示loading动画
        this.quillUpdate = true
      }
      return isJPG
    },
    uploadImgSuccess(res, file) {//富文本图片上传成功
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      const quill = this.$refs.myQuillEditor.quill
    
        console.info(res)
        // 获取光标所在位置
        const length = quill.getSelection().index
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', res.data, { style: 'width: 100px; height: 100px;' });
        // 调整光标到最后
        quill.setSelection(length + 1)
      
      // loading动画消失
      this.quillUpdate = false
    },
    uploadImgError() {//富文本图片上传失败
      // loading动画消失
      this.quillUpdate = false
      this.$message.error('图片插入失败!')
    },
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
.el-descriptions-item {
    display: block;
}
 .quill-editor ::v-deep .ql-container {
    min-height: 220px;
    
  }

  .ql-container {
    min-height: 230px;
  }

 ::v-deep .ql-snow .ql-tooltip [data-mode="link"]::before {
      content: "请输入链接地址:";
      left: 0;
    }

 ::v-deep   .ql-snow .ql-tooltip.ql-editing {
      left: 0 !important;
    }

::v-deep    .ql-snow .ql-tooltip {
      left: 0 !important;
    }

::v-deep    .ql-snow  .ql-editor {
      max-height: 300px;
     
    }
::v-deep .ql-editor {
    width: 100% !important;;
  /* margin-bottom: 30px; */
    }
 ::v-deep   .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
      border-right: 0px;
      content: "保存";
      padding-right: 0px;
    }

 ::v-deep   .ql-snow .ql-tooltip[data-mode="video"]::before {
      content: "请输入视频地址:";
    }

 ::v-deep   .ql-snow .ql-picker.ql-size .ql-picker-label::before, ::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item::before {
      content: "14px" !important;
      font-size: 14px;
    }

  ::v-deep  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="10px"]::before,::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="10px"]::before {
      content: "10px" !important;
      font-size: 10px;
    }

 ::v-deep   .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="12px"]::before,::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="12px"]::before {
      content: "12px" !important;
      font-size: 12px;
    }

 ::v-deep   .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
      content: "16px" !important;
      font-size: 16px;
    }

::v-deep    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
      content: "18px" !important;
      font-size: 18px;
    }

::v-deep    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
      content: "20px" !important;
      font-size: 20px;
    }

::v-deep    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="30px"]::before,::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="30px"]::before {
      content: "30px" !important;
      font-size: 30px;
    }

::v-deep    .ql-snow .ql-picker.ql-size .ql-picker-label[data-value="32px"]::before,::v-deep .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="32px"]::before {
      content: "32px" !important;
      font-size: 32px;
    }

::v-deep    .ql-snow .ql-picker.ql-header .ql-picker-label::before,::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item::before {
      content: "文本" !important;
    }

::v-deep    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
      content: "标题1" !important;
    }

::v-deep    .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
      content: "标题2" !important;
    }

::v-deep  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
      content: "标题3" !important;
    }

::v-deep   .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
      content: "标题4" !important;
    }

 ::v-deep   .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
      content: "标题5" !important;
    }

  ::v-deep  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,::v-deep .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
      content: "标题6" !important;
    }

  ::v-deep  .ql-snow .ql-picker.ql-font .ql-picker-label::before,::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item::before {
      content: "标准字体" !important;
    }

 ::v-deep   .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
      content: "衬线字体" !important;
    }

  ::v-deep  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
      content: "等宽字体" !important;
    }

 ::v-deep   .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimSun"]::before,::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimSun"]::before {
      content: "宋体" !important;
      font-family: "SimSun";
    }

  ::v-deep  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimHei"]::before,::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimHei"]::before {
      content: "黑体" !important;
      font-family: "SimHei";
    }

::v-deep    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="Microsoft-YaHei"]::before,::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="Microsoft-YaHei"]::before {
      content: "微软雅黑" !important;
      font-family: "Microsoft YaHei";
    }

 ::v-deep   .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="KaiTi"]::before,::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="KaiTi"]::before {
      content: "楷体" !important;
      font-family: "KaiTi";
    }

  ::v-deep  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="FangSong"]::before,::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="FangSong"]::before {
      content: "仿宋" !important;
      font-family: "FangSong";
    }

 ::v-deep   .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="Arial"]::before,::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="Arial"]::before {
      content: "Arial" !important;
      font-family: "Arial";
    }

 ::v-deep   .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="Times-New-Roman"]::before,::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="Times-New-Roman"]::before {
      content: "Times New Roman" !important;
      font-family: "Times New Roman";
    }

::v-deep    .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="sans-serif"]::before,::v-deep .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="sans-serif"]::before {
      content: "sans-serif" !important;
      font-family: "sans-serif";
    }

 ::v-deep   .ql-font-SimSun {
      font-family: "SimSun";
    }

::v-deep    .ql-font-SimHei {
      font-family: "SimHei";
    }

::v-deep    .ql-font-Microsoft-YaHei {
      font-family: "Microsoft YaHei";
    }

::v-deep    .ql-font-KaiTi {
      font-family: "KaiTi";
    }

::v-deep    .ql-font-FangSong {
      font-family: "FangSong";
    }

 ::v-deep   .ql-font-Arial {
      font-family: "Arial";
    }

 ::v-deep   .ql-font-Times-New-Roman {
      font-family: "Times New Roman";
    }

 ::v-deep   .ql-font-sans-serif {
      font-family: "sans-serif";
    }

::v-deep    .ql-snow.ql-toolbar .ql-formats .ql-revoke {
      /* background-image: url("../../../../assets/images/icons8-rotate-left-18.png"); */
      width: 20px;
      height: 20px;
      filter: grayscale(100%);
      opacity: 1;
    }

::v-deep    .ql-snow.ql-toolbar .ql-formats .ql-revoke:hover {
      /* background-image: url("../../../../assets/images/icons8-rotate-left-18.png"); */
      width: 20px;
      height: 20px;
      filter: none;
      opacity: 0.9;
    }

/* ::v-deep    img {
      filter: grayscale(100%);
      opacity: 1;
    }

 ::v-deep   img:hover {
      filter: none;
      opacity: 0.9;
    } */

    /*加上height和滚动属性就可以，滚动条样式是系统默认样式，可能不同*/
::v-deep    .ql-toolbar.ql-snow .ql-picker.ql-expanded .ql-picker-options {
      border-color: #ccc;
      height: 125px;
      overflow: auto;
    }
</style>
