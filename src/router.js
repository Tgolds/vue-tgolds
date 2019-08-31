import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
Vue.use(Router)

 const router =  new Router({
  routes: [
    {path:"/",redirect:"/login"},
    //登录组件
    {path:'/login',component:Login},
    //home组件
    {path:'/home',component:Home}
  ]
})
//配置全局路由守卫
//挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作

  router.beforeEach((to,from,next)=>{
    if(to.path == '/login') 
      return next();

    const tokenStr = window.sessionStorage.getItem('token');
    if(!tokenStr)
    return next('/login');
    next();
  })
export default router