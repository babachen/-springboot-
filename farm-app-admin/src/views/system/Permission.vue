<template>
    <div class="film-list">
         <el-input
    type="text"
    size="small"
    prefix-icon="el-icon-search"
    v-model="search"
    placeholder="请输入路径"
    style="width: 270px; cursor: pointer"
    @enter="loadAllPermissions"
  ></el-input>
<el-button
      
      icon="el-icon-search"
      type="success"
      size="small"
      style="margin-left: 30px"
      @click="loadAllPermissions">
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
                    label="URL路径"
                    prop="url"
                     width="300">
            </el-table-column>

            <el-table-column
                    label="请求方式"
                    prop="method"
                    show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="访问权限" prop="role">
                
            </el-table-column>

            <el-table-column
                    label="描述"
                    prop="description">
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
                            title=" 确定要删除这条权限吗？ "
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

    <el-dialog title="权限" :visible.sync="dialog1" @close='quitAdd' >
      <el-form :model="form" :ref="form" :rules="rules">
        <el-form-item label="路径" label-width="120px" prop="url">
          <el-input
            type="text"
            size="small"
            v-model="form.url"
            placeholder="请输入路径"
            style="width: 270px; cursor: pointer"
          ></el-input>
        </el-form-item>
        <el-form-item style="padding-right: 100px" label="请求方法" label-width="120px" prop="method">
          <el-select v-model="form.method" placeholder="请选择">
            <el-option
                v-for="item in methodOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        </el-form-item>
        <el-form-item style="padding-right: 100px" label="权限列表" label-width="120px" prop="roleList">
          <el-checkbox-group v-model="form.roleList">
          <el-checkbox label="管理员"></el-checkbox>
          <el-checkbox label="普通用户"></el-checkbox>
          <el-checkbox label="商家"></el-checkbox>
        </el-checkbox-group>
        </el-form-item>
        <el-form-item style="padding-right: 100px" label="描述" label-width="120px" prop="description">
          <el-input :rows="8" type="textarea" v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quitAdd">取 消</el-button>
        <el-button type="primary" @click="addPermission(form)">确 定 保 存</el-button>
      </div>
    </el-dialog>
    </div>
</template>

<script>
    import {AddNotice ,UpdateNotice,RemoveNotice,UpdateFilm, AddArrangement} from "@/api/information";
    import {getPermissionsByPage,savePermission,updatePermission,deletePermission} from "@/api/system";
    import config from "@/config";
    import service from "../../utils/request"; 
    export default {
        data() {
            return {
                rules:{
                    url:[
                        { required: true,message: '路径不能为空', trigger: 'blur'}
                    ],
                    method:[
                        { required: true,message: '请求方法不能为空', trigger: 'blur'}
                    ],
                    roleList:[
                        { required: true,message: '访问权限不能为空', trigger: 'blur'}
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
                    url:'',
                    method:'',
                    roleList:[],
                    description:''
                },
                noticeList: [],
                search: '',
                dialog1: false,
                dialog2: false,
                methodOption:[
                    {
                       value: 'GET',
                       label: 'GET'
                     }, {
                       value: 'POST',
                       label: 'POST'
                     }, {
                       value: 'PUT',
                       label: 'PUT'
                     }, {
                       value: 'DELETE',
                       label: 'DELETE'
                     }
                ]
            }
        },

        mounted() {
            this.tableLoading = true;
            service.defaults.headers['Authorization'] = localStorage.getItem('token');
            this.loadAllPermissions();
        },

        methods: {
            loadAllPermissions(){
                var param={...this.pageInfo,url:this.search}
                getPermissionsByPage(param).then(res => {
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
                deletePermission(row.id).then(res=>{
                    that.loadAllPermissions();
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                    });
                })
            },
            handleCurrentChange(newPage){
                this.pageInfo.page=newPage;
                this.tableLoading = true;
            getPermissionsByPage(this.pageInfo).then(res => {
                setTimeout(() => {
                    this.noticeList = res.data;
                    this.tableLoading = false;
                }, 700)
            })
            },
            handleSizeChange(newSize){
                this.pageInfo.rows=newSize;
                getPermissionsByPage(this.pageInfo).then(res => {
                setTimeout(() => {
                    this.noticeList = res.data;
                    this.tableLoading = false;
                }, 700)
            })
            },
            quitAdd(){
                this.dialog1=false;
                this.form={
                    id:'',
                    url:'',
                    method:'',
                    roleList:[],
                    description:''
                }
            },
            addPermission(formName){
                console.log(this.form);
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                    var that=this;
                var isAdd=this.form.id;
                if(isAdd==''){
                    savePermission(this.form).then(res=>{
                    this.dialog1=false;
                    that.loadAllPermissions();
                    this.$message({
                    type: 'success',
                    message: '保存成功!'
                    });
                })
                }else{
                    updatePermission(this.form).then(res=>{
                    this.dialog1=false;
                    that.loadAllPermissions();
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
