<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList" stripe border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
        <el-table-column prop="path" label="路径" width="180"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级权限</el-tag>
            <el-tag v-if="scope.row.level == 1" type="success">二级权限</el-tag>
            <el-tag v-if="scope.row.level == 2" type="warning">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  created() {
    this.GetRightsList();
  },
  methods: {
    async GetRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("获取权限失败");
      this.rightsList = res.data;
    }
  }
};
</script>

<style lang="less">
</style>