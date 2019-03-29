const _BASE58_CHAR = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const _TX_TRANSFER_MAX = 1000000000000     //10000 NBC
const WEB_SERVER_ADDR = 'http://raw0.nb-chain.net'
const fs = require('fs');
const sha256 = require('js-sha256')


var sequence = 0

function PayFrom() {
    this.value = 0;
    this.address = '';
    this.address = '';
}

function PayTo() {
    this.value = 0;
    this.address = '';
}

function MakeSheet() {
    this.vcn = 0;
    this.sequence = 0;
    this.pay_from = [];
    this.pay_to = [];
    this.scan_count = 0;
    this.min_utxo = 0;
    this.max_utxo = 0;
    this.sort_flag = 0;
    this.last_uocks = [];
}

function verify(addr) {
    if (addr.length <= 32) {
        throw Error('invalid address');
        return false;
    };
    for (var i = 0; i < addr.length; i++) {
        var ch = addr[i];
        if (_BASE58_CHAR.indexOf(ch) == -1) {
            throw Error('invalid address');
            return false;
        }
    }
    return true;
}

// f96e62746d616b657368656574000000
var hexStr = 'f96e62746d616b657368656574000000a5000000e8d6839d00000100000001000000000000000036313131384d69355878716d7154427037546e50516431486b39585961674a517044635a7536456947453156625848417739695a4750560100e1f50500000000363131313941774278426e52583353644e4d3637457750476239436d535455635033716b3768684e565575534764584a474c6a456e697300000000000000000000000000000000000000000000010000000000000000';

// function hexstrToBuf(hexStr){
//     var arr=[];
//     for(var i=0;i<hexStr.length/2;i++){
//         var a=hexStr[2*i]+hexStr[2*1+1]
//         arr.push(a);
//     }
//     var b=Buffer.from(arr);
//     return b;
// }

function query_sheet(pay_to, from_uocks) {
    var ext_in = null;
    var submit = true;
    var scan_count = 0;
    var min_utxo = 0;
    var max_utxo = 0;
    var sort_flag = 0;
    var from_uocks = null;
    return prepare_txn1_(pay_to, ext_in, scan_count, min_utxo, max_utxo, sort_flag, from_uocks);
}

function prepare_txn1_(pay_to, ext_in, scan_count, min_utxo, max_utxo, sort_flag, from_uocks) {
    if (!WEB_SERVER_ADDR) {
        return null;
    }
    sequence += 1;

    var pay_from = [];
    var pay_from1 = new PayFrom();
    pay_from1.value = 0;
    pay_from1.address = '1118Mi5XxqmqTBp7TnPQd1Hk9XYagJQpDcZu6EiGE1VbXHAw9iZGPV';
    pay_from.push(pay_from1);

    var pay_to = [];
    var pay_to1 = new PayTo()
    pay_to1.value = 100000000;
    pay_to1.address = '1119AwBxBnRX3SdNM67EwPGb9CmSTUcP3qk7hhNVUuSGdXJGLjEnis';
    pay_to.push(pay_to1);


    var makesheet = new MakeSheet();
    makesheet.vcn = 0;
    makesheet.sequence = 1;
    makesheet.pay_from = pay_from;
    makesheet.pay_to = pay_to;
    makesheet.scan_count = scan_count;
    makesheet.min_utxo = min_utxo;
    makesheet.max_utxo = max_utxo;
    makesheet.sort_flag = sort_flag;
    // makesheet.from_uocks=from_uocks;
    makesheet.last_uocks = [0];
    return submit_txn_(makesheet, true);
}

var command_type = 'makesheet';
var magic = Buffer.from([0xf9, 0x6e, 0x62, 0x74]);

function ttt(filename, buf) {
    var s = '';
    for (var i = 0; i < buf.length; i++) {
        var b = buf[i].toString(16);
        if (b.length === 1) {
            s += '0' + b + '\n';
        } else {
            s += b + '\n';
        }
    }

    fs.writeFile(filename + '.txt', s, function (err) {
        if (err) console.log(err);
        else {
            console.log(filename + '写入成功');
        }
    })
}
// var pythonbuf = toBuffer(hexStr);
// console.log('>>> a:', pythonbuf, pythonbuf.length);

// ttt('a', pythonbuf);
function submit_txn_(msg, submit) {
    //0-4
    const magic = Buffer.from([0xf9, 0x6e, 0x62, 0x74]);
    //4-16
    var command = new Buffer(12);
    command.write('makesheet', 0);
    console.log('>>> command:', command);
    //24-
    // var payload = convpayload(msg);
    var payload = compayload(msg);
    console.log('=======>', command.toString());
    //16-20 payload lenght
    var len_buf = new Buffer(4);
    var len = payload.length;
    len_buf.writeInt16LE(len);
    //20-24 checksum
    var checksum = toBuffer(sha256(toBuffer(sha256(payload)))).slice(0, 4);

    var b = Buffer.concat([magic, command, len_buf, checksum, payload]);

    ttt('c',b);

    return b;
}

//优化 todo
const compayload = (msg) => {
    var a = new Buffer(0);
    var b;

    for (var name in msg) {
        if (name === 'vcn') {
            dftNumberH(msg['vcn']);
        } else if (name === 'sequence') {
            dftNumberI(msg['sequence']);
        } else if (name === 'pay_from') {
            dftArrayPayfrom();
        } else if (name === 'pay_to') {
            dftArrayPayto();
        } else if (name === 'scan_count') {
            dftNumberH(msg['scan_count']);
        } else if (name === 'min_utxo') {
            dftNumberq(msg['min_utxo']);
        }
        else if (name === 'max_utxo') {
            dftNumberq(msg['max_utxo']);
        }
        else if (name === 'sort_flag') {
            dftNumberI(msg['sort_flag']);
        } else if (name === 'last_uocks') {
            dftArraylastuocks();
        }
    }

    function dftArraylastuocks() {
        var num = msg['last_uocks'].length;
        if (num < 0xFD) {
            dftNumber1(num);
            for (var i = 0; i < num; i++) {
                var lastuocks = msg['last_uocks'][i];
                dftNumberq(lastuocks);
            }
        }
    }

    function dftArrayPayfrom() {
        var num = msg['pay_from'].length;
        if (num < 0XFD) {
            dftNumber1(num);
            for (var i = 0; i < num; i++) {
                var pay = msg['pay_from'][i];
                var v = pay.value;
                dftNumberq(v);
                var l_addr = pay.address.length;
                // 变长字符串
                if (l_addr < 0xFD) {
                    dftNumber1(l_addr);
                    b = new Buffer(pay.address);
                    a = Buffer.concat([a, b]);
                }
            }
        }
    }

    function dftArrayPayto() {
        var num = msg['pay_to'].length;
        if (num < 0XFD) {
            dftNumber1(num);
            for (var i = 0; i < num; i++) {
                var pay = msg['pay_to'][i];
                var v = pay.value;
                dftNumberq(v);
                var l_addr = pay.address.length;
                // 变长字符串
                if (l_addr < 0xFD) {
                    dftNumber1(l_addr);
                    b = new Buffer(pay.address);
                    a = Buffer.concat([a, b]);
                }
            }
        }
    }


    function dftNumber1(n) {
        b = new Buffer(1);
        b.writeUInt8(n);
        a = Buffer.concat([a, b]);
    }


    function dftNumberH(n) {
        b = new Buffer(2);
        b.writeUInt8(n)
        a = Buffer.concat([a, b]);
    }

    function dftNumberI(n) {
        b = new Buffer(4);
        b.writeUInt16LE(n);
        a = Buffer.concat([a, b]);
    }

    function dftNumberq(n) {
        b = new Buffer(8);
        b.writeInt32LE(n);
        a = Buffer.concat([a, b]);
    }

    return a;
}

function toBuffer(hex) {
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }))
    var buffer = typedArray.buffer
    buffer = Buffer.from(buffer);
    return buffer;
}

var pay_to = '', from_uocks = '';

var buf = query_sheet(pay_to, from_uocks)

console.log('buf:', buf, buf.length);

const axios = require('axios')

var URL = 'http://raw0.nb-chain.net/txn/sheets/sheet';

axios.post(URL, buf, {
    headers: {
        'Content-Type': 'application/octet-stream',//数据格式为二进制数据流
    },
}).then(res => {
    var data = res.data;
    console.log(data);
    var buf = new Buffer(data);
    console.log('> buf:', buf, buf.length);
})

module.exports = {
    verify, query_sheet
}