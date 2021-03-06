// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import moment from 'moment';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';

// 本地化，中文时间显示
moment.locale('zh-cn');

//格式化时间格式
Vue.prototype.moment = moment;
Vue.prototype.random = n => Math.floor(n * Math.random());

Vue.use(Vuex);
Vue.use(VueAxios,axios);

const store = new Vuex.Store({
	state: {
		name:'',
		//七牛上随机读取图片头像
		avatarUrl: `http://omratag7g.bkt.clouddn.com/icon-avatar${Vue.prototype.random(21)}.svg`,
	},
	mutations: {
		changeName(state, name) {
			state.name = name;
		}
	}
})
//设置为 false 以阻止 vue 在启动时生成生产提示
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
