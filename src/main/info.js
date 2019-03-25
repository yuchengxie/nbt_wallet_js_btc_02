var querystring = require('querystring');
// var https=require('https');
const file = require('../utils/file');
var reqinfo = require('../bus/reqinfo');
// var syncrequest=require('sync-request');


function getAddrFromCfg(account, password) {
    var addr = file.readAccount(account, password);
    console.log('>addr info:', account, password, addr, addr.length);
    return addr;
}

function getRequest(){
    var URL = 'http://raw0.nb-chain.net/txn/state/account?addr=1118Mi5XxqmqTBp7TnPQd1Hk9XYagJQpDcZu6EiGE1VbXHAw9iZGPV&uock=0&uock2=0';
    reqinfo.getInfoData('', after, before);
}

function syncGet(pv, pb, after, before, address) {
    if (pb) {
        //TODO
    }

    if (pv) {
        //TODO
    }

    if (address == '') {

    } else {

    }
    //account_state(addr, before, after, address)
    var URL = 'http://raw0.nb-chain.net/txn/state/account?addr=1118Mi5XxqmqTBp7TnPQd1Hk9XYagJQpDcZu6EiGE1VbXHAw9iZGPV&uock=0&uock2=0';
    reqinfo.getInfoData('', after, before);


    // var res=syncrequest('GET',URL);
    // console.log('res.getBody:',res.getBody());
}




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
    // return account_state(addr, before, after, address);
}

function account_state(addr, uock_from, uock_before, address) {
    // return reqinfo.getInfoData(addr, uock_from, uock_before);

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

exports.getAddrFromCfg = getAddrFromCfg;
// exports.getInfo = getInfo;
exports.syncGet = syncGet;