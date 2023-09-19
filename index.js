const express = require('express');
const http = require('http'); // Import the 'http' module
const app = express();
const cors = require('cors');
const { Server } = require('socket.io'); // Import the 'Server' class from 'socket.io'

const server = http.createServer(app); // Create an HTTP server using 'http' module

app.get('/', (req, res) => {
  res.send('Running');
});

// Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"]
  }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Running');
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded")
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal)
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
