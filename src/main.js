import Vue from 'vue'
import App from './App'
import './uni.promisify.adaptor'

Vue.config.productionTip = false

App.mpType = 'app'

// 引入uView UI
import uView from "uview-ui";
//挂载uView
Vue.use(uView);

const app = new Vue({
  ...App
});

// 引入请求封装，将app参数传递到配置中
require("services/request.js")(app);

//引入自定义方法
import auth from '@/services/auth.js';
Vue.use(auth, app);

// 引入接口
import api from '@/api/index';

Vue.use(api, app);
app.$mount()
