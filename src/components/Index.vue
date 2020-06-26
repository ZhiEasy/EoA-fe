<template>
  <div>
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"></div>
          <div class="layout-nav">
            <MenuItem name="host">
              <Icon type="ios-navigate"></Icon>
              主机相关
            </MenuItem>
            <MenuItem name="logout" style="float: right">
              <Dropdown @on-click="handleDropdownItemClick">
                <a href="javascript:void(0)">
                  <Avatar :src="$store.state.user_info.avatar_url"/>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="logout">退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </MenuItem>
          </div>
        </Menu>
      </Header>
      <Content :style="{padding: '0 50px'}">
        <div :style="{margin: '20px 0'}"></div>
        <div style="height: 100vh">
          <router-view></router-view>
        </div>
      </Content>
      <Footer class="layout-footer-center">2020 &copy; 致易科技</Footer>
    </Layout>
  </div>
</template>

<script>
  import {userLogout} from '../api/user'

  export default {
    name: "Index",
    data() {
      return {}
    },
    methods: {
      // 头像下拉列表点击事件
      handleDropdownItemClick(name) {
        if (name === "logout") {
          this.handleLogout()
        }
      },
      // 退出登录
      handleLogout() {
        userLogout().then(res => {
          if (res.status === 0) {
            this.$store.state.user_info = {};
            this.$router.push("/login")
          }
        })
      },
    }
  }
</script>

<style scoped>
  .layout-footer-center {
    text-align: center;
  }
</style>
