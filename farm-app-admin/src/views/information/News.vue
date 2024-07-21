<template>
  <div class="main">
         <el-input
    type="text"
    size="small"
    prefix-icon="el-icon-search"
    v-model="search"
    placeholder="请输入资讯标题"
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
      @click="addBT">
      添加
    </el-button>
    <el-table
        v-loading="loading"
        :data="newsList"
        style="width: 100%">

      <el-table-column
          label="序号"
          width="100"
          type="index"
          :index="indexMethod"
          >
      </el-table-column>

      <el-table-column
          label="资讯标题"
          prop="newsTitle">
      </el-table-column>
        <el-table-column label="标题图片" prop="titleImgUrl" width="125">
             <template scope="scope">
              <div @click="handleImagePreview(scope.row.titleImgUrl)">
               <el-image
                  style="width: 100px; height: 100px"
                 :src="scope.row.titleImgUrl"
                 fit="cover"
                 >
               </el-image>
              </div>
             </template>
             </el-table-column>
      <el-table-column
          label="资讯内容"
          >
          <template slot-scope="scope">
          <el-button
              size="mini"
              icon="el-icon-view"
              type="success"
              @click="checkContext(scope.row)">点击查看
          </el-button>
          </template>
      </el-table-column>

      <el-table-column
          label="发布时间"
          prop="createTime">
      </el-table-column>

      <el-table-column
          label="发布人"
          prop="publishUserName">
      </el-table-column>

      <el-table-column width="300" align="right">
        <!-- <template slot="header" slot-scope="scope">
          <div style="display: flex; align-items: center;">
      <el-input
        v-model="search"
        size="mini"
        placeholder="输入关键字搜索"
      />
      <el-button
        size="mini"
        type="mini"
        @click="handleEdit(scope.$index, scope.row)"
      >
        搜索
      </el-button>
    </div>
        </template> -->
        <template style="white-space: nowrap" slot-scope="scope">
          <div style="display: flex; align-items: center;">
          <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>

          <el-popconfirm
              confirm-button-text='确定'
              cancel-button-text='取消'
              icon="el-icon-info"
              icon-color="red"
              @confirm="handleDelete(scope.$index, scope.row)"
              title=" 确定要删除此助农资讯吗？ "
          >
            <el-button
                style="margin-left: 8px"
                size="mini"
                icon="el-icon-delete"
                type="danger"
                slot="reference">删除
            </el-button>
          </el-popconfirm>
          </div>
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
    <el-dialog title="助农资讯" :visible.sync="dialog" @close='quitDialog'>
      <el-form :model="dataForm"  ref="dataForm" :rules="rules"
             label-width=" '120px'" :disabled="dataForm.flag === 1">
      
      <el-row>
        <el-col :span="22">
          <el-form-item label="资讯标题" prop="newsTitle" >
            <el-input v-model="dataForm.newsTitle" placeholder="请输入资讯标题" style="margin-left: 18px;" ></el-input>
          </el-form-item>
        </el-col>
        
      </el-row>
      <el-row>
        <el-col :span="22">
      <el-form-item label="选择图片" label-width="120px" prop="file" >
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
            <el-button type="primary" icon="el-icon-upload">上传标题图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1000kb</div>
          </el-upload>
        </el-form-item>
            </el-col>
        
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="内容" prop="newsContext"  >
            <div class="editor-wrapper">
            <quill-editor 
	             class="ql-editor"
	             v-model="dataForm.newsContext" 
	             ref="myQuillEditor" 
	             :options="editorOption" 
	             @blur="onEditorBlur($event)" 
	             @focus="onEditorFocus($event)"
	             @change="onEditorChange($event)">
	          </quill-editor>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
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
      <template slot="footer">
      <el-button @click="quitDialog">关闭</el-button>
      <el-button @click="saveDialog('dataForm')">保存</el-button>
    </template>
    </el-dialog>
    <el-dialog title="资讯查看" :visible.sync="dialogContext" @close='closeDialog'  >
        
        <div class="el-dialog-div">
          <div v-html="content"></div> 
    </div >
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" title="海报图片">
    <div class="el-dialog-div">
          <el-image :src="image" fit="cover" ></el-image>
    </div >
    </el-dialog>
  </div>
  
</template>

<script>
import {getNewsByPage,AddNews,UpdateNews,DeleteNews, UpdateArrangement,uploadAll} from "@/api/information";
import { quillEditor } from 'vue-quill-editor'
   import config from "@/config";
   import {newsTitleImgPrefix} from "../../utils/filePrefix"
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import Quill from 'quill' // 引入编辑器
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
                newsTitle: [
                     { required: true,message: '标题不能为空', trigger: 'blur'}
                ],
                file: [
                     { validator: this.validateFile, trigger: 'blur'}
                ],
                newsContext:[
                  { required: true,message: '内容不能为空', trigger: 'blur'}
                ]
                     },
      dialog: false,
      dialogContext:false,
      dialogVisible:false,
      search: '',
      newsList: [],
      loading: false,
      token:localStorage.getItem('token'),
      arrangement: {
        name: '',
        fid: '',
        seatNumber: 40,
        price: 30.50,
        date: '',
        startTime: '',
        endTime: '',
        founder: '',
        type: '2D放映',
      },
      pageInfo:
      {
         page:1,
         rows:5,
         total:0,
      },
      dataForm:{
        
      },
      fileList:[],
      currentFile:{},
      uploadUrl:config.API_URL+'/minio/upload',
      content: '', //双向数据绑定数据
		  // 富文本编辑器配置
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
	      	} 
	      }
    
  },
  mounted() {
    this.loading=true,
    this.loadAllNews();
  },
computed: {
    uploadHeaders() {
      return {
        'Authorization': this.token  // 根据 token 动态生成 headers
      };
    }
  },
    methods: {
      handleImagePreview(url){
                 this.image=url;
                 this.dialogVisible=true;
             },
      handleRemove(file,fileList){
      if(file.url==this.dataForm.titleImgUrl){
        this.dataForm.titleImgUrl='';
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
        handleUploadSuccess(res) {
      this.dataForm.titleImgUrl = res
    },
    loadAllNews(){
        var param={...this.pageInfo,newsTitle:this.search}
        getNewsByPage(param).then(res => {
        setTimeout(() => {
            this.newsList = res.data;
            this.loading = false;
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
    searchByTitle(){
        this.loadAllNews();
    },
  //点击对话框右上角的关闭
    closeDialog(){
      this.dialog =false;
      this.dataForm={};
    },
    //点击添加按钮
    addBT(){
      this.dialog = true;
    },
    //点击编辑按钮
    handleEdit(index, row) {
      
      this.dialog = true;
      this.dataForm = {...row};
      if(row.titleImgUrl){
                  const name = "图" + 1;
                  const param={"name":name,"url":row.titleImgUrl}
                  this.fileList.push(param)
                  console.log(this.fileList);
                }
    },
    //关闭对话框
    quitDialog(){
      this.dialog =false;
      this.dataForm={};
      this.fileList=[];
    },
    //点击对话框的保存
    saveDialog(formName){
      this.$refs[formName].validate((valid) => {
                  if (valid) {
      var that=this;
      var isAdd=this.dataForm.id;
      console.log(isAdd);
       var _url=this.dataForm.titleImgUrl; 
                console.log(_url);
      if(_url==''||_url==undefined){
          const formData = new FormData();
          formData.append("files",this.fileList[0].raw) 
          formData.append("prefix",newsTitleImgPrefix)
      uploadAll(formData).then(res=>{
      var params={...this.dataForm,titleImgUrl:res.data[0]}
      if(isAdd===undefined){
          AddNews(params).then(res=>{
          this.dialog=false;
          that.loadAllNews();
          this.$message({
          type: 'success',
          message: '保存成功!'
          });
      })
      }else{
          UpdateNews(params).then(res=>{
          this.dialog=false;
          that.loadAllNews();
          this.$message({
          type: 'success',
          message: '保存成功!'
          });
      })
      }
    })
  }else{
    UpdateNews(this.dataForm).then(res=>{
          this.dialog=false;
          that.loadAllNews();
          this.$message({
          type: 'success',
          message: '保存成功!'
          });
      })
                }
                  }})
    },
    //点击查看
    checkContext(rows){
      this.content=rows.newsContext;
      this.dialogContext=true;
    },
    

    handleDelete(index, row) {
      DeleteNews(row.id).then(res => {
        if(res.code==200){
        this.$message({
          message: '助农资讯删除成功！',
          type: 'success'
        });
        this.loadAllNews();
        }
        else{
          this.$message({
            message: '助农资讯删除失败',
            type : 'error'
          })
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
		    this.content = html
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

    handleCurrentChange(newPage){
          this.pageInfo.page=newPage;
          this.loading = true;
        this.loadAllNews();
      },
      handleSizeChange(newSize){
        console.log(newSize);
          this.pageInfo.rows=newSize;
          this.loading = true;
          this.loadAllNews();
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
.main {
  padding: 20px;
}
.el-dialog-div{
   height: 65vh;
   width: 100%;
   overflow: auto;
}
/* img {
      filter: grayscale(100%);
      opacity: 1;
    }

img:hover {
      filter: none;
      opacity: 0.9;
    } */
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
