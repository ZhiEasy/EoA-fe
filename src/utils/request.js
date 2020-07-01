import axios from 'axios'
import {Notice, LoadingBar, Message} from 'view-design'
import router from '../router'

// 一个 axios 实例
const service = axios.create({
  // baseURL: 'http://127.0.0.1:10240/',
  baseURL: 'http://39.101.176.8:10240/',
  // baseURL: 'http://gaea.zhieasy.cn:10240/',
  withCredentials: true, // send cookies when cross-domain requests
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
});
// request 拦截器
service.interceptors.request.use(
  config => {
    LoadingBar.start();
    return config;
  },
  err => {
    return err;
  }
);
// response 拦截器
service.interceptors.response.use(
  res => {
    LoadingBar.finish();
    Message.destroy();
    switch (res.data.status) {
      case 0:
        Message.success(res.data.msg);
        break;
      case 4003:
        LoadingBar.error();
        Notice.open({
          title: '请先登录',
          desc: '可以使用语雀一键认证。',
          duration: 0
        });
        router.push("/login");
        break;
      case 3002:
        LoadingBar.error();
        Notice.open({
          title: '请先完善信息',
          desc: '请确保邮箱可用，监控报警信息将发送至邮箱。',
          duration: 0
        });
        router.push("/userinfo");
        break;
      default:
        LoadingBar.error();
        Message.error(res.data.msg);
        break;
    }
    return res.data
  },
  err => {
    LoadingBar.error();
    return err.data;
  }
);

export default service;
