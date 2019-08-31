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
//挂载axios到全局
Vue.prototype.$http = axios
// 配置请求的基准URL地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
