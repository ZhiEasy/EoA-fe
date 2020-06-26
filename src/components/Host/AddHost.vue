<template>
  <div>
    <Card style="width:320px; margin: 0 auto">
      <p slot="title">添加主机</p>
      <div style="text-align:center">
        <Form ref="new_host_form" :model="new_host_form" :rules="new_host_rule">
          <FormItem prop="email">
            <Input type="text" v-model="new_host_form.ip" placeholder="IP地址"></Input>
          </FormItem>
          <FormItem prop="name">
            <Input type="text" v-model="new_host_form.name" placeholder="主机名，如：校园地图前端服务器-1"></Input>
          </FormItem>
          <FormItem prop="description">
            <Input type="textarea" v-model="new_host_form.description" placeholder="主机用途描述，如：前端服务器"></Input>
          </FormItem>
          <FormItem prop="login_name">
            <Input type="text" v-model="new_host_form.login_name" placeholder="登录用户名"></Input>
          </FormItem>
          <FormItem prop="login_pwd">
            <Input type="password" v-model="new_host_form.login_pwd" placeholder="登录密码(会被加密)"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" long @click="handleTestConn">测试连接</Button>
          </FormItem>
          <FormItem>
            <Button type="primary" long @click="handleAddHost">添加</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
  import {addHost, testHostConn} from "../../api/host"

  export default {
    name: "AddHost",
    data() {
      return {
        new_host_form: {
          ip: "",
          name: "",
          description: "",
          login_name: "",
          login_pwd: ""
        },
        new_host_rule: {},
      }
    },
    mounted() {
    },
    methods: {
      // 添加主机按钮点击
      handleAddHost() {
        addHost(this.new_host_form).then(res=>{
          if (res.status === 0) {
            this.$emit('onAddHost');
            this.$Message.success(res.data.used)
          }
        });
      },
      // 测试主机连接按钮点击
      handleTestConn() {
        testHostConn({
          ip: this.new_host_form.ip,
          login_name: this.new_host_form.login_name,
          login_pwd: this.new_host_form.login_pwd
        }).then(res=>{
          if (res.status === 0) {
            this.$Message.success(res.data.used)
          }
        })
      },
    }
  }
</script>

<style scoped>

</style>
