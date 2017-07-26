var express = require('express');
var fs = require('fs')
// var config = require('./config/index.js');

var port = process.env.PORT || 18004;

var app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);


app.use(express.static('./dist'));

app.get("/",function(req,res){
	res.render('index.html',{})
})

io.on('connection',(socket) => {

  socket.on('sendGroupMsg', (data) => {
    socket.broadcast.emit('receiveGroupmsg', data);
    console.log(data);
  });

  socket.on('online', name => {
    socket.broadcast.emit('online', name);
    console.log(name);
  });

})


module.exports = server.listen(port, function (err) {
	if (err) {
		console.log(err);
		return
	}
	console.log('Listening at http://localhost:' + port + '\n')
});