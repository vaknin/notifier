// Global variables
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

// Configure express.js
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

let submitter = false;

// Receive msgs from a post request
app.post('/', (req, res) => {

    if (req.body.submitter){
        submitter = req.body.submitter;
    }
    res.end();
});

// direct to index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Check once every second if a new ticket has been received
// If one has been, emit
setInterval(() => {
    if (submitter){
        io.emit('newTicket', `A new ticket has been submitted by ${submitter}`);
        submitter = undefined;
    }
},1000);

// Listen
http.listen(PORT);