import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/login/login.vue';
import Chatting from '../components/chatting/chatting.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
    	path: '/chatting',
      name: 'Chatting',
      component: Chatting
    }
  ]
})
