# surra
Simple chat demo over websockets. All data in memory.

# usage
```bash
# set username
$username:username

# private message
@username

# rules
username must be unique, <= 12 chars and only contain ASCII
input <= 150 chars
<= 100 users connected simultaniously
```

# demo
Coming up!

# TODOs
- [ ] demo on heroku
- [x] private message from and to
- [x] display updated userlist
- [x] username
- [x] emoji
- [ ] redis
- [x] max connections
- [x] max chars
- [x] reject long inputs
- [x] escape bad chars with `.text`
- [ ] allow for åäö in username
- [ ] namespaces
- [ ] ts med moments
- [ ] only keep 100 inputs in dom