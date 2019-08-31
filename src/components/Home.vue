<template>
    <div>
        <el-button type="info" @click="outLogin">退出登录</el-button>
    </div>
</template>

<script>
export default {
    methods: {
        outLogin(){
            // 点击退出登录后。需要清除window.sessionStorage  下的token值
            //然后通过编程式导航跳转到login页面
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    },
}
</script>
<style lang="less">

</style>