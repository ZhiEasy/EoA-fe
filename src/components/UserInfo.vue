<template>
  <div>
    <Card style="width:320px; margin: 0 auto; margin-top: 10%">
      <p slot="title" style="text-align: center">完善信息</p>
      <div style="text-align:center">
        <Form ref="userinfo_form" :model="userinfo_form" :rules="userinfo_role">
          <FormItem prop="name">
            <Input type="text" v-model="userinfo_form.name" placeholder="姓名">
              <Icon type="md-person" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="email">
            <Input type="text" v-model="userinfo_form.email" placeholder="邮箱">
              <Icon type="md-mail" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="pwd">
            <Input type="password" v-model="userinfo_form.pwd" placeholder="密码">
              <Icon type="md-lock" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem prop="cpwd">
            <Input type="password" v-model="userinfo_form.cpwd" placeholder="重复输入密码">
              <Icon type="md-lock" slot="prepend"></Icon>
            </Input>
          </FormItem>
          <FormItem>
            <Button type="primary" long @click="handleSubmit">提交</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
  import {updateUserInfo} from '../api/user'
  export default {
    name: "UserInfo",
    data() {
      return {
        userinfo_form: {
          name: "",
          email: "",
          pwd: "",
          cpwd: ""
        },
        userinfo_role: {
          email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { type: "email", message: '邮箱格式有误', trigger: 'blur' },
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
          ],
          pwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
          cpwd: [
            { required: true, message: '请重复输入密码', trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      handleSubmit() {
        updateUserInfo(this.userinfo_form).then(res=>{
          if (res.status === 0) {
            this.$router.push("/")
          }
        })
      },
    },
  }
</script>

<style scoped>

</style>
