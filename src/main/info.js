var querystring = require('querystring');
// var https=require('https');
const file = require('../utils/file');
var reqinfo=require('../bus/reqinfo');

const WEB_SERVER_ADDR = 'https://api.nb-coin.com';

function getInfo(account, password, pv, pb, after, before, address) {
    console.log('get info');
    console.log('> account:', account);
    console.log('> password:', password);
    var addr = file.readAccount(account, password);
    console.log('>addr getinfo:', addr, addr.length);

    if (pb) {
        //TODO
    }

    if (pv) {
        //TODO
    }

    if (address == '') {

    } else {
        
    }
    account_state(addr,before, after,address);
}

function account_state(addr,uock_from, uock_before, address) {
    reqinfo.getInfoData();
    
    // const url = WEB_SERVER_ADDR + '/txn/state/account';
    // var contents = querystring.stringify({
    //     addr: addr, uock: uock_from, uock2: uock_before
    // });
    // var options = {
    //     host: WEB_SERVER_ADDR,
    //     path: '/txn/state/account',
    //     method: 'POST',
    //     headers: {
    //         'Content-Type':'application/x-www-form-urlencoded',
    //         'Content-Length':contents.length
    //     },
    //     timeout: 30
    // };
}


exports.getInfo = getInfo;