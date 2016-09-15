function init() {
  $('input').focus();
}

var userList = [];

var users = {
  el: '.users .content',
  render: function(data) {
    $(this.el).empty();
    data.forEach(function(name){
      var $p = $('<p/>').text(name);
      $(this.el).append($p);
    }, this);
  }
};

var user = {
  el: 'h1 .username',
  render: function(name) {
    $(this.el).text(name);
  }
};

var chat = {
  el: '.chat .content',
  render: function(type, str) {
    var $p = $('<p/>').text(str);
    if (type === 'err') {
      $p.css('color', 'red');
    }
    if (type === 'fyi') {
      $p.css('color', '#aaa');
    }
    $(this.el).prepend($p);
  }
};

var socket = io();

$('input').keypress(function(e){
  if (e.which == 13) {
    var str = $(this).val().trim(),
        data = {}; // str, to
    $(this).val('');

    if (str.length > 150) {
      chat.render('err', 'input 150+ characters');
      return
    }

    // set data.to
    var matchArray = str.match(/@(\w+[.?!\s]|\w+$)/);
    if (matchArray) {
      var name = matchArray[0].replace(/\W/g, '');
      if (userList.indexOf(name) === -1 || name === 'per') {
        chat.render('err', 'no such @user');
        return
      } else {
        data.to = name;
        data.from = '/#' + socket.io.engine.id;        
      }
    }

    // setName
    if (/^\$username:\w+/.test(str)) {
      str = str.replace('$username:', '');
      if (str.length > 12) {
        chat.render('err', 'username 12+ letters');
        return
      } else {
        socket.emit('setName', str);
        return
      }
    }

    data.str = str;
    socket.emit('pling', data);
    return false;
  }
});

socket.on('plong', function(data){
  chat.render(null, data.name + ': ' + data.str);
});

socket.on('nameSet', function(name){
  user.render(name);
});

socket.on('userList', function(data){
  userList = data;
  users.render(data);
});

socket.on('userError', function(str){
  chat.render('err', str);
});

socket.on('fyi', function(str){
  chat.render('fyi', str);
});

// init
init();
