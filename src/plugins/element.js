import Vue from 'vue'
// import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { Button } from 'element-ui'

import { Form, FormItem } from 'element-ui'

import { Input } from 'element-ui'
//消息提示框
import { Message } from 'element-ui';
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 挂载到Vue原型下
Vue.prototype.$message = Message