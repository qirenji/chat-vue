<template>
  <div class="chatting">

    <div class="chatting-header">
    	<div class="chatting-title">
    		<h2><i class="icon-group"></i>多人聊天室</h2>
    	</div>
    	<div @click="back" class="chatting-menu"><i class="icon-menu"></i></div>
    </div>

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

		<div class="chatting-input">
			<div class="emoji">
				<i @click="showEmoji" class="icon-emoji"></i>
			</div>
			<textarea @keyup.enter="send" v-model.trim="inputContent" placeholder="请输入..." @focus="hideEmoji"></textarea>
			<button @click="send">发送</button>
		</div>

		<div v-show="isShowEmoji" class="emoji-display">
			<ul>
				<li @click="insertText(item)" v-for="item in emojis">{{item}}</li>
			</ul>
		</div>

  </div>
</template>

<script>
export default {
  name: 'chatting',
  data() {
  	return{
  		msgs: localStorage.msgs_group && JSON.parse(localStorage.msgs_group) || [],
  		emojis: ['😂', '🙏', '😄', '😏', '😇', '😅', '😌', '😘', '😍', '🤓', '😜', '😎', '😊', '😳', '🙄', '😱', '😒', '😔', '😷', '👿', '🤗', '😩', '😤', '😣', '😰', '😴', '😬', '😭', '👻', '👍', '✌️', '👉', '👀', '🐶', '🐷', '⚽️', '❤️'],
  		isShowEmoji: false,
  		inputContent: ''
  	}
  },
  watch: {
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
  		next('/')
  	} else {
  		next();
  	}
  },
  mounted() {
  	this.oContent = document.querySelector('.chatting-content');
    this.oContent.scrollTop = this.oContent.scrollHeight;
    this.oTextarea = document.querySelector('textarea');

    socket.emit('online', this.$store.state.name);
    // console.log(this.$store.state.name);
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
  			socket.emit('sendGroupMsg', {
  				date: this.moment().format('YYYY-MM-DD HH:mm:ss'),
  				from: `${localStorage.name}`,
  				content: this.inputContent,
  				avatarUrl: this.avatarUrl
  			});
  			this.msgs.push({
  				data: this.moment().format('YYY-MM-DD HH:mm:ss'),
  				from: `${localStorage.name}`,
  				content: this.inputContent,
  				self: true,
  				avatarUrl: this.avatarUrl
  			});
  			this.inputContent = '';
  			setTimeout(() => this.oContent.scrollTop = this.oContent.scrollHeight, 100);
  		}

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
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 0 0 60px;
      width: 100%;
      background-color: $blue;
      color: white;
      padding-left: 10px;
      padding-right: 15px;

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
      	position: absolute;
        top: 20px;
      	right: 20px;
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
        width: 200px;
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