function init() {
  $('input').focus();
}

var userList = [];

var user = {
  el: 'h1',
  render: function(name) {
    $(this.el).append($('<span/>').text(name));
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
    $(this.el).append($p);
  }
};

var socket = io();

$('input').keypress(function(e){
  if (e.which == 13) {
    var str = $(this).val().trim(),
        data = {}; // str, to
    $(this).val('');

    if (str.length > 100) {
      chat.render('err', 'error: input 100+ characters');
      return
    }

    // set data.to
    var matchArray = str.match(/@(\w+[.?!\s]|\w+$)/);
    if (matchArray) {
      var name = matchArray[0].replace(/\W/g, '');
      if (userList.indexOf(name) === -1 || name === 'per') {
        chat.render('err', 'error: no such user');
        return
      } else {
        data.to = name;
      }
    }

    // setName
    if (/^\$username:\w+/.test(str)) {
      str = str.replace('$username:', '');
      if (str.length > 12) {
        chat.render('err', 'error: username 12+ letters');
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
  $('.users .content').empty();
  data.forEach(function(name){
    $('.users .content').append('<p>' + name + '</p>');
  });
});

socket.on('userError', function(str){
  chat.render('err', str);
});

socket.on('fyi', function(str){
  chat.render('fyi', str);
});

// init
init();
