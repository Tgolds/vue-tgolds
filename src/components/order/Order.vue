<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="ordersList.query" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-table :data="ordersInfo" style="width: 100%" border>
          <el-table-column prop="order_number" label="订单编号" width="280"></el-table-column>
          <el-table-column prop="order_price" label="订单价格" width="180"></el-table-column>
          <el-table-column prop="order_pay" label="是否付款">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.order_pay ==='1'">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货"></el-table-column>
          <el-table-column prop="address" label="下单时间">
            <template slot-scope="scope">{{scope.row.create_time|dateFormat}}</template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <el-button type="primary" icon="el-icon-edit" circle @click="xiugai"></el-button>
            <el-button type="success" icon="el-icon-check" circle @click="wuliu"></el-button>
          </el-table-column>
        </el-table>
      </el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="ordersList.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="ordersList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 修改地址对话框 -->
      <el-dialog title="修改地址" :visible.sync="duihuaVisible" width="30%" @close="closexg">
        <el-form :model="AddsForm" :rules="Addsrules" ref="AddsForm" label-width="100px">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader v-model="AddsForm.address1" :options="citydata" @change="handleChange"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="AddsForm.address2" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="duihuaVisible = false">取 消</el-button>
          <el-button type="primary" @click="duihuaVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 时间线 -->
      <el-dialog title="物流" :visible.sync="wuliuVisible" width="30%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :timestamp="activity.time"
          >{{activity.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import citydata from "./citydata";
export default {
  data() {
    return {
      ordersList: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      ordersInfo: [],
      total: 0,
      //对话框显示
      duihuaVisible: false,
      //修改表单双向数据绑定
      AddsForm: {
        address1: [],
        address2: ""
      },
      //省市区数据
      citydata,
      Addsrules: {
        address1: [{ required: true, message: "请输入区域", trigger: "blur" }],
        address2: [{ required: true, message: "地址", trigger: "blur" }]
      },
      //物流对话框显示隐藏
      wuliuVisible: false,
      progressInfo : []
    };
  },
  created() {
    this.getorderList();
  },
  methods: {
    async getorderList() {
      // const { data: res } = await this.$http.get(`orders`,)
      const { data: res } = await this.$http.get(`orders`, {
        params: this.ordersList
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取订单列表失败");
      }
      this.ordersInfo = res.data.goods;
      console.log(this.ordersInfo);
      // console.log(res.data.total);
      this.total = res.data.total;
    },
    //每页显示条数
    handleSizeChange(newPagesize) {
      this.ordersList.pagesize = newPagesize;
      this.getorderList();
    },
    handleCurrentChange(newPagenum) {
      this.ordersList.pagenum = newPagenum;
      this.getorderList();
    },
    //修改地址
    xiugai() {
      this.duihuaVisible = true;
    },
    //级联组件发生变化时候可以获取到最新变化的数据
    handleChange(aaa) {
      console.log(aaa);
    },
    //对话框关闭时触发该函数
    closexg() {
      this.$refs.AddsForm.resetFields();
    },
    wuliu() {
      this.getwuliuxinxi()
      this.wuliuVisible = true;
    },
    // 物流信息
    async getwuliuxinxi() {
      const { data: res } = await this.$http.get('/kuaidi/'+ 804909574412544580)
      if (res.meta.status !== 200) {
        this.$message.error('获取物流信息失败')
      }
      this.progressInfo = res.data
    }
  }
};
</script>
<style lang="less" scoped>
</style>