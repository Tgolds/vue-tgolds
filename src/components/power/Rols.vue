<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table :data="RolsUserList" stripe border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['rowborder',i1===0?'ke8':'','juzhong']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="delRoulsID(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二，三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限  -->
                <el-row
                  :class="[i2===0?'':'bdtop','zdrow']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delRoulsID(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="delRoulsID(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
        <el-table-column prop label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-search">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" icon="el-icon-star-off" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分配权限" :visible.sync="RoulsVisible" width="30%" @close='RolsClose' >
      <el-tree :data="rolslist" :props="RouslProps" show-checkbox node-key = 'id' default-expand-all :default-checked-keys = 'delKeys' ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="RoulsVisible = false">取 消</el-button>
        <el-button type="primary" @click='allRouls'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      RolsUserList: [],
      RoulsVisible : false,
      rolslist : [],
      //树形控件的属性绑定
      RouslProps : {
          children : 'children',
          label : 'authName'
      },
      //默认勾选的节点相对应的Id值
      delKeys : [],
      //存储分配权限相对应的ID值
      RolsId : ''
    }
  },
  created() {
    this.RolesXj();
  },
  methods: {
    //渲染页面
    async RolesXj() {
      const { data: res } = await this.$http.get("roles");
      //   console.log(res);
      this.RolsUserList = res.data;
      
    },
    //删除权限
    async delRoulsID(Roulesid, Ridsid) {
      // $confirm 点击确认后返回一个confirm字符串
      //通过confirm来判断是否点击了确认按钮，如果点击了确认按钮则发送相关请求删除角色权限
      const confirmRoules = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmRoules != "confirm") {
        return this.$message.info("取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${Roulesid.id}/rights/${Ridsid}`
      );
      if (res.meta.status !== 200)
        return this.$message.error("删除角色权限失败");
      //重新赋值
      Roulesid.children = res.data;
      if (res.data == '') return this.RolesXj()
      
    },
    // 获取所有权限
    async showSetRightDialog(rols){
        //获取所有权限列表
        const {data : res} = await this.$http.get('rights/tree')
        if (res.meta.status !== 200) return this.$message.error('获取权限失败')
        // console.log(res);
        this.rolslist = res.data
        //获取当前行的一级权限的ID存储到data中
        this.RolsId = rols.id
        
        
        //调用递归函数
        // console.log(rols)
        // rols.forEach(item=>this.getsanjiRouls(item,this.delKeys))
        this.getsanjiRouls(rols,this.delKeys)
        this.RoulsVisible = true
    },
    //通过递归函数获取所有三级权限的ID
    //node用来判断是几级权限，如果他没又children属性则是三级权限，
    //用push方法把node下的id存储到数组中
    //arr用来存储三级权限下所有的id
    //:default-checked-keys属性绑定的就是三级权限相对应的ID值
    //递归函数将在点击权限分配的时候调用
    getsanjiRouls(node,arr){
        // console.log(node,arr)
        if(!node.children){
            return arr.push(node.id)
        }
        // //调用递归函数
        node.children.forEach(item => this.getsanjiRouls(item,arr))
    },
    //关闭对话框后清空//默认勾选的节点相对应的Id值
    RolsClose(){
        this.delKeys = []
    },
    //分配权限
    async allRouls(){
        // getCheckedKeys
        //若节点可被选择（即 show-checkbox 为 true），则返回目前被选中的节点的 key 所组成的数组
        //	若节点可被选择（即 show-checkbox 为 true），则返回目前半选中的节点的 key 所组成的数组
        // getHalfCheckedKeys

        // keys当前的选中框的ID值
        const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        // console.log(keys);
        //由于携带参数需要是一个以逗号分割的字符串,所以把数组进行相对应的拆分
        const StringKeys =  keys.join(',')
        // console.log(StringKeys);
        // console.log(this.RolsId);
        
        //发送请求
        const { data: res } = await this.$http.post(`roles/${this.RolsId}/rights`, {rids : StringKeys})
        if (res.meta.status !== 200) return this.$message.error('分配角色权限失败')
        //请求发送成功后关闭对话框
        this.RoulsVisible = false
        //重新刷新角色数据
        this.RolesXj()
    }
  }
};
</script>

<style lang="less" scoped>
.juzhong {
  display: flex;
  align-items: center;
}
.rowborder {
  border-top: 1px solid #ccc;
  padding: 20px;
}
.zdrow {
  padding: 20px;
}
</style>