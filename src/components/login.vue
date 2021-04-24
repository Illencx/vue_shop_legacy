<template>
<div class="login-container" >
    <div class="login_box" >

<el-form  label-width="80px" class="login_form" :model="login_form" :rules="loginformrules" ref="loginarea">
    <div id="title">登陆/Login</div>
<el-form-item label="用户名" prop="username">
<el-input prefix-icon="el-icon-user-solid" v-model="login_form.username"></el-input>
</el-form-item>

<el-form-item label="密码" prop="password">
<el-input prefix-icon="el-icon-key" v-model="login_form.password" type="password"></el-input>
</el-form-item>

<el-form-item  class="btns">
<el-button type="info" plain @click="reset()">重置</el-button>
<el-button type="primary" plain @click="login()" >登陆</el-button>
</el-form-item>
</el-form>
</div>
</div>
</template>

<script>
export default {
    data () {
        return {
            // 数据绑定对象
            login_form: {
                username: 'admin',
                password: '123456'
            },
            // 验证规则对象
            loginformrules: {
                // 用户名验证
                username: [
                    { required: true, message: '用户名是必须的：）', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                // 验证密码
                password: [
                    { required: true, message: '没有钥匙是打不开门的', trigger: 'blur' }
                ]
            }
        }
},

        methods: {
            // 重置页面输入
            reset () {
                this.$refs.loginarea.resetFields()
            },
            login () {
                this.$refs.loginarea.validate(async valid => {
                    const { data: res } = await this.$http.post('login', this.login_form)
                    if (res.meta.status !== 200) return this.$message.error('登陆失败')
                   this.$message.success('登录成功')
                   window.sessionStorage.setItem('token', res.data.token)
                   this.$router.push('/home')
                })
            }
        }
}
</script>

<style  scoped>
.login-container{
    background-color: whitesmoke;
    height: 100%;
}
.login_box{
    box-shadow:  0 0 5px grey;
    background-color:white;
    height:300px;
    width:500px;
    border-radius:5px;
    position: absolute;
    left:50%;
    top:50%;
    transform:translate(-50%,-50%);
    padding:10px;

}
#title{
    color:deepskyblue;
    font-size:30px;
    margin-bottom:10px;
}
.btns{
    display:flex;
    justify-content: flex-end;
}
.login_form{
    position:absolute;
    bottom:45px;
    width:80%;
    left:40px;
}
</style>
