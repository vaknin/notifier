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
    ticketCount++;
    sendTicketCount();
    io.emit('newTicket', `A new ticket has been submitted by ${submitter}.`);
    submitter = undefined;
}

// Every day at midnight, set the ticket count to 0
function resetTicketCountAtMidnight(){
    setInterval(() => {
        let time = new Date();
        if (time.getUTCHours() == 0){
            ticketCount = 0;
            sendTicketCount();
        }
    },3600000)
}

// Send ticket count data to all connected clients, or to a specific one
function sendTicketCount(client){

    // Send the count to a specific client
    if (client){
        io.to(client).emit('ticketCount', ticketCount);
    }

    // Send to all connected clients
    else {
        io.emit('ticketCount', ticketCount);
    }
}

//#endregion

// Configure express.js
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// Global variables
let submitter = false;
let ticketCount = 0;

// Receive msgs from a post request
app.post('/', (req, res) => {

    if (req.body.submitter) submitter = req.body.submitter;
    res.end();
});

// direct to index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', socket => {
    sendTicketCount(socket.id);
});

// Listen for new connections
http.listen(PORT);

// Initiate intervals
checkForNewTicketsAndAnnounce();
resetTicketCountAtMidnight();