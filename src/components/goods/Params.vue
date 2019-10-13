<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意:只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="xjbangding"
            :options="Paramshuju"
            :props="CatePorms"
            @change="handleChange"
            expandTrigger="hover"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleCateClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isbtn" @click="CsVisible=true">添加参数</el-button>
          <el-table :data="manyData" border>
            <!-- 动态参数展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-search" @click="updatCate(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="removepara(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" :disabled="isbtn" @click="CsVisible=true">添加参数</el-button>
          <el-table :data="onlyData" border>
            <!-- 静态参数展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i,scope.row)"
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-search" @click="updatCate(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="removepara(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加参数对话框 -->
      <el-dialog :title="'添加' + titleText" :visible.sync="CsVisible" width="30%" @close="CloseForm">
        <el-form
          :model="AddForm"
          :rules="AddFormRules"
          ref="AddForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="AddForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="CsVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddCateFrom">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改参数对话框 -->
      <el-dialog
        :title="'修改 ' + titleText"
        :visible.sync="editVisible"
        width="30%"
        @close="CloseeditForm"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCateFrom">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 分类数据
      Paramshuju: [],
      //显示内容的字段
      CatePorms: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //级联组件双向数据绑定
      xjbangding: {},
      //动态参数/静态参数
      activeName: 'many',
      //动态参数
      manyData: [],
      //静态参数
      onlyData: [],
      //添加参数对话框显示与隐藏
      CsVisible: false,
      //添加参数属性
      AddForm: {
        attr_name: ''
      },
      //添加参数的校验规则
      AddFormRules: {
        attr_name: [{ required: true, message: '参数', trigger: 'blur' }]
      },
      //修改对话框显示与yinc
      editVisible: false,
      //修改参数属性
      editForm: {
        attr_name: ''
      },
      //获取到修改参数相对应的值
      editFormId: {},
      //修改参数校验
      editFormRules: {
        attr_name: [{ required: true, message: '参数', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getParamsList();
  },
  methods: {
    async getParamsList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      //   console.log(res.data);
      this.Paramshuju = res.data
    },
    //判断是否选择的为三级分类如果不是则清空数据、、
    //如果选择了三级分类则发送请求
    handleChange() {
      this.getAllcata()
    },
    //table栏切换的时候在发送请求获取最新的数据，由于table切换的是动态或则静态参数
    handleCateClick() {
      // console.log(this.activeName);
      this.getAllcata()
    },
    //封装好的查询动态以及静态参数的方法
    async getAllcata() {
      if (this.xjbangding.length !== 3) {
        //如果没选则第三级商品分类清空动态参数和静态参数
        this.onlyData = []
        this.manyData = []
        this.xjbangding = []
        return;
      }
      const { data: res } = await this.$http.get(
        `categories/${this.isfengleichangdu}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      // console.log(res);

      // console.log(this.isfengleichangdu);
      //遍历数组取出所有可选项，并且用空格进行分割，得到一个数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        (item.inputVisible = false), (item.inputValue = '')
      });
      // console.log(res.data);
      if (this.activeName === 'many') {
        this.manyData = res.data
      } else {
        this.onlyData = res.data
      }
    },
    //对话框关闭时情况input上的值
    CloseForm() {
      this.$refs.AddForm.resetFields()
    },
    // 添加参数
    AddCateFrom() {
      this.$refs.AddForm.validate(async valid => {
        if (!valid) {
          return this.$message.error('请输入完整的信息')
        }
        const { data: res } = await this.$http.post(
          `categories/${this.isfengleichangdu}/attributes`,
          {
            attr_name: this.AddForm.attr_name,
            attr_sel: [this.activeName]
          }
        );
        // console.log(res);

        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }
        // console.log(res);
        this.getAllcata()
        this.CsVisible = false
      });
    },
    //修改对话框关闭清空数据
    CloseeditForm() {
      this.$refs.editForm.resetFields();
    },
    // 点击修改按钮时弹出修改对话框并且查询出相对应的数据显示到input框上
    async updatCate(datasj) {
      // console.log(datasj);

      const { data: res } = await this.$http.get(
        `categories/${this.isfengleichangdu}/attributes/${datasj.attr_id}`,
        {
          params: { attr_sel: datasj.attr_sel }
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error('查询失败')
      }
      this.$message.success('查询成功');
      // console.log(res.data.attr_name);
      this.editForm.attr_name = res.data.attr_name
      this.editFormId = res.data
      // console.log(this.editFormId);

      this.editVisible = true;
      // console.log(datasj);
    },
    //点击确定按钮时发送修改请求
    async editCateFrom() {
      const { data: res } = await this.$http.put(
        `categories/${this.isfengleichangdu}/attributes/${this.editFormId.attr_id}`,
        {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败');
      }
      this.editVisible = false
      this.getAllcata()
    },
    //删除按钮
    async removepara(datadel) {
      const confirmRueslt = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      //如果用户点击确认,则confirmResult 为'confirm'
      //如果用户点击取消,则confirmResult获取的就是catch的错误消息'cancel'
      if (confirmRueslt !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      // console.log(datadel);

      const { data: res } = await this.$http.delete(
        `categories/${this.isfengleichangdu}/attributes/${datadel.attr_id}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getAllcata()
    },

    //input失去焦点 键盘按下时执行方法
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.seveAttrVals(row)
    },
    // 点击按钮时然input显示出来
    showInput(row) {
      row.inputVisible = true
      //在頁面属性渲染出来之后获得焦点/如果在渲染前就执行函数即会找不到相对应的Input
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 封装对 row.attr_vals数组操作函数
    async seveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.isfengleichangdu}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error('新增失败')
      }
        this.$message.info('新增成功')
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.seveAttrVals(row)
      // console.log(row.attr_vals.join(' '));
    }
  },

  computed: {
    isbtn() {
       // 判断是否选择了分类数据
      // 如果没选则禁言添加参数按钮
      if (this.xjbangding.length !== 3) {
        return true
      }
      return false
    },
    //用计算属性
    //   通过判断数组的长度
    //获取第三级分类的id
    isfengleichangdu() {
      if (this.xjbangding.length === 3) {
        return this.xjbangding[2]
      }
      return null
    },
    // 动态静态对话框显示
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态参数'
    }
  }
};
</script>
<style lang='less' scoped>
.el-col {
  margin: 10px 0
}
.el-tag {
  margin-right: 10px
}
.el-input {
  width: 100px
}
</style>