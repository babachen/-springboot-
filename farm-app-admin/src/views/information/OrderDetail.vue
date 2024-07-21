<template>
  <div>
    <el-card class="box-card">
        <el-page-header @back="goBack" content="详情页面">
</el-page-header>
    </el-card>
    <div class="">
        <el-card class="box-card" shadow="hover">
  <div slot="header" class="clearfix">
    <span>订单详情</span>
    <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
  </div>
  <el-descriptions title="用户信息">
    <el-descriptions-item label="订单编号">{{ order.orderNumber }}</el-descriptions-item>
    <el-descriptions-item label="订单创建日期">{{ order.createTime }}</el-descriptions-item>
    <el-descriptions-item label="订单状态">{{ order.status }}</el-descriptions-item>
    <el-descriptions-item label="订单备注">
      {{ order.note }}
    </el-descriptions-item>
    <el-descriptions-item label="订单总价">{{ order.totalAmount }}元</el-descriptions-item>
    <el-descriptions-item label="订单创建人名称">{{ order.createNickName }}</el-descriptions-item>
</el-descriptions>
      <!-- <p>订单编号: {{ order.orderNumber }}</p>
      <p>订单创建日期: {{ order.createTime }}</p>
      <p>订单状态: {{ order.status }}</p>
      <p>订单备注: {{ order.note }}</p>
      <p>订单总价: {{ order.totalAmount }}</p>
      <p>订单创建人名称: {{ order.createNickName }}</p> -->
</el-card>
    <!-- <h1 style="font-size:30px;" >订单详情</h1>
    <div>
      <p>订单编号: {{ order.orderNumber }}</p>
      <p>订单创建日期: {{ order.createTime }}</p>
      <p>订单状态: {{ order.status }}</p>
      <p>订单备注: {{ order.note }}</p>
      <p>订单总价: {{ order.total_amount }}</p>
      <p>订单创建人名称: {{ order.create_nick_name }}</p>
    </div> -->
    </div>
            <el-card class="box-card" shadow="hover">
  <div slot="header" class="clearfix">
    <span>商品详情</span>
    </div>
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
            <el-table-column
                    label="生产日期"
                    prop="productionDate"
                    width="200"
                    show-overflow-tooltip>
            </el-table-column>

            <el-table-column width="200"
                    label="保质期（天）"
                    prop="shelfLife"
                    >
            </el-table-column>

            
            <el-table-column label="购买数量" prop="quantity" sortable :sort-method="sortProductCount">
            </el-table-column>
            <el-table-column label="单价" prop="unitPrice" sortable :sort-method="sortProductCount">
            </el-table-column>
            <el-table-column width="300" label="总价">
                
                <template  slot-scope="scope" >
                    <span>{{(scope.row.quantity)*(scope.row.unitPrice)}}</span>
                </template>
            </el-table-column>
            <el-table-column width="120" align="right">
                <template  slot-scope="scope" >
                    <el-button
                            size="mini"
                            icon="el-icon-view"
                            type="primary"
                            style="margin-left:-100px"
                            @click="handleQueryImg(scope.$index, scope.row)">查看商品图片
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
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
import {getOrderDetail} from "@/api/information";
    
export default {
  data() {
    return {
      orderId:'',
      order: {}, // 从后端获取的订单基本信息
      productList: [],
      dialogVisible:false,
      imgSrcList:[] // 从后端获取的订单产品信息
    };
  },
  mounted(){
    this.loadData();
  },
  methods: {
    loadData(){
        getOrderDetail(this.orderId).then(res=>{
            this.order=res.data.orderQueryVo
            this.productList=res.data.productQueryVos
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
              const orderPath = `/information/order`;
               // 使用 $router.push 进行页面跳转
               this.$router.push(orderPath);
    }
  },
  created() {
    // 从后端获取订单基本信息和产品信息的方法
     const rowData = this.$route.params.id;
     this.orderId=rowData;
  }
};
</script>
<style >
.y1{
     box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
</style>