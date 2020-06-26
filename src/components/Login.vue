<template>
  <div>
    <Card style="width: 400px; margin: 0 auto; margin-top: 10%">
      <p slot="title" style="text-align: center">致易看见</p>
      <div style="text-align:center">
        <Form ref="login_form" :model="login_form" :rules="login_rule">
          <FormItem prop="email">
            <Input type="text" v-model="login_form.email" placeholder="邮箱">
              <Icon type="md-mail" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="pwd">
            <Input type="password" v-model="login_form.pwd" placeholder="密码">
              <Icon type="md-lock" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Button type="primary" long @click="handleLogin">登录</Button>
          </FormItem>
        </Form>
        <Divider />
        <a :href="oauth.yuque">
          <img src="../assets/yuque.png" style="width: 30px" alt="yuque">
        </a>
      </div>
    </Card>
  </div>
</template>

<script>
  import {getYuQueOAuth, userLogin} from '../api/user'

  export default {
    name: 'Login',
    data() {
      return {
        login_form: {
          email: "",
          pwd: "",
        },
        login_rule: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: "email", message: '邮箱格式有误', trigger: 'blur' },
          ],
          pwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        oauth: {
          yuque: ""
        },
      }
    },
    mounted() {
      getYuQueOAuth().then(res=>{
        this.oauth.yuque = res.data
      });
    },
    methods: {
      // 登录按钮点击
      handleLogin() {
        userLogin(this.login_form).then(res=>{
          if (res.status === 0) {
            this.$Message.success("欢迎，" + res.data.name);
            this.$store.state.user_info = res.data;
            this.$router.push("/")
          }
        })
      },
    },
  }
</script>

<style>
</style>
