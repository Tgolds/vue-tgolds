<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col>
          <el-col :span="6">
            <el-input placeholder="请输入内容" v-model="goodsInfo.query" clearable @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="Addshopping">添加商品</el-button>
          </el-col>
        </el-col>
      </el-row>
      <el-table :data="goodsList" style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">{{scope.row.add_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle @click="removeId(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="goodsInfo.pagenum"
        :page-sizes="[10, 20, 30]"
        :page-size="goodsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      goodsInfo: {
        //查询参数
        query: "",
        //当前页数
        pagenum: 1,
        //每页显示多少条数据
        pagesize: 10
      },
      //所有商品数据
      goodsList: [],
      total: 0,
      //查询参数
      selectCs: ""
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    //获取所有商品数据
    async getGoodsList() {
      const { data: res } = await this.$http.get(`goods`, {
        params: this.goodsInfo
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品参数失败");
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    //得到最新的每页显示多少条数据的值
    handleSizeChange(newSize) {
      this.goodsInfo.pagesize = newSize;
      this.getGoodsList();
    },
    //得到最新的页码值
    handleCurrentChange(newPagenum) {
      this.goodsInfo.pagenum = newPagenum;
      this.getGoodsList();
    },
    //根据Id删除商品
    async removeId(row){
        // console.log(Id);
        const { data: res } = await this.$http.delete(`goods/`+ row.goods_id)
        if (res.meta.status !== 200) return this.$message.error('删除商品失败')
        this.$message.success('删除成功')
        this.getGoodsList();
    },
    //添加商品，编程式导航跳转页面
    Addshopping(){
      this.$router.push('/goods/add')
    }
  }
};
</script>
<style lang="less" scoped>
.el-input {
  margin-bottom: 15px;
}
</style>