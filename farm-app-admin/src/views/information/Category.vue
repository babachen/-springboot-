<template>
    <div class="film-list">
         <el-input
    type="text"
    size="small"
    prefix-icon="el-icon-search"
    v-model="search"
    placeholder="请输入分类名称"
    style="width: 270px; cursor: pointer"
    @enter="searchByTitle"
  ></el-input>
<el-select v-model="isParent" clearable placeholder="请选择" size="small" style="margin-left: 5px;" @change="loadAllCategory">
    <el-option :label="'父类'" :value="true"></el-option>
    <el-option :label="'子类'" :value="false"></el-option>
  </el-select>
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
<el-badge :value="parentCount" class="item">
  <el-button size="small"  >父级类名</el-button>
</el-badge>
<el-badge :value="sonCount" class="item">
  <el-button size="small" >子级类名</el-button>
</el-badge>
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
                :data="categoryList"
                style="width: 100%"
                :row-class-name="tableRowClassName"
                >

            <el-table-column label="序号" type="index" width="100" :index="indexMethod">
                
            </el-table-column>

            <el-table-column
                    label="分类名称"
                    prop="categoryName"
                    >
            </el-table-column>

            <el-table-column
                    label="分类描述"
                    prop="description"
                    show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="创建时间" prop="createTime" width="180">
                
            </el-table-column>

            <el-table-column
                    label="当前状态"
                    prop="status">
            </el-table-column>
            <el-table-column label="产品数" prop="productCount" sortable :sort-method="sortProductCount">
            </el-table-column>
            <el-table-column width="260" align="right">
                
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
                            title=" 确定要删除此分类吗？ "
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
        <el-form-item label="分类名称" label-width="120px" prop="categoryName">
          <el-input
            type="text"
            v-model="form.categoryName"
            placeholder="请输入标题"
            style="width: 200px; cursor: pointer"
          ></el-input>
        </el-form-item>
        <el-form-item label="父级类名" label-width="120px">
          <el-select v-model="form.parentCategoryName" placeholder="请选择类名" style="width: 200px; cursor: pointer">
            <el-option v-for="(item,index) in parentCategoryOptions" :key="index" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="padding-right: 100px" label="分类描述" label-width="120px">    
          <el-input :rows="8" type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="当前状态" label-width="120px" prop="status">
            <el-radio-group v-model="form.status">
            <el-radio label="启用"></el-radio>
            <el-radio label="禁用"></el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="产品数量" label-width="120px" v-show="!isAdding">
            <el-input
            type="text"
            v-model="form.productCount"
            placeholder="产品数量"
            style="width: 200px; cursor: not-allowed"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quitAdd">取 消</el-button>
        <el-button type="primary" @click="saveCategory('form')">确 定 保 存</el-button>
      </div>
    </el-dialog>
    </div>
</template>

<script>
    import {getCategoryByPage,getCategoryNameList,AddCategory,UpdateCategory,deleteCategory,getParentAndSon} from "@/api/information";
    import config from "@/config";
    import service from "../../utils/request"; 
    export default {
        data() {
            return {
                rules:{
                status: [
                     { required: true,message: '状态不能为空', trigger: 'blur'}
                ],
                categoryName :[
                     { required: true,message: '分类名称不能为空', trigger: 'blur'},
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
                    categoryName: '',
                    parentCategoryName: '',
                    description: '',
                    status: '',
                    productCount: ''
                },
                categoryList: [],
                parentCategoryOptions: [
                
                ],
                search: '',
                dialog1: false,
                dialog2: false,
                parentCount:0,
                sonCount:0,
                isParent:'',
            }
        },
        mounted() {
            this.tableLoading = true;
            service.defaults.headers['Authorization'] = localStorage.getItem('token');
            this.loadAllCategory();
            this.setOptions();
        },
        methods: {
            //展示分页数据
            loadAllCategory(){
                var param={...this.pageInfo,categoryName:this.search,isParent:this.isParent}
                getCategoryByPage(param).then(res => {
                setTimeout(() => {
                    this.categoryList = res.data;
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
            //产品数量的排序
            sortProductCount(a, b) {
              if (this.sortOrder === 'ascending') {
                return a.productCount - b.productCount;
              } else {
                return b.productCount - a.productCount;
              }
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

            //点击编辑
            handleEdit(index, row) {
                this.isAdding=false;
                this.form={...row}
                this.dialog1 = true;
            },

            handleArrange(index, row) {
                this.dialog2 = true;
                this.arrangement.name = row.name
                this.arrangement.fid = row.id
            },

            handleDelete(index, row) {
                deleteCategory(row.categoryId).then(res=>{
                    if(res.code==200){
                        this.$message({
                    type: 'success',
                    message: '删除成功!'
                    });
                    this.loadAllCategory(); 
                    }
                })
                
            },

            handleUploadSuccess(res) {
                this.url = res;
            },
            handleCurrentChange(newPage){
                this.pageInfo.page=newPage;
                this.tableLoading = true;
            getCategoryByPage(this.pageInfo).then(res => {
                setTimeout(() => {
                    this.categoryList = res.data;
                    this.tableLoading = false;
                }, 700)
            })
            },
            handleSizeChange(newSize){
                this.pageInfo.rows=newSize;
                getCategoryByPage(this.pageInfo).then(res => {
                setTimeout(() => {
                    this.categoryList = res.data;
                    this.tableLoading = false;
                }, 700)
            })
            },
            searchByTitle(){
            this.loadAllCategory();
            },
            quitAdd(){
                this.dialog1=false;
                this.form={};
            },
            saveCategory(formName){
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                    var that=this;
                var isAdd=this.form.categoryId;
                console.log(isAdd);
                if(!isAdd){
                    AddCategory(this.form).then(res=>{
                    this.dialog1=false;
                    this.loadAllCategory();
                    
                })
                }else{
                    UpdateCategory(this.form).then(res=>{
                    this.dialog1=false;
                    this.loadAllCategory();
                             
                })
                }
                } else {
                    console.log('error submit!!');
                    return false;
                  }
                });
                
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
