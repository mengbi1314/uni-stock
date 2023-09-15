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
})
app.$mount()
