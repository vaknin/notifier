const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);

//Populate users array
function updateUsers(){
    io.emit('online', users);
}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

//Receive msgs from a post request
app.post('/', (req, res) => {
    
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', socket => {
    
});

//Listen on port 3000 / Heroku port
http.listen(process.env.PORT || 3000);