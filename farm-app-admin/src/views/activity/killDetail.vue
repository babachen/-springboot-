<template>
  <div>
    <el-card class="box-card">
        <el-page-header @back="goBack" content="详情页面">
</el-page-header>
    </el-card>
    <div class="">

    </div>
<el-card class="box-card" shadow="hover" >
  <div slot="header" class="clearfix">
    <span>活动名称:{{activity.activityName}}</span>
    <span style="margin-left:12px;color:red">活动时间:{{activity.startTime}}至{{activity.endTime}}</span>
    <el-button
      
      icon="el-icon-circle-plus"
      type="success"
      size="small"
      style="margin-left: 30px;float: right"
      @click="AddBT">
      秒杀产品
    </el-button>
    </div>
     <el-table
                v-loading="tableLoading"
                :data="killProductVos"
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
                    label="生产日期"
                    prop="productionDate"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>        
            <el-table-column label="库存" prop="killStockQuantity" sortable :sort-method="sortProductCount">
            </el-table-column>
            <el-table-column label="秒杀价格" prop="killPrice" sortable :sort-method="sortProductCount">
            </el-table-column>
            <el-table-column width="120" align="right">
                <template  slot-scope="scope" >
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
        </el-card>
        <el-dialog :visible.sync="dialogVisible" title="商品图片">
        <el-carousel type="card">
      <el-carousel-item v-for="(image, index) in imgSrcList" :key="index">
        <el-image :src="image" fit="cover" style="width: 100%; height: 100%"></el-image>
      </el-carousel-item>
        </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
// import {ListAllActivityDetail} from "@/api/information";
import {ListAllActivityDetail,DeleteKillProduct} from "@/api/activity";
export default {
  data() {
    return {
      killActivityId:'',
      activity:{},
      killProductVos: [],
      dialogVisible:false,
      imgSrcList:[],
      pageInfo:{
                    page:1,
                    rows:5,
                    total:0,
                },
    };
  },
  mounted(){
    this.loadData();
  },
  methods: {
    loadData(){
        var params={"id":this.killActivityId,"page":this.pageInfo.page,"rows":this.pageInfo.rows}
        ListAllActivityDetail(params).then(res=>{
            this.activity=res.data.activityQueryVo
            this.killProductVos=res.data.killProductVos
            this.pageInfo.total=parseInt(localStorage.getItem('total'))
        })
    },
    formatTime(timestamp) {
      // 格式化时间的方法
    },
    getOrderStatus(status) {
      // 获取订单状态的方法
    },
    handleQueryImg(index,row){
        this.dialogVisible=true;
        this.imgSrcList=row.imgSrcList;
    },
    goBack(){
              const orderPath = `/activity/killActivity`;
               // 使用 $router.push 进行页面跳转
               this.$router.push(orderPath);
    },
    handleCurrentChange(newPage){
                this.pageInfo.page=newPage;
                // this.tableLoading = true;
                this.loadData()
            },
            handleSizeChange(newSize){
                this.pageInfo.rows=newSize;
                this.loadData()
            },
    handleDelete(index, row) {
        console.log(row);
        var params={"productId":row.productId,"activityId":this.activity.id}
                DeleteKillProduct(params).then(res=>{
                    if(res.code==200){
                    this.loadData(); 
                    }
                })
                
            },
  },
  created() {
    // 从后端获取订单基本信息和产品信息的方法
     const rowData = this.$route.params.id;
     this.killActivityId=rowData;
  }
};
</script>
<style >
.y1{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
</style>