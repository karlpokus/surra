var finalhandler = require('finalhandler'),
    http = require('http'),
    server = http.createServer(),
    port = process.env.PORT || 3000,
    serveStatic = require('serve-static'),
    serve = serveStatic('public');

server.on('request', function(req, res){
  var done = finalhandler(req, res);
  serve(req, res, done);
});

function userList(o) {
  return Object.keys(o).map(function(k){
    return o[k];
  });
}

var io = require('socket.io')(server),
    db = {}; // id: name

io.on('connection', function(socket){

  // max connections
  if (Object.keys(db).length > 100) {
    io.to(socket.id).emit('userError', '100+ users');
    socket.disconnect();
  } else {
    db[socket.id] = 'per';
    io.emit('userList', userList(db));
    io.emit('fyi', 'per joined');
  }

  socket.on('disconnect', function(){
    if (db[socket.id]) {
      var user = db[socket.id];
      io.emit('fyi', user + ' left');
      delete db[socket.id];
      io.emit('userList', userList(db));
    }
  });

  socket.on('setName', function(name){
    var nameTaken = Object.keys(db).filter(function(k){
      return db[k] === name;
    }).length > 0;

    if (nameTaken) {
      io.to(socket.id).emit('userError', 'username already taken');
    } else {
      db[socket.id] = name;
      io.emit('fyi', name + ' joined');
      io.to(socket.id).emit('nameSet', name);
      io.emit('userList', userList(db));
    }
  });

  socket.on('pling', function(data){
    data.name = db[socket.id];

    if (data.to && data.from) {
      var id = Object.keys(db).filter(function(k){
        return db[k] === data.to;
      });
      io.to(id).emit('plong', data);
      io.to(data.from).emit('plong', data);

    } else {
      io.emit('plong', data);
    }
  });
});

server.listen(port, function() {
  console.log('Server running..');
})
