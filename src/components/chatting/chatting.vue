<template>
  <transition name="slide-left">
    <div class="chatting">
      <!-- 头部信息 -->
      <div class="chatting-header">
        <div class="chatting-back">
          <i @click="$router.push('/AI')" :class="isAI ? 'icon-back' : 'icon-back2'"></i>
        </div>
      	<div class="chatting-title">
      		<h2><i class="icon-group"></i>多人聊天室</h2>
      	</div>
      	<div @click="back" class="chatting-menu"><i class="icon-menu"></i></div>
      </div>
      <!-- 聊天内容 -->
  		<div @click.stop.prevent="hideEmoji" class="chatting-content">
  			<div v-for="item in msgs">
  				<div v-if="item.self" class="chatting-item self clearfix">
  					<div class="msg-date">
  						{{item.date}}
  					</div>
  					<div class="msg-from">
  						<span class="msg-author">{{item.from}}</span>
  						<img :src="item.avatarUrl" alt="">
  					</div>
  					<div class="msg-content">{{item.content}}</div>
  				</div>
  				<div v-else class="chatting-item other clearfix">
            <div class="msg-date">
               {{ item.date }}
            </div>
            <div class="msg-from">
              <img :src="item.avatarUrl" alt="">
            	<span class="msg-author">{{ item.from }}</span>
            </div>
            <div class="msg-content">
            	{{item.content }}
            </div>
          </div>
  			</div>

  			<!-- <div class="online">
           qi上线了
        </div>
  			<div class="online">
           other上线了
        </div> -->
  		</div>
      <!-- 聊天输入框 -->
  		<div class="chatting-input">
  			<div class="emoji">
  				<i @click="showEmoji" class="icon-emoji"></i>
  			</div>
  			<textarea @keyup.enter="send" v-model.trim="inputContent" placeholder="左上角点击切换智能机器人..." @focus="hideEmoji"></textarea>
  			<button @click="send">发送</button>
  		</div>
      <!-- 表情框 -->
  		<div v-show="isShowEmoji" class="emoji-display">
  			<ul>
  				<li @click="insertText(item)" v-for="item in emojis">{{item}}</li>
  			</ul>
  		</div>

    </div>
  </transition>
</template>

<script>
export default {
  name: 'chatting',
  data() {
  	return{
  		msgs: localStorage.msgs_group && JSON.parse(localStorage.msgs_group) || [],
  		emojis: ['😂', '🙏', '😄', '😏', '😇', '😅', '😌', '😘', '😍', '🤓', '😜', '😎', '😊', '😳', '🙄', '😱', '😒', '😔', '😷', '👿', '🤗', '😩', '😤', '😣', '😰', '😴', '😬', '😭', '👻', '👍', '✌️', '👉', '👀', '🐶', '🐷', '⚽️', '❤️'],
  		isShowEmoji: false,
  		inputContent: '',
      isAI: false
  	}
  },
  watch: {
    //输入信息后就存入LocalStorage
  	msgs(val) {
  		localStorage.msgs_group = JSON.stringify(val);
  	}
  },
  computed: {
  	name() {
  		return this.$store.state.name;
  	},
  	avatarUrl() {
  		return this.$store.state.avatarUrl;
  	}
  },
  beforeRouteEnter(to,from,next) {
  	if(!localStorage.name) {
      // 没有名字返回登录页
  		next('/')
  	} else {
  		next();
  	}
  },
  mounted() {
    // 左上角图标闪烁
    setInterval(() => this.isAI = !this.isAI, 1500)

  	this.oContent = document.querySelector('.chatting-content');
    // 信息移动到最新
    this.oContent.scrollTop = this.oContent.scrollHeight;
    this.oTextarea = document.querySelector('textarea');

    //上线发送名称信息 
    socket.emit('online', this.$store.state.name);
    // console.log(this.$store.state.name);
    // 监听是否有上线的
    socket.on('online', (name) => {
      if (!name) {
        return;
      }
      let oOnline = document.createElement('div');
      oOnline.className = 'online';
      oOnline.innerText = name + '上线了';
      this.oContent.appendChild(oOnline);
      this.oContent.scrollTop = this.oContent.scrollHeight;
    });

    // 监听是否有人在发送信息
  	socket.on('receiveGroupMsg', data => {
      this.msgs.push(data);
      setTimeout(() => {
        this.oContent.scrollTop = this.oContent.scrollHeight;
      }, 0);
    });

    this.oContent.scrollTop = this.oContent.scrollHeight;
  },
  methods: {
  	back() {
  		localStorage.name = '';
  		this.$router.push('/');
  	},
  	showEmoji() {
  		this.isShowEmoji = !this.isShowEmoji;
  	},
  	insertText(item) {
  		this.inputContent = this.inputContent + item;
  	},
  	hideEmoji() {
  		this.isShowEmoji = false;
  	},
  	send() {
  		this.isShowEmoji = false;
  		if(this.inputContent === '') {
  			return;
  		}else{
        // 发送信息到socket.io
        // console.log(this.moment().format('YYYY-MM-DD HH:mm:ss'))
  			socket.emit('sendGroupMsg', {
  				date: this.moment().format('YYYY-MM-DD HH:mm:ss'),
  				from: `${localStorage.name}`,
  				content: this.inputContent,
  				avatarUrl: this.avatarUrl
  			});
        // 信息存储到本地
  			this.msgs.push({
  				date: this.moment().format('YYYY-MM-DD HH:mm:ss'),
  				from: `${localStorage.name}`,
  				content: this.inputContent,
  				self: true,
  				avatarUrl: this.avatarUrl
  			});
        // 清空聊天框
  			this.inputContent = '';
        // 更新聊天内容框
  			setTimeout(() => this.oContent.scrollTop = this.oContent.scrollHeight, 100);
  		}
      console.log(this.msgs);
  	}
  }
}
</script>

<style lang="scss">
  $blue: #2196f3;

  .chatting {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    // overflow: auto;

    .chatting-header {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 0 0 60px;
      width: 100%;
      background-color: $blue;
      color: white;
      padding: 5%;

      .chatting-back {
        width: 32px;
        height: 32px;
        .icon-back {
          background: url('../../common/icons/icon-ai.svg') no-repeat;
          background-size: contain;
        }
        .icon-back2 {
          background: url('../../common/icons/icon-ai2.svg') no-repeat;
          background-size: contain;
        }
      }

      .chatting-title {
        i.icon-group {
          vertical-align: top;
          width: 30px;
          height: 30px;
          background: url('../../common/icons/icon-group.svg') no-repeat;
          background-size: contain;
          margin-right: 10px;
        }
      }

      .chatting-menu {
        width: 30px;
        height: 30px;
        i.icon-menu {
          background: url('../../common/icons/icon-index.svg') no-repeat;
          background-size: contain;
        }
      }
    }

    .chatting-content {
      flex: 1;
      width: 100%;
      background-color: rgba(0, 0, 0, .1);
      overflow: auto;
      .chatting-item {
        padding: 15px;
        width: 100%;
        .msg-date {
          text-align: center;
          color: gray;
          font-size: 90%;
        }
        .msg-from {
          display: flex;
          align-items: center;
          .msg-author {
            font-size: 1rem;
            margin-right: 5px;
            margin-left: 5px;
          }
          img {
            width: 25px;
            height: 25px;
          }
        }
        .msg-content {
          margin-top: 10px;
          background-color: white;
          width: 200px;
          padding: 10px 10px;
          border-radius: 10px;
        }
      }

      .chatting-item + .chatting-item {
        margin-top: 10px;
      }
      .self {
        .msg-from {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          img {
            margin-left: 10px;
          }
        }

        .msg-content {
          float: right;
          word-wrap: break-word;
          word-break: break-all;
          margin-right: 10px;
        }


      }

      .other {
        .msg-from {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          img {
            margin-right: 10px;
          }
        }

        .msg-content {
          float: left;
          margin-left: 10px;
          word-wrap: break-word;
          word-break: break-all;
        }

      }
      .online {
        // width: 200px;
        // max-width: 100%;
        margin: 3px auto;
        border-radius: 4px;
        text-align: center;
        font-size: 0.8rem;
        // background-color: #FFFDE7;
      }
    }

		.chatting-input {
			display: flex;
			height: 55px;
      width: 100%;
      position: relative;
      border-top: 1px solid #ccc;
      background-color: rgba(0, 0, 0, .1);
      padding-top: 8px;
      padding-bottom: 8px;
      .emoji {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 100%;
        .icon-emoji {
        	margin-top:10px;
          width: 30px;
          height: 100%;
          background: url('../../common/icons/icon-emoji.svg') no-repeat;
          background-size: contain;

        }
      }
      textarea {
        flex: 1;
        border-radius: 5px;
        border: 1px solid #ccc;
        resize: none;
        font-size: 1.2rem;
        padding-top: 5px;
        padding-left: 6px;
        margin-right: 10px;
      }
      button {
        width: 60px;
        height: 90%;
        background-color: $blue;
        color: white;
        font-size: 16px;
        border: none;
        outline: none;
        cursor: pointer;
        border-radius: 8px;
        margin-right: 6px;
        margin-top: 2px;
      }
		}
		.emoji-display {
			display: flex;
			// height: 210px;
			ul {
          display: flex;
          flex-wrap: wrap;
          margin-left: 8px;

          li {
            padding: 5px 5px;
            font-size: 1.8rem;
          }
        }
		}

  }
</style>