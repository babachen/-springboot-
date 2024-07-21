<template>
    <div class="film-list">
         <el-input
    type="text"
    size="small"
    prefix-icon="el-icon-search"
    v-model="search"
    placeholder="请输入活动名称"
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
                :data="activityList"
                style="width: 100%">

            <el-table-column label="序号" type="index" width="100" :index="indexMethod">
                
            </el-table-column>

            <el-table-column
                    label="活动名称"
                    prop="activityName">
            </el-table-column>

            <el-table-column
                    label="活动开始时间"
                    prop="startTime"
                    show-overflow-tooltip>
            </el-table-column>

            <el-table-column label="活动结束时间" prop="endTime">
                
            </el-table-column>

            <el-table-column
                    label="活动状态"
                    prop="status">
            </el-table-column>

            <el-table-column width="260" align="right">
                
                <template style="white-space: nowrap" slot-scope="scope">
                    <el-button
                            size="mini"
                            icon="el-icon-edit"
                            type="primary"
                            @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button
                            size="mini"
                            icon="el-icon-view"
                            type="primary"
                            style="margin-left:8px"
                            @click="handleQueryDetail(scope.$index, scope.row)">查看详情
                    </el-button>
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
        <el-form-item label="活动名称" label-width="120px" prop="activityName">
          <el-input
            type="text"
            size="small"
            v-model="form.activityName"
            placeholder="请输入活动名称"
            style="width: 270px; cursor: pointer"
          ></el-input>
        </el-form-item>
<el-form-item label="活动开始时间" label-width="120px" prop="startTime" >
    <el-date-picker
      v-model="form.startTime"
      type="datetime"
      placeholder="选择日期时间"
      default-time="12:00:00">
    </el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束时间" label-width="120px" prop="endTime" >
    <el-date-picker
      v-model="form.endTime"
      type="datetime"
      placeholder="选择日期时间"
      default-time="12:00:00">
    </el-date-picker>
        </el-form-item>
        <el-form-item label="当前状态" label-width="120px" prop="status">
            <el-radio-group v-model="form.status">
            <el-radio label="启用"></el-radio>
            <el-radio label="禁用"></el-radio>
            </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quitAdd">取 消</el-button>
        <el-button type="primary" @click="saveActivity(form)">确 定 保 存</el-button>
      </div>
    </el-dialog>
    </div>
</template>

<script>
    import {ListAllNotice,AddNotice ,UpdateNotice,RemoveNotice,UpdateFilm, AddArrangement} from "@/api/information";
        import {ListAllActivity,AddActivity ,UpdateActivity} from "@/api/activity";
    import config from "@/config";
    import service from "../../utils/request"; 
    export default {
        data() {
            return {
                rules:{
                    activityName:[
                        { required: true,message: '标题不能为空', trigger: 'blur'},
                        { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
                    ],
                    startTime:[
                        { required: true,message: '开始时间不能为空', trigger: 'blur'},
                        { validator: this.validateStartTime, trigger: 'blur' }
                    ],
                    endTime:[
                        { required: true,message: '结束时间不能为空', trigger: 'blur'},
                        { validator: this.validateEndTime, trigger: 'blur' }
                    ],
                    status:[
                        { required: true,message: '活动状态不能为空', trigger: 'blur'},
                    ],
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
                    activityName:'',
                    startTime:'',
                    endTime:'',
                    status:''
                },
                activityList: [],
                search: '',
                dialog1: false,
                dialog2: false,
            }
        },

        mounted() {
            this.tableLoading = true;
            service.defaults.headers['Authorization'] = localStorage.getItem('token');
            this.loadAllActivity();
        },

        methods: {
            loadAllActivity(){
                ListAllActivity(this.pageInfo).then(res => {
                setTimeout(() => {
                    this.activityList = res.data;
                    this.tableLoading = false;
                    this.pageInfo.total=parseInt(localStorage.getItem('total'))
                    console.log(this.pageInfo.total);
                }, 700)
            })
            },
            onChange(field) {
      if (field === 'startTime') {
        this.form.startTime = Date.parse(this.form.startTime);
      } else if (field === 'endTime') {
        this.form.endTime = Date.parse(this.form.endTime);
      }
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
                    that.loadAllActivity();
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
                    this.activityList = res.data;
                    this.tableLoading = false;
                }, 700)
            })
            },
            handleSizeChange(newSize){
                this.pageInfo.rows=newSize;
                ListAllNotice(this.pageInfo).then(res => {
                setTimeout(() => {
                    this.activityList = res.data;
                    this.tableLoading = false;
                }, 700)
            })
            },
            searchByTitle(){
                var param={...this.pageInfo,activityName:this.search}
                ListAllActivity(param).then(res => {
                setTimeout(() => {
                    this.activityList = res.data;
                    this.tableLoading = false;
                    this.pageInfo.total=parseInt(localStorage.getItem('total'))
                }, 700)
            })
            },
            handleQueryDetail  (index, row) {
               // 获取要跳转的页面路径，假设为 /detail/${row.id}
               const detailPath = `/activity/killActivity/killDetail/${row.id}`;
               // 使用 $router.push 进行页面跳转
               this.$router.push(detailPath);
             },
            quitAdd(){
                this.dialog1=false;
                this.form={}
            },
            saveActivity(formName){
                var startTime = Date.parse(this.form.startTime);
                 var endTime = Date.parse(this.form.endTime);   
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                    var that=this;
                var isAdd=this.form.id;
                let newStatus=this.form.status=='启用'?0:1;     
                var params={...this.form,"status":newStatus,"startTime":startTime,"endTime":endTime}
                if(isAdd==''){
                    AddActivity(params).then(res=>{
                    this.dialog1=false;
                    that.loadAllActivity();
                    this.$message({
                    type: 'success',
                    message: '保存成功!'
                    });
                })
                }else{
                    UpdateActivity(params).then(res=>{
                    this.dialog1=false;
                    that.loadAllActivity();
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
                console.log(this.form);
                
            },
                validateStartTime(rule, value, callback) {
      if (!value) {
        callback(new Error('活动开始时间不能为空'));
      } else if (value && this.form.endTime && value >= this.form.endTime) {
        callback(new Error('活动开始时间必须小于活动结束时间'));
      } else {
        callback();
      }
    },
    validateEndTime(rule, value, callback) {
      if (!value) {
        callback(new Error('活动结束时间不能为空'));
      } else if (value && this.form.startTime && value <= this.form.startTime) {
        callback(new Error('活动结束时间必须大于活动开始时间'));
      } else {
        callback();
      }
    },
        },
    }
</script>

<style scoped>
    .film-list {
        padding: 20px;
    }
</style>
