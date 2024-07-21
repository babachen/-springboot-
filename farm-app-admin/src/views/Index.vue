<template>
    <div class="contain">
		<section class="data_section">
			<header class="section_title">数据台</header>
			<el-row :gutter="20" style="margin-bottom: 10px;">
                <el-col :span="4"><div class="data_list today_head"><span class="data_num head">今日数据：</span></div></el-col>
				<el-col :span="4"><div class="data_list"><span class="data_num">{{topData.toDayIncreaseUser}}</span> 新增用户</div></el-col>
				<el-col :span="4"><div class="data_list"><span class="data_num">{{topData.toDayIncreaseOrder}}</span> 新增订单</div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{topData.toDayIncreaseProduct}}</span> 新增商品</div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{topData.toDayIncreaseStore}}</span> 新增店铺</div></el-col>
			</el-row>
            <el-row :gutter="20">
                <el-col :span="4"><div class="data_list all_head"><span class="data_num head">总数据：</span></div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{topData.allUser}}</span> 总用户</div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{topData.allOrder}}</span> 总订单数</div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{topData.allProduct}}</span> 总产品数</div></el-col>
                <el-col :span="4"><div class="data_list"><span class="data_num">{{topData.allStore}}</span> 总店铺数</div></el-col>
            </el-row>
		</section>
        <div class="echart-box2" ref="box2">

        </div>
		<div class="echart-box1" ref="box">
        </div>
        
        <!-- <div class="echart-box1" ref="boxpie"></div> -->
    </div>
</template>

<script>
import '@/assets/vintage.js'
import '@/assets/dark.js'
import '@/assets/roma.js'
import '@/assets/shine.js'
import '@/assets/macarons.js'
import '@/assets/infographic.js'
import {getDataOfTop,getOrderCharts,getProductCharts} from "@/api/information";
    export default {
    	data(){
    		return {
    			topData:{}
    		}
    	},
    	mounted(){
            
            this.ban1()
            this.ban2()
            // this.ban3()
            this.getTopData()
            
                    // 基于准备好的dom，初始化echarts实例
            

    	},
        computed: {
            
        },
    	methods: {
    		getTopData(){
                getDataOfTop().then(res=>{
                    this.topData=res.data;
                })
            },
            ban1(){
                // 基于准备好的dom，初始化echarts实例
            const userdom = this.$refs.box
            const mycart = this.$echarts.init(userdom,'vintage')
            //发送请求
            getProductCharts().then(res=>{
                            //绘制图表
            console.log(res.data.xdata);
            const option = {
                xAxis: {
                    // type: 'category',
                    data: res.data.xdata,
                    axisLabel: {
                    rotate: 45 // 旋转45度
                }
                    // name: '销售时间'
                },
                yAxis: {
                    // type: 'value',
                },
                title:{
                 text:'商品销量排名',
                 x: 'center',
                 y: '7px',
                textAlign: 'left',
                 textStyle:{
                //文字颜色
                color:'#ccc',
               //字体风格,'normal','italic','oblique'
                fontStyle:'oblique',
               //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight:'bolder',
                //字体系列
                fontFamily:'sans-serif',
                //字体大小
        　　　　 fontSize:18,
                    }
                },
                // 启用Tooltip组件
                    tooltip: {
                        trigger: 'axis', // 鼠标悬停时触发显示
                        axisPointer: {
                            type: 'shadow' // 阴影指示器，可以根据需要调整
                        }
                    },
                series: [
                    {
                        data: res.data.seriesData,
                        type: 'bar',
                        showBackground: true,
                        backgroundStyle: {
                            color: 'rgba(180, 180, 180, 0.2)'
                        },
                        barWidth: '50%'
                    }
                ]
            };
 
            // 渲染图表
            mycart.setOption(option)
            })
            },
            ban2(){
                const userdom1 = this.$refs.box2
                const mycart = this.$echarts.init(userdom1,'dark')
                 getOrderCharts().then(res=>{
                const option = {
                xAxis: {
                type: 'category',
                data: res.data.xdata,
                },
                yAxis: {
                type: 'value'
                },
                title:{
                 text:'近七天订单量/单',
                 x: 'center',
                 y: '7px',
                textAlign: 'left',
                 textStyle:{
                //文字颜色
                color:'#ccc',
               //字体风格,'normal','italic','oblique'
                fontStyle:'oblique',
               //字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
                fontWeight:'bolder',
                //字体系列
                fontFamily:'sans-serif',
                //字体大小
        　　　　 fontSize:18,
                    }
                },
                tooltip: {
                        trigger: 'axis', // 鼠标悬停时触发显示
                        axisPointer: {
                            type: 'line' // 阴影指示器，可以根据需要调整
                        }
                    },
                series: [
                    {
                        data: res.data.seriesData,
                        type: 'line'
                    }
                ]
                };
            // 渲染图表
                mycart.setOption(option)
                 })
                
            },
            ban3(){
                
            //饼图 
            const mypie = this.$echarts.init(this.$refs.boxpie,'vintage')
            mypie.setOption({
                title: {
                    text: 'Referer of a Website',
                    subtext: 'Fake Data',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left'
                },
                series: [
                    {
                        name: 'Access From',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            { value: 1048, name: 'Search Engine' },
                            { value: 735, name: 'Direct' },
                            { value: 580, name: 'Email' },
                            { value: 484, name: 'Union Ads' },
                            { value: 300, name: 'Video Ads' }
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            })
            }
    		
    	}
    }
</script>

<style >
.contain{
    
    background-image: url('../../public/background.jpg');
    background-color: rgb(255, 255, 255); 
    background-size: cover; /* 将背景图片等比例放大或缩小，以完全覆盖容器 */
    height: 700px;
    /* 或者使用具体的尺寸值来设置背景图片大小 */
    /* background-size: 100% 100%; */
     
    /*  */ /* 保持背景图片原始比例，尽可能大但又完全包含在容器内 */
}
.echart-box1{
            width: 600px;
            height: 350px;
            border: 3px solid pink;
            margin-left: 20px;
            display: inline-block;
            /* margin: 20px auto; */
        }
.echart-box2{
            width: 500px;
            height: 350px;
            border: 3px solid pink;
            margin-left: 20px;
            display: inline-block;
            /* margin: 20px auto; */
        }
	.data_section{
		padding: 20px;
		margin-bottom: 40px;
		}
    .section_title{
			text-align: center;
            margin-left:400px ;;
            width: 30%;
			font-size: 30px;
			margin-bottom: 10px;
             border: 2px solid #000000; /* 添加黑色边框线 */
            border-radius: 1000px; /* 设置10px的圆角 */
            padding: 10px; /* 可选：添加内边距以增加内容与边框的间距 */
		}
		.data_list{
			text-align: center;
			font-size: 14px;
			color: #666;
            border-radius: 6px; 
            background: #E5E9F2;
    }
    .data_num{
                color: #333;
                font-size: 26px;

            }
    .head{
                border-radius: 6px;
                font-size: 22px;
                padding: 4px 0;
                color: #fff;
                display: inline-block;
            }
        
        .today_head{
            background: #00ffaa;
        }
        .all_head{
            background: #20A0FF;
        }
	
    /* .wan{
        .sc(16px, #333)
    } */
</style>