<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="UsersLsit.query" clearable @clear="MetUser">
            <el-button slot="append" icon="el-icon-search" @click="MetUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="DialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="queryInfo" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 获取一行数据 -->
            <el-switch v-model="scope.row.mg_state" @change="Upswitch(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button type="primary" icon="el-icon-edit" @click="selectUserIDsj(scope.row.id)"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
            <!-- 分配角色 -->
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="UsersLsit.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="UsersLsit.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="添加用户" :visible.sync="DialogVisible" width="30%" @close="addClose">
      <el-form :model="AddForm" :rules="AddRules" ref="AddForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="AddForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="AddForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="AddForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="AddForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormUsers">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户提示框 -->
    <el-dialog title="修改用户" :visible.sync="UpUserIDkuang" width="50%">
      <el-form :model="UpFrom" :rules="UpFromRules" ref="UpFrom" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="UpFrom.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="UpFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="UpFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="UpUserIDkuang = false">取 消</el-button>
        <el-button type="primary" @click="IdUpuserfrom">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^\w+@\w+(\.\w+)+$/;
      if (regEmail.test(value)) {
        return cb();
      }
      //返回一个错误提示
      cb(new Error("请输入合法的邮箱"));
    };
    //验证手机号码的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1[34578]\d{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      //返回一个错误提示
      cb(new Error("请输入合法的手机号码"));
    };
    return {
      UsersLsit: {
        query: "",
        //当前页码数
        pagenum: 1,
        //每页显示条数
        pagesize: 2
      },
      queryInfo: [],
      total: 0,
      //添加用户对话框的的显示隐藏
      DialogVisible: false,
      AddForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      AddRules: {
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            message: "邮箱格式不正确，请重新输入",
            trigger: "blur"
          }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          {
            validator: checkMobile,
            message: "手机号码不正确，请重新输入",
            trigger: "blur"
          }
        ]
      },
      UpUserIDkuang: false,
      UpFrom :{},
      UpFromRules : {
         email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            message: "邮箱格式不正确，请重新输入",
            trigger: "blur"
          }
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          {
            validator: checkMobile,
            message: "手机号码不正确，请重新输入",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.MetUser();
  },
  methods: {
    //渲染页面
    async MetUser() {
      const { data: res } = await this.$http.get(`users`, {
        params: this.UsersLsit
      });
      if (res.meta.status != 200) {
        return this.$message.error("用户获取失败");
      }
      // console.log(res);
      // console.log(res.data.users);

      this.queryInfo = res.data.users;
      this.total = res.data.total;
    },
    //每页显示条数pagesize 选择每页显示条数发送请求
    handleSizeChange(newPageSize) {
      // console.log(newPageSize);
      this.UsersLsit.pagesize = newPageSize;
      this.MetUser();
    },
    //点击页码数发送请求
    handleCurrentChange(newPageNum) {
      this.UsersLsit.pagenum = newPageNum;
      this.MetUser();
    },
    //更新用户状态
    async Upswitch(isUserup) {
      // console.log(isUserup);
      const { data: res } = await this.$http.put(
        `users/${isUserup.id}/state/${isUserup.mg_state}`
      );
      // console.log(res);
      if (res.meta.status != 200) {
        isUserup.mg_state = !isUserup.mg_state;
        return this.$message.error("更改用户状态失败");
      }
      return this.$message.success("更新用户状态成功");
    },
    //对话框关闭事件触发时
    addClose() {
      //重置表单数据
      this.$refs.AddForm.resetFields();
    },
    //新增
    addFormUsers() {
      //对表单进行所有数据进行校验
      //通过this.$refs.validate(valid =>{})
      //valid是布尔值表单验证成功后返回true
      this.$refs.AddForm.validate(async valid => {
        if (!valid) return this.$message.error("请填写完整的信息");
        const { data: res } = await this.$http.post("users", this.AddForm);
        // 判断如果添加失败，就做提示
        if (res.meta.status !== 201) return this.$message.error("添加用户失败");
        //添加成功的提示
        this.$message.success("添加用户成功");
        //关闭对话框
        this.DialogVisible = false;
        //重新请求最新的数据
        this.MetUser();
        // console.log(res);
      });
    },
    //根据Id删除数据
    async delUser(id) {
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
      const { data: res } = await this.$http.delete("users/" + id);

      if (res.meta.status !== 200) return this.$message.error("删除用户失败");
      this.$message.success("删除用户成功");
      this.MetUser();
    },
    //根据Id查询出相对应的数据渲染到编辑模板上
    async selectUserIDsj(id) {
      const { data: res } = await this.$http.get('users/' + id)
      console.log(res);
      this.UpFrom = res.data
      this.UpUserIDkuang = true;
    },
    //修改用户数据
    IdUpuserfrom(){
      this.$refs.UpFrom.validate(async valid =>{
        if(!valid) return this.$message.error('修改失败')
        const { data: res } = await this.$http.put('users/'+ this.UpFrom.id, this.UpFrom)
        if(res.meta.status !== 200) return this.$message.error('提交失败')
        this.UpUserIDkuang = false
        this.MetUser()
      })
    }
  }
};
</script>

<style lang="less" scoped>
</style>