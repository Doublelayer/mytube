let a = 1;
const getApiAndEmit = (socket, to) => {
  let response = a++;
  // Emitting a new message. Will be consumed by the client

  socket.emit(to, to + ': ' + response);
};
let b = 1;
const getApiAndEmit2 = (socket, to) => {
  let response = b++;
  // Emitting a new message. Will be consumed by the client

  socket.emit(to, to + ': ' + response);
};
let interval;
let interval2;
module.exports.connect = async (req, res) => {
  const io = req.app.get('socketio');
  //   onConnect(io);
  //   onDisconnect(io);

  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(io, 'one'), 1000);

  if (interval2) {
    clearInterval(interval2);
  }
  interval2 = setInterval(() => getApiAndEmit2(io, 'two'), 3000);

  res.status(200).send('');
};

const onConnect = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');
  });
};

const onDisconnect = (io) => {
  io.on('disconnect', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
};

// io.on('connection', (socket) => {
//   console.log('New client connected');
//   if (interval) {
//     clearInterval(interval);
//   }
//   interval = setInterval(() => getApiAndEmit(socket), 1000);
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//     clearInterval(interval);
//   });
// });
