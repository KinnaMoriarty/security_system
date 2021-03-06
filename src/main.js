import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'

Vue.prototype.$http = axios
// 配置请求的根路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.defaults.headers.post['Content-Type'] = "application/json;charset=utf-8"
axios.defaults.baseURL = 'http://192.168.0.110:8080/SecurityManagementSystem'
axios.interceptors.request.use(config => {
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem("token");
  // 在最后必须return config
  return config;
})
Vue.config.productionTip = false

new Vue({
  data() {
    return {
      nowLoginId: "aj18032002",
      mangerId: 'ag18032002'
    }
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
