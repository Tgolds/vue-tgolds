import Vue from 'vue'
import App from './App.vue'
import router from './router'
//引入消息提示框

import './plugins/element.js'
//全局CSS样式
import './assets/css/global.css'
//字体图标
import './assets/fonts/iconfont.css'
//axios引入
import axios from 'axios'
//引入树形表格组件
import ZkTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', ZkTable)

//引入复文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
// 配置请求的基准URL地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
//由于其他API接口都需要验证token令牌，所以通过axios配置请求拦截器
//axios设置请求拦截器
axios.interceptors.request.use(config=>{
  //为请求头对象，添加token验证的Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
//挂载axios到全局
Vue.prototype.$http = axios

//全局过滤器，进行时间的格式化
//所谓的全局过滤器即使所有的vue实例都共享的
Vue.filter('dateFormat' ,function(dateStr, pattern=""){
  //根据给定的时间字符串，得到特定的时间
  　　var dt = new Date(dateStr)
  　　//yyy---mm-dd
  　　var y = dt.getFullYear() //得到年份
  　　var m = dt.getMonth() + 1 //得到月份
  　　var d = dt.getDate() //得到日期
  　　// return y + '-' + m + '-' + d
  
  　　if(pattern.toLowerCase() ==="yyy-mm-dd"){
  　　　　return `${y}-${m}-${d}`
  　　}
  　　　else {
  　　　　var hh = dt.getHours() //得到时
  　　　　var mm = dt.getMinutes() //得到分
  　　　　var ss = dt.getSeconds() //得到秒
  　　　　return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  　　　}
  })
  
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
