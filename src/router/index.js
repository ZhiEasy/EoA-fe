import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/Index'
import Login from '@/components/Login'
import UserInfo from '@/components/UserInfo'

import HostIndex from '@/components/Host/Index'

// 这里是为了原地页面 router.push 不报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

Vue.use(Router);

export default new Router({
  mode: 'history',  //去掉url中的#
  routes: [
    {
      path: "/",
      component: Index,
      children: [
        {
          path: "/",
          name: "HostIndex",
          component: HostIndex
        }
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/userinfo',
      name: 'UserInfo',
      component: UserInfo
    },
  ]
})
