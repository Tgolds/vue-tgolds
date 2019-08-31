<template>
    <div class="Login-main">
        <div class="Login-box">
            <!-- 图片 -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <el-form ref="LoginFormRef" label-width="0px" class="login_form" :model="Loginform" :rules = 'LoginRules'>
            <el-form-item prop = 'username'>
                <el-input prefix-icon="iconfont icon-user" v-model="Loginform.username"></el-input>
            </el-form-item>
             <el-form-item prop = 'password'>
                <el-input prefix-icon="iconfont icon-3702mima" type = 'password' v-model="Loginform.password"></el-input>
            </el-form-item>
            <el-form-item class="btns">
            <el-button type="primary" round @click="login">登录</el-button>
            <el-button type="info" round @click="createForm">重置</el-button>
            </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
          Loginform :{
            username : 'admin',
            password : "123456"
          },
          LoginRules:{
              username : [
                  { required: true, message: '请输入用户名', trigger: 'blur' },
                  { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
              ],
              password : [
                  { required: true, message: '请输入密码', trigger: 'blur' },
                  { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
              ]
          }
        }
    },
    methods: {
        createForm (){
            //用this.$refs获取当前表单的实例对象。使用resetFields()方法来重置表单数据
            this.$refs.LoginFormRef.resetFields()
        },
        login(){
            //对表单进行预验证，会返回一个布尔值,true验证成功
            this.$refs.LoginFormRef.validate(async valid =>{
                if(!valid) return;
                const {data : res} = await this.$http.post('login',this.Loginform)
                // console.log(res);
                //状态码不为200是弹出element-ui组件内的Message消息提示框
                if (res.meta.status !== 200) return this.$message.error('登录失败');
                 this.$message.success('登录成功')
                //登录成功后将token值保存到  sessionStorage中去
                window.sessionStorage.setItem('token',res.data.token);
                
                //编程式导航跳转页面
                this.$router.push('/home')
            })
        }
    },
}
</script>


<style lang="less">
    .Login-main{
        background-color: #2b5b6b;
        height: 100%;
    }
    .Login-box{
        width: 420px;
        height: 300px;
        border-radius: 3%;
        background-color: #fff;
        position: absolute;
        left: 50%;
        top: 50%;
        transform:translate(-50%,-50%)
    }
    .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        box-shadow: 0 0 10px #ddd;
        padding: 10px;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
    .login_form{
          position: absolute;
          bottom: 0;
          width: 100%;
          padding: 0 20px;
          box-sizing: border-box;
    }
    // 把按钮设置为弹性盒子
    .btns { 
        
          display: flex;
          justify-content: flex-end;
    }
</style>