import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueQuillEditor from 'vue-quill-editor'
// import ImageViewer from 'element-ui/packages/image-preview';
// 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//引入echarts
import * as echarts from 'echarts'
//vue全局注入echarts
Vue.prototype.$echarts = echarts;
 
Vue.use(VueQuillEditor, /* { 默认全局 } */)
Vue.use(ElementUI);

export const eventBus = new Vue();
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
