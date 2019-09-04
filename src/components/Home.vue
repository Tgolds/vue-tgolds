<template>
  <el-container class="home-container">
    <!-- 头部菜单 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt />
        <span>Tgolds</span>
      </div>
      <el-button type="info" @click="outLogin">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 右边导航菜单 -->
      <el-aside :width="isFlag ? '64px':'200px'">
        <div class="ZdDaohang" @click="yingchang">|||</div>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="red"
          unique-opened
          :collapse="isFlag"
          :collapse-transition="false"
          router
          :default-active = "savePaht"
        >
          <el-submenu :index="itme.id + ''" v-for=" itme in xujuList" :key="itme.id">
            <!-- 一级菜单 -->
            <template slot="title">
              <i :class="iconsObj[itme.id]"></i>
              <span>{{itme.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+ itmeZj.path" v-for="itmeZj in itme.children" :key="itmeZj.id" @click="Pathsave('/'+ itmeZj.path)" >
              <template slot="title">
                <i class="el-icon-s-grid"></i>
                <span>{{itmeZj.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      xujuList: [],
      iconsObj: {
        "125": "iconfont icon-user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      isFlag: false,
      savePaht : ''
    };
  },
  created() {
    this.xuanran();
    this.savePaht = window.sessionStorage.getItem('activePath')
  },
  methods: {
    outLogin() {
      // 点击退出登录后。需要清除window.sessionStorage  下的token值
      //然后通过编程式导航跳转到login页面
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async xuanran() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
    //   console.log(res.data);
      this.xujuList = res.data;
    },
    yingchang(){
        this.isFlag = !this.isFlag
    },
    Pathsave(pathClick){
        window.sessionStorage.setItem('activePath',pathClick);
    }
  }
};
</script>
<style lang="less">
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0 !important;
  align-items: center;
  color: #fff;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .ZdDaohang {
    text-align: center;
    color: #fff;
    font-size: 15px;
    cursor: pointer;
  }
  .el-menu{
      border-right: 0;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>