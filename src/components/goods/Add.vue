<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="消息提示的文案" type="info" center show-icon :closable="false"></el-alert>
      <el-steps :space="300" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tabPosition="left"
          style="height:100%"
          :before-leave="qiehuan"
          @tab-click="Tabquehuan"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="allCateList"
                expandTrigger="hover"
                :props="shujuzs"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="(item,i) in this.manyTabData" :key="i">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,k) in item.attr_vals" :key="k"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item,i) in this.onlyTabData" :key="i">
              <el-input v-model="item.attr_vals" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action图片上传的路径 -->
            <el-upload
              :action="URLaction"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
               <el-button type="primary" @click='add'>添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog title="提示" :visible.sync="PreviewVisible" width="30%" >
        <img :src="this.PreviewPaht" width="100%">
    </el-dialog>
   
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        //图片路径
        pics: [],
        //复文本数据
        goods_introduce :'',
        attrs : []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      //商品分类数据
      allCateList: [],
      shujuzs: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },

      //   获取的动态参数数据
      manyTabData: [],
      //静态参数商品属性值
      onlyTabData: [],
      //图片上传路径
      URLaction: 'http://127.0.0.1:8888/api/private/v1/upload',
      //上传组件自带了ajax发送请求，我们又配置axios请求头携带token值
      //由于上传组件发送请求不是使用axios发送的请求，需要使用到headers配置请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      //图片预览路径
      PreviewPaht: '',
      PreviewVisible : false
    };
  },
  created() {
    this.getshopping();
  },
  methods: {
    async getshopping() {
      const { data: res } = await this.$http.get(`categories`);
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败');
      }
      this.allCateList = res.data;
      console.log(res);
    },
    //级联选择器数据发生变化时
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        return;
      }
      console.log(this.addForm.goods_cat[2]);
    },
    // tabs阻止切换方法
    qiehuan(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类');
        return false;
      }
      //即将进入的标签名字
      // console.log(activeName);
      // //即将离开的标签名字
      // console.log(oldActiveName);
    },
    //切换tab栏发送请求
    async Tabquehuan() {
      //如果点击商品参数的tab栏时发送请求获取动态或者静态参数数据
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.catId}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error('获取参数失败');
        }
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length == 0 ? [] : item.attr_vals.split(' ');
        });
        this.manyTabData = res.data;
        console.log(res.data);
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.catId}/attributes`,
          { params: { sel: 'only' } }
        );
        if (res.meta.status !== 200) {
          this.$message.error('获取商品属性失败');
        }
        this.onlyTabData = res.data;
      }
    },
    //预览图片
    handlePreview(file) {
      // console.log(file);
      this.PreviewPaht = file.response.data.url;
      console.log(this.PreviewPaht);
      this.PreviewVisible = true
    },
    //移除图片
    handleRemove(file) {
      // console.log(file);
      const filePath = file.response.data.tmp_path;
      const index = this.addForm.pics.findIndex(x => x.pic === filePath);
      this.addForm.pics.splice(index, 1);
      // console.log(this.addForm);
    },
    //上传图片
    handleSuccess(response) {
      // console.log(response);
      const pic = { pic: response.data.tmp_path };
      // console.log(pic);

      this.addForm.pics.push(pic);
      // console.log(this.addForm);
    },
     add(){
        this.$refs.addForm.validate( async valid =>{
          if (!valid) return this.$message.error('请输入完整的值')
          //深拷贝数据
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.join(',')
          //处理动态参数
          this.manyTabData.forEach(item =>{
            const newInfo = { attr_id : item.attr_id, attr_value:item.attr_vals.join(' ')}
            this.addForm.attrs.push(newInfo)
          })
          //处理静态参数
          this.onlyTabData.forEach( item =>{
            const newInfo = { attr_id : item.attr_id, attr_value:item.attr_value }
            this.addForm.attrs.push(newInfo)
          })
          //然后把最新的attrs数组中的数据存到深拷贝的form.attrs数组中
          form.attrs = this.addForm.attrs
          console.log(form);
          const { data: res } = await this.$http.post(`goods`, form)
          if (res.meta.status !== 201) {
            this.$message.error('添加商品失败')
          }
          this.$message.success('添加商品成功')
          this.$router.push('/goods')
        })
    }
  },

  computed: {
    // 直接当做普通属性调用不加括号
    // 任何data中数据变化立即重新计算
    // 计算属性会缓存
    // 获取第三级分类的ID值
    catId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    }
  }
}
</script>
<style lang="less" scoped>
.el-step__title {
  font-size: 13px;
}
.el-steps--horizontal {
  margin: 20px 0;
}
</style>