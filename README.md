# surra
Simple chat demo over websockets. All data in memory.

# usage
```bash
# set username
$username:username

# private message
@username

# rules
username must be unique, <= 12 chars and only contain word characters
input <= 150 chars
<= 100 users connected simultaneously
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
- [x] update UI on reconnect
- [x] update UI on disconnect
- [x] enlarge input font-size on media query

# licence
MIT