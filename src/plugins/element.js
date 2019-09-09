import Vue from 'vue'
// import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Timelin from './timeline/index.js'
import TimelinItem from './timeline-item/index.js'

import { Button,Form,FormItem,Input,Container,Header,Aside,Main,Message,Menu,Submenu,MenuItem,Breadcrumb,BreadcrumbItem,Card
,Col,Row,Table,TableColumn,Switch,Tooltip,Pagination,Dialog,MessageBox,Tag,Tree,Select,Option,Cascader,Alert,Tabs,TabPane,Steps,Step,Checkbox,CheckboxGroup,Upload} from 'element-ui'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timelin)
Vue.use(TimelinItem)
// 挂载到Vue原型下
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox 