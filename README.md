# vue + socket.io实战项目（多人聊天+智能机器人聊天）

> socket.io聊天室

博客地址：http://www.qirenji.info/2017/07/27/Vue-js-Socket-io-智能聊天室/

## Build Setup

``` bash
npm install -----安装依赖

npm run dev -----运行

npm run build -----打包

node prod.server.js -----打包后运行
```
## 实现功能

- [x] 登录功能 -- 完成
- [x] 聊天功能 -- 完成
- [x] 多人聊天室 -- 完成
- [x] 与机器人聊天 -- 完成

## 预览

在线预览地址 👉 http://chat.qirenji.com/

多人群聊效果预览

<img src="http://www.qirenji.info/img/chat-vue/chat.png" width="320">

智能机器人聊天效果预览

<img src="http://www.qirenji.info/img/chat-vue/ai.png" width="320">


## 技术栈
- **Vue2.0**：前端页面展示。
- **Vue-cli**：vue手脚架工具。
- **Vuex**：实现不同组件间的状态共享。
- **vue-router**：页面路由切换。
- **axios**：向后端发起请求。
- **Socket.io**：实现实时通信
- **Express**：实现后端socket.io监听功能。
- **Moment.js**：格式化时间。
- **ES6**：箭头函数等语法很好用。
- **localStorage**：保存用户信息以及聊天记录。
- **Webpack**：vue-cli自带Webpack，添加sass相关loader，其他vue-cli已经配置好了webpack，你只需要安装依赖就可以，使用的时候只需要<style lang="scss"></style>。
- **SASS(SCSS)**：用SCSS做CSS预处理语言。
- **flex**：flex弹性布局，简单适配手机、PC端。
- **CSS3**：CSS3过渡动画及样式。

## 分析

socket.io

在服务器端

```
io.on('connection', (socket) => {

  // 群聊
  socket.on('sendGroupMsg', function (data) {
    socket.broadcast.emit('receiveGroupMsg', data);
  });

})
```
在客户端

```
<script src="/socket.io/socket.io.js"></script>
<script>
  //上线发送名称信息 
    socket.emit('online', this.$store.state.name);
    // console.log(this.$store.state.name);
    // 监听是否有上线的
    socket.on('online', (name) => {
     ……
    });

    // 监听是否有人在发送信息
    socket.on('receiveGroupMsg', data => {
      ……
    });
</script>
```
不管是服务器还是客户端都有 emit 和 on 这两个函数，可以说 socket.io 的核心就是这两个函数了，通过 emit 和 on 可以轻松地实现服务器与客户端之间的双向通信。

**emit** ：用来触发一个事件，第一个参数为事件名，第二个参数为要发送的数据,如果要向所有在线的人发送信息需要夹，broadcast是发送信息到广播组的其他人。

**on** ：用来监听一个 emit 触发的事件，第一个参数为要监听的事件名，第二个参数为一个匿名函数用来接收对方发来的数据。


## About

关于我: http://www.qirenji.info/about

GitHub: https://github.com/qirenji/

E-mail: lyf@qirenji.com





