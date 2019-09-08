<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="Addshopping">添加商品</el-button>
          <tree-table
            :data="CateList"
            :columns="columns"
            :selection-type="false"
            :expand-type="false"
            show-index
            index-text="#"
            border
            class="matop"
          >
            <template slot="isok" slot-scope="scope">
              <i
                class="el-icon-success"
                v-if="scope.row.cat_deleted === false"
                style="color : blue"
              ></i>
              <i class="el-icon-error" v-else style="color : red"></i>
            </template>
            <template slot="iscatlevel" slot-scope="scope">
              <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
              <el-tag v-if="scope.row.cat_level == 1" type="success">二级</el-tag>
              <el-tag v-if="scope.row.cat_level == 2" type="warning">三级</el-tag>
            </template>
            <template slot="opt" slot-scope="scope">
              <el-button type="primary" icon="el-icon-search">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" @click="remverCate(scope.row.cat_id)">删除</el-button>
            </template>
          </tree-table>

          <!-- 分页 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[3, 5, 10]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog title="添加分类" :visible.sync="AddVisible" width="30%" @close="closeFrom">
      <el-form :model="AddFenlei" :rules="AddFenleiRules" ref="AddFenlei" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="AddFenlei.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options 用来指定数据源 -->
          <!-- props用来指定数据对象 -->
          <el-cascader
            expandTrigger="hover"
            v-model="selectAllCate"
            :options="selectedKeys"
            :props="cascaderProps"
            @change="ChangeCate"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="AddVisible = false">取 消</el-button>
        <el-button type="primary" @click="tianjiafenlei">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //请求参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      //所有商品数据
      CateList: [],
      //   每行显示的数据
      columns: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isok"
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "iscatlevel"
        },
        {
          label: "操作",
          type: "template",
          template: "opt"
        }
      ],
      //添加商品对框框控制
      AddVisible: false,
      //分类表单的数据对象
      AddFenlei: {
        cat_name: "",

        cat_pid: 0,
        //默认为一级分类
        cat_level: 0
      },
      AddFenleiRules: {
        cat_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      //父级分类的列表
      selectedKeys: [],
      // 指定级连数据对象
      cascaderProps: {
        // value	指定选项的值为选项对象的某个id
        value: "cat_id",
        // label	指定选项标签为选项对象的某个属性值
        label: "cat_name",
        //children指定子级分类
        children: "children"
      },
      //级连选择器中所选中的值
      selectAllCate: []
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //获取所有商品数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo
      });

      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表数据失败");
      }
      //   console.log(res);

      //将数据列表赋值给cateList
      this.CateList = res.data.result;
      //保存总数据条数
      this.total = res.data.total;
      //   console.log(res.data);
    },
    //监听pagesize改变
    handleSizeChange(newSize) {
      //获取分页组件每行显示数据数然后重新给queryInfo中的pagesize重新赋值
      //重新发送请求
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    //监听pagenum改变
    handleCurrentChange(newnum) {
      //同上分类
      this.queryInfo.pagenum = newnum;
      this.getCateList();
    },
    //添加商品
    Addshopping() {
      this.getAllCateList();
      this.AddVisible = true;
    },
    //获取商品分类数据列表
    async getAllCateList() {
      const { data: res } = await this.$http.get(`categories`, {
        params: { type: 2 }
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      // console.log(res.data);
      this.selectedKeys = res.data;
    },
    //选择项发生变化时
    ChangeCate() {
      //如果选择了父级分类即this.selectAllCate 的length的长度会大于0
      if (this.selectAllCate.length > 0) {
        //则将数组中的最后一项设置为父级分类
        this.AddFenlei.cat_pid = this.selectAllCate[
          this.selectAllCate.length - 1
        ];
        //level也要跟着发生变化
        this.AddFenlei.cat_level = this.selectAllCate.length;
      } else {
        // 如果this.this.selectAllCate.length < 0 时  那么所添加的分类则为最大的一层的父级分类数据
        this.AddFenlei.cat_pid = 0;
        this.AddFenlei.cat_level = 0;
        return
      }
      // console.log(this.selectedKeys);
      // console.log(this.selectAllCate);
    },
    tianjiafenlei() {
      //添加分类前先做表单与验证
      //对表单进行所有数据进行校验
      //通过this.$refs.validate(valid =>{})
      // valid是布尔值表单验证成功后返回true
      this.$refs.AddFenlei.validate(async valid => {
        if (!valid) {
          return this.$message.info("请输入完整的信息");
        }
        const { data: res } = await this.$http.post('categories', this.AddFenlei)
        // console.log(res);
        
        if (res.meta.status !==201) {
          return this.$message.error('添加分类失败')
        }
        this.getCateList();
        this.AddVisible = false;
      });
      
    },
    //监听表单关闭事件
    //重置表单数据
    closeFrom() {
      this.$refs.AddFenlei.resetFields();
      this.selectAllCate = [];
      this.AddFenlei.cat_pid = 0;
      this.AddFenlei.cat_level = 0;
    },
    //删除分类
    async remverCate(id){
       const confirmRueslt = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      //如果用户点击确认，则confirmResult 为'confirm'
      //如果用户点击取消, 则confirmResult获取的就是catch的错误消息'cancel'
      if (confirmRueslt != "confirm") {
        return this.$message.info("已经取消删除");
      }
      // console.log(id);
      const { data: res } = await this.$http.delete('categories/'+ id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.success('删除用户成功')
      this.getCateList();
    }
  }
};
</script>
<style lang="less" scoped>
.matop {
  margin-top: 15px;
}
</style>