// Global variables
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

//#region Functions

// Check once every second if a new ticket has been received
function checkForNewTicketsAndAnnounce(){
    setInterval(() => {
        if (submitter) announceNewTicket();
    },1000);
}

// Announce a new ticket to all connected clients via voice synthesis
function announceNewTicket(){
    io.emit('newTicket', `A new ticket has been submitted by ${submitter}.`);
    submitter = undefined;
}

//#endregion

// Configure express.js
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// Global variables
let submitter = false;

// Receive msgs from a post request
app.post('/', (req, res) => {

    if (req.body.submitter) submitter = req.body.submitter;
    res.end();
});

// direct to index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Listen for new connections
http.listen(PORT);

// Initiate intervals
checkForNewTicketsAndAnnounce();