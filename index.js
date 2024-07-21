const express = require('express');
const app = express();
const http = require('http');
const path = require('path');

const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);

app.set('view engine','ejs');
// app.set(express.static(path.join(__dirname,'public')));
app.use(express.static('public'));


io.on("connection" , function(socket){

    socket.on("sent-location",function(data) {
        io.emit("received-location",{id : socket.id , ...data});
    });

    socket.on('disconnect' , function() {
        io.emit("user-disconnected",{id : socket.id})
    })

    console.log("a user connected to serever");
});


app.get('/',(req,res)=>{
    res.render("index");
});

server.listen(3000);
