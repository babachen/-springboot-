<template>
    <div class="film-list">
         <el-input
    type="text"
    size="small"
    prefix-icon="el-icon-search"
    v-model="search"
    placeholder="请输入标题"
    style="width: 270px; cursor: pointer"
    @enter="searchByTitle"
  ></el-input>
<el-button
      
      icon="el-icon-search"
      type="success"
      size="small"
      style="margin-left: 30px"
      @click="searchByTitle">
      搜索
    </el-button>
<el-button
      
      icon="el-icon-delete"
      type="danger"
      size="small"
      @click="search=''">
      重置
    </el-button>
<el-button
      
      icon="el-icon-circle-plus"
      type="success"
      size="small"
      style="margin-left: 30px;float: right"
      @click="dialog1=true">
      添加
    </el-button>

        <el-table
                v-loading="tableLoading"
                :data="noticeList"
                style="width: 100%">

            <el-table-column label="序号" type="index" width="100" :index="indexMethod">
                
            </el-table-column>

            <el-table-column
                    label="标题"
                    prop="title">
            </el-table-column>

            <el-table-column
                    label="内容"
                    prop="content"
                    show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="创建时间" prop="createTime">
                
            </el-table-column>

            <el-table-column
                    label="创建人"
                    prop="createUserName">
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
                            title=" 确定要删除此公告吗？ "
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

    <el-dialog title="信息" :visible.sync="dialog1" @close='quitAdd' >
      <el-form :model="form" :ref="form" :rules="rules">
        <el-form-item label="标题" label-width="120px" prop="title">
          <el-input
            type="text"
            size="small"
            v-model="form.title"
            placeholder="请输入标题"
            style="width: 270px; cursor: pointer"
          ></el-input>
        </el-form-item>
        <el-form-item style="padding-right: 100px" label="主要内容" label-width="120px" prop="content">
          <el-input :rows="8" type="textarea" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quitAdd">取 消</el-button>
        <el-button type="primary" @click="saveNotice(form)">确 定 保 存</el-button>
      </div>
    </el-dialog>
    </div>
</template>

<script>
    import {ListAllNotice,AddNotice ,UpdateNotice,RemoveNotice,UpdateFilm, AddArrangement} from "@/api/information";
    import config from "@/config";
    import service from "../../utils/request"; 
    export default {
        data() {
            return {
                rules:{
                    title:[
                        { required: true,message: '标题不能为空', trigger: 'blur'},
                        { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                    ],
                    content:[
                        { required: true,message: '内容不能为空', trigger: 'blur'}
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
                uploadAction: config.API_URL + '/admin/upload',
                url: '',
                tableLoading: false,
                form: {
                    id:'',
                    title:'',
                    content:''
                },
                noticeList: [],
                search: '',
                dialog1: false,
                dialog2: false,
            }
        },

        mounted() {
            this.tableLoading = true;
            service.defaults.headers['Authorization'] = localStorage.getItem('token');
            this.loadAllNotice();
        },

        methods: {
            loadAllNotice(){
                ListAllNotice(this.pageInfo).then(res => {
                setTimeout(() => {
                    this.noticeList = res.data;
                    this.tableLoading = false;
                    this.pageInfo.total=parseInt(localStorage.getItem('total'))
                    console.log(this.pageInfo.total);
                }, 700)
            })
            },
            //设置序号
            indexMethod(index) {
                // 假设每页显示10条数据，起始值为 (当前页数 - 1) * 10 + 1
                
                return (this.pageInfo.page - 1) * this.pageInfo.rows + index + 1;
            },
            

            handleEdit(index, row) {
                this.dialog1 = true;
                this.form={...row}
            },

            handleDelete(index, row) {
                var that =this;
                RemoveNotice(row.id).then(res=>{
                    that.loadAllNotice();
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                    });
                })
            },
            handleCurrentChange(newPage){
                this.pageInfo.page=newPage;
                this.tableLoading = true;
            ListAllNotice(this.pageInfo).then(res => {
                setTimeout(() => {
                    this.noticeList = res.data;
                    this.tableLoading = false;
                }, 700)
            })
            },
            handleSizeChange(newSize){
                this.pageInfo.rows=newSize;
                ListAllNotice(this.pageInfo).then(res => {
                setTimeout(() => {
                    this.noticeList = res.data;
                    this.tableLoading = false;
                }, 700)
            })
            },
            searchByTitle(){
                var param={...this.pageInfo,title:this.search}
                ListAllNotice(param).then(res => {
                setTimeout(() => {
                    this.noticeList = res.data;
                    this.tableLoading = false;
                    this.pageInfo.total=parseInt(localStorage.getItem('total'))
                }, 700)
            })
            },
            quitAdd(){
                this.dialog1=false;
                this.form['content']='';
                this.form['title']='';
            },
            saveNotice(formName){
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                    var that=this;
                var isAdd=this.form.id;
                if(isAdd==''){
                    AddNotice(this.form).then(res=>{
                    this.dialog1=false;
                    that.loadAllNotice();
                    this.$message({
                    type: 'success',
                    message: '保存成功!'
                    });
                })
                }else{
                    UpdateNotice(this.form).then(res=>{
                    this.dialog1=false;
                    that.loadAllNotice();
                    this.$message({
                    type: 'success',
                    message: '保存成功!'
                    });
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

<style scoped>
    .film-list {
        padding: 20px;
    }
</style>
