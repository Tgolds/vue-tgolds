import Vue from 'vue'
import Router from 'vue-router'
// import Login from './components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcom" */ './components/Login.vue')
// import Home from './components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcom" */ './components/Home.vue')
// import Welcome from './components/Welcome.vue'
const Welcom = () => import(/* webpackChunkName: "login_home_welcom" */ './components/welcom.vue')

// import Users from './components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "Users_Rights_Rols" */ './components/users/Users.vue')
// import Rights from './components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "Users_Rights_Rols" */ './components/power/Rights.vue')
// import Roles from './components/power/Rols.vue'
const Rols = () => import(/* webpackChunkName: "Users_Rights_Rols" */ './components/power/Rols.vue')

// import Cate from './components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName: "Cate_Params" */ './components/goods/Cate.vue')
// import Params from './components/goods/Params.vue'
const Params = () => import(/* webpackChunkName: "Cate_Params" */ './components/goods/Params.vue')

// import List from './components/goods/List.vue'
const List = () => import(/* webpackChunkName: "GoodsList_Add" */ './components/goods/List.vue')
// import Add from './components/goods/Add.vue'
const Add = () => import(/* webpackChunkName: "GoodsList_Add" */ './components/goods/Add.vue')

// import Order from './components/order/Order.vue'
const Order = () => import(/* webpackChunkName: "Order_Report" */ './components/order/Order.vue')
// import Report from './components/report/Report.vue'
const Report = () => import(/* webpackChunkName: "Order_Report" */ './components/report/Report.vue')

Vue.use(Router)

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new Router({
  routes: [
    { path: "/", redirect: "/login" },
    //登录组件
    { path: '/login', component: Login },
    //home组件
    {
      path: '/home', component: Home, redirect: '/welcom', children: [
        { path: '/Welcom', component: Welcom },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Rols },
        { path: '/categories', component: Cate },
        { path: '/params',component:Params },
        { path: '/goods',component:List},
        { path: '/goods/add',component : Add},
        { path: '/orders',component:Order},
        { path: '/reports',component:Report}
      ]
    }
  ]
})
//配置全局路由守卫
//挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作

router.beforeEach((to, from, next) => {
  if (to.path == '/login')
    return next();

  const tokenStr = window.sessionStorage.getItem('token');
  if (!tokenStr)
    return next('/login');
  next();
})
export default router