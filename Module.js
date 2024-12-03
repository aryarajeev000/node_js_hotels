const os=require('os')
const fs=require('fs')

var user=os.userInfo()
console.log(user)
console.log(user.username)
fs.appendFile('module.txt','Hi ' + user.username+'\n',()=>{console.log('file is created')})