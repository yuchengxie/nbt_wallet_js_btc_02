const _BASE58_CHAR = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const _TX_TRANSFER_MAX = 1000000000000     //10000 NBC
const WEB_SERVER_ADDR = 'http://raw0.nb-chain.net'
const fs = require('fs');

var sequence = 0

function PayFrom() {
    this.value = 0;
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

    prepare_txn1_(pay_to, ext_in, scan_count, min_utxo, max_utxo, sort_flag, from_uocks);
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
    submit_txn_(makesheet, true);
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

function submit_txn_(msg, submit) {
    var pythonbuf = toBuffer(hexStr);
    console.log('>>> a:', pythonbuf, pythonbuf.length);

    ttt('a', pythonbuf);

    console.log('=========================================================================================')
    // 6d 61 6b 65 73 68 65 65 74 00 00 00
    var command = Buffer.allocUnsafe(12);
    command.write(command_type);
    // console.log('>>> command:', command);

    //转二进制
    const magic = Buffer.from([0xf9, 0x6e, 0x62, 0x74]);
    // console.log('>>> magic:', magic);
    var other = new Buffer(8);
    // console.log('other:', other);
    var h = Buffer.concat([magic, command, other]);
    console.log('>>> h:', h, h.length);
    // console.log('>>> msg:', msg);
    var payload = convpayload(msg, h);
    var b = Buffer.concat([h, payload]);
    console.log('b', b, b.length);
    ttt('b', b);
}

//优化 todo
const compayload = (str) => {
    var a = new Buffer(0);
    var b;

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

}

function convpayload(msg, h) {

    var a = new Buffer(0);
    var b;
    for (var name in msg) {
        if (name === 'vcn') {
            b = new Buffer(2);
            b.writeUInt8(msg['vcn'])
            a = Buffer.concat([a, b]);
        }
        if (name === 'sequence') {
            b = new Buffer(4);
            b.writeUInt16LE(msg['sequence'])
            a = Buffer.concat([a, b]);

            console.log('>>> b:', b, b.length);
            console.log('>>> a:', a, a.length);
        }
        if (name === 'pay_from') {
            var num = msg['pay_from'].length;
            console.log('>>> pay_from len', num);
            if (num < 0XFD) {
                b = new Buffer(1);
                b.writeUInt8(1);
                a = Buffer.concat([a, b]);
                for (var i = 0; i < num; i++) {
                    var payfrom = msg['pay_from'][i];
                    b = new Buffer(8);

                    var v = payfrom.value;
                    b.writeInt32LE(v);
                    var addr = payfrom.address;
                    a = Buffer.concat([a, b]);
                    var l_addr = payfrom.address.length;
                    if (l_addr < 0xFD) {
                        b = new Buffer(1);
                        b.writeInt8(l_addr);
                        a = Buffer.concat([a, b]);

                        b = new Buffer(payfrom.address);
                        a = Buffer.concat([a, b]);
                        // console.log('>>> b:', b, b.length);
                    }
                }
            }
        }

        if (name === 'pay_to') {
            var num = msg['pay_to'].length;
            console.log('>>> pay_to len', num);
            if (num < 0XFD) {
                b = new Buffer(1);
                b.writeUInt8(1);
                a = Buffer.concat([a, b]);
                for (var i = 0; i < num; i++) {
                    var payto = msg['pay_to'][i];
                    b = new Buffer(8);

                    var v = payto.value;
                    b.writeInt32LE(v);
                    a = Buffer.concat([a, b]);
                    var l_addr = payto.address.length;
                    if (l_addr < 0xFD) {
                        b = new Buffer(1);
                        b.writeInt8(l_addr);
                        a = Buffer.concat([a, b]);

                        b = new Buffer(payto.address);
                        a = Buffer.concat([a, b]);
                    }
                }
            }
        }

        if (name === 'scan_count') {
            b = new Buffer(2);
            b.writeUInt8(msg['vcn'])
            a = Buffer.concat([a, b]);
        }

        if (name === 'min_utxo') {
            b = new Buffer(8);
            b.writeInt32LE(msg['min_utxo'])
            a = Buffer.concat([a, b]);
        }

        if (name === 'max_utxo') {
            b = new Buffer(8);
            b.writeInt32LE(msg['max_utxo'])
            a = Buffer.concat([a, b]);
        }

        if (name === 'sort_flag') {
            b = new Buffer(4);
            b.writeUInt16LE(msg['sort_flag'])
            a = Buffer.concat([a, b]);
        }

        if (name === 'last_uocks') {
            var num = msg['last_uocks'].length;
            if (num < 0xFD) {
                b = new Buffer(1);
                b.writeInt8(num);
                a = Buffer.concat([a, b]);
                for (var i = 0; i < num; i++) {
                    var lastuocks = msg['last_uocks'][i];
                    b = new Buffer(8);
                    b.writeInt32LE(lastuocks);
                    a = Buffer.concat([a, b]);
                }
            }
        }
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
query_sheet(pay_to, from_uocks)

module.exports = {
    verify, query_sheet
}