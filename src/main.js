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


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
