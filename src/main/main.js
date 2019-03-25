const { ipcMain } = require('electron')
let file = require('../utils/file')
let info = require('./info');
let p = require('../bus/reqinfo')
let http=require('http')

ipcMain.on('save', function (event, data) {
    file.save(data);
})

ipcMain.on('create', function (event, data) {
    let addr = file.create(data);
    if (addr) {
        event.sender.send('replycreate', addr);
    }
})

ipcMain.on('info', function (event, data) {
    console.log('data:', data);
    let account = 'addr1';
    let password = 'xieyc';
    let pv = false;
    let pb = false;
    let after = 0;
    let before = 0;
    let address = '';
    var addr = info.getAddrFromCfg(account, password);

    var URL = 'http://raw0.nb-chain.net/txn/state/account?addr=1118Mi5XxqmqTBp7TnPQd1Hk9XYagJQpDcZu6EiGE1VbXHAw9iZGPV&uock=0&uock2=0'
    
    console.log('URL:', URL);
    http.get(URL, function (req, res) {
        req.headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        req.timeout = 30;
        var arr = [];
        req.on('data', function (chunk) {
            arr.push(chunk);
        });
        req.on('end', function () {
            var b = arr[0];
            for (var i = 1; i < arr.length; i++) {
                b0 = Buffer.concat(b0, arr[i]);
            }
            console.log('b:', b, b.length, b.toString('hex'));
            var obj=p.parse(b);
            console.log('obj:',obj);
            event.sender.send('replyinfo',obj);
        });
    });
})



/**
 * test
 */
ipcMain.on('test', function (event, data) {
    console.log('data:', data);
})
ipcMain.on('test2', function (event, data) {
    console.log('data:', data);
})