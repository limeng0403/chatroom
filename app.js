var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.all('*', function(req, res) {
    res.sendfile('index.html');
});

io.on('connection', function(socket) {
    console.info(socket.id);

    socket.on('chat message', function(msg) {
        console.log('socketId:', socket.id, 'message: ' + msg);

        io.emit('chat message', msg);
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});
