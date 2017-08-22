var express = require('express');
var fs = require('fs')
// var config = require('./config/index.js');

var port = process.env.PORT || 18004;

var app = express(); 
var router = express.Router()

app.use(express.static('./dist'));
const server = require('http').Server(app);

const io = require('socket.io')(server);

const http = require('http');

const https = require('https');

var bodyParser = require('body-parser');
// var multer = require('multer');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(multer()); // for parsing multipart/form-data
app.use('/api',router);
router.get('/content/:text', (req,res) => {
  let text = req.params.text;
  let searchResult = '';
  let url = encodeURI('http://api.qingyunke.com/api.php?key=free&appid=0&msg='+ text)
  http.get(url,response => {
    response.on('data', data => {
      searchResult += data;
    })
    response.on('end', () => {
      res.json(JSON.parse(searchResult));
    })
  })
})

io.on('connection', (socket) => {

  // 群聊
  socket.on('sendGroupMsg', function (data) {
    socket.broadcast.emit('receiveGroupMsg', data);
  });

  // 上线
  socket.on('online', name => {
    socket.broadcast.emit('online', name)
  });

})


module.exports = server.listen(port, function (err) {
	if (err) {
		console.log(err);
		return
	}
	console.log('Listening at http://localhost:' + port + '\n')
});