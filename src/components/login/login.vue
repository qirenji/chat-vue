<template>
  <div class="login">
    <a href="http://www.qirenji.info" target='_blank'><i class="icon-about"></i></a>
    <i class="icon-chat"></i>
    <h2>请输入您的名字</h2>
    <input @keyup.enter="login" v-model.trim="name" type="text" name="" autofocus>
    <button @click="login">登录</button>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
  	return {
  		name: ''
  	}
  },
  beforeCreate() {
    // 如果登陆过，直接跳转至聊天窗口
  	if(localStorage.name) {
  		this.$router.push('/chatting');
  	}
  },
  methods: {
    login() {
    console.log(this.name);
  		if(this.name == ''){
  			return;
  		}
  		this.$store.commit('changeName',this.name);
  		localStorage.name = this.name;
  		this.$router.push({name: 'Chatting'});
  	}
  }
}
</script>

<style lang="scss" scoped>
	.login {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: #000;
		color: #ffffff;

		i.icon-about {
			position: absolute;
			top: 30px;
			right: 30px;
			width: 30px;
			height: 30px;
			background: url('../../common/icons/icon-about.svg') no-repeat;
			background-size: contain;
		}
		i.icon-chat {
      width: 70px;
      height: 70px;
      background: url('../../common/icons/icon-chat.svg') no-repeat;
      background-size: contain;
      margin-bottom: 30px;
    }
    h2 {
      letter-spacing: 1px;
    }

    input {
      width: 200px;
      padding: 5px 10px;
      margin-top: 10px;
      outline: none;
      background-color: #000;
      color: #ffffff;
      border: none;
      border-bottom: 1px solid #ffffff;
      text-align: center;
      font-size: 1.6rem;
      letter-spacing: 2px;
    }
    button {
    	font-size: 20px;
    	margin-top: 30px;
    	border: none;
    	outline: none;
    	cursor: pointer;
    	width: 100px;
    	height: 40px;
    	background-color: #fff;
    	border-radius: 10px;
    }
	}
</style>
