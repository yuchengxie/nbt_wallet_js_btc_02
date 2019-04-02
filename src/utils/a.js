const _BASE58_CHAR = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const _TX_TRANSFER_MAX = 1000000000000     //10000 NBC
const WEB_SERVER_ADDR = 'http://raw0.nb-chain.net'
const fs = require('fs');
const sha256 = require('js-sha256')
const axios = require('axios')
var URL = 'http://raw0.nb-chain.net/txn/sheets/sheet';
let dhttp = require('dhttp')
var Buffer = require('safe-buffer').Buffer
const bs58 = require('bs58')
const file = require('./file')
const script = require('../nscript/script')

var format = require('../parse/format').Format
var messages = require('../parse/messages')

var command_type = 'makesheet';
var magic = Buffer.from([0xf9, 0x6e, 0x62, 0x74]);
var sequence = 0;
var makesheet;
var orgsheetMsg;

function OrgSheet() {
    this.sequence = 0;
    this.pks_out = [];
    this.last_uocks = [];
    this.version = 0;
    this.tx_in = [];
    this.tx_out = [];
    this.lock_time = 0;
    this.signature = '';
}

function VarStrList() {
    this.items = [];
}

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

function Txn() {
    this.version = 0;
    this.tx_in = [];
    this.tx_out = [];
    this.lock_time = 0;
    this.sig_raw = '';
}

function TxnIn() {
    this.prev_output = '';
    this.sig_script = '';
    this.sequence = 0;
}

function OutPoint() {
    this.hash = '';
    this.index = 0;
}

function TxnOut() {
    this.value = 0;
    this.pk_script = '';
}

// f96e62746d616b657368656574000000
var hexStr = 'f96e62746d616b657368656574000000a5000000e8d6839d00000100000001000000000000000036313131384d69355878716d7154427037546e50516431486b39585961674a517044635a7536456947453156625848417739695a4750560100e1f50500000000363131313941774278426e52583353644e4d3637457750476239436d535455635033716b3768684e565575534764584a474c6a456e697300000000000000000000000000000000000000000000010000000000000000';

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


    makesheet = new MakeSheet();
    makesheet.vcn = 0;
    makesheet.sequence = sequence;
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
            // console.log(filename + '写入成功');
        }
    })

    var hexStr = 'f96e62746f72677368656574000000003c010000c8e6ee530100000001012876b8230000db83cf42e02199d4fa29d14a197a167ade519298f0c2f98ec5478092497bcd5c00b7ac010100100000636900010000000191706ece9b800e5498c8ab429677d71f6bad60aa56929b2cc9b2cd6ecce5771f010000006e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffff0200e1f505000000002876b8230000f3cf4ba110b50dc1b165d6e93c05ea4a7c35e5d2e8d736cf10955d5c33d7ea0f00b7ac74b4c4da0a0000002876b8230000db83cf42e02199d4fa29d14a197a167ade519298f0c2f98ec5478092497bcd5c00b7ac0000000000'
    var s = '';
    for (var i = 0; i < hexStr.length / 2; i++) {
        var tmp = hexStr[2 * i] + hexStr[2 * i + 1];
        s += tmp + '\n';
    }
    fs.writeFile('res_python.txt', s, function (err) {

        if (err) console.log(err);
        else {
            console.log('python.txt' + '写入成功');
        }
    })
}

function submit_txn_(msg, submit) {
    //0-4
    const magic = Buffer.from([0xf9, 0x6e, 0x62, 0x74]);
    //4-16
    var command = new Buffer(12);
    command.write('makesheet', 0);
    // console.log('>>> command:', command);
    //24-
    // var payload = convpayload(msg);
    var payload = compayload(msg);
    // console.log('=======>', command.toString());
    //16-20 payload lenght
    var len_buf = new Buffer(4);
    var len = payload.length;
    len_buf.writeInt16LE(len);
    //20-24 checksum
    var checksum = toBuffer(sha256(toBuffer(sha256(payload)))).slice(0, 4);

    var b = Buffer.concat([magic, command, len_buf, checksum, payload]);

    // ttt('node', b);

    return b;
}

//数据组包
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
        //n转16进制buffer
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
// console.log('发送buf:', buf, buf.length);

dhttp({
    method: 'POST',
    url: URL,
    body: buf
}, function (err, res) {
    if (err) throw err;

    txnparse(res.body)

    var wallet = file.getwallet();
    // var coin_hash = Buffer.concat([wallet.pubkey, wallet.coin_type0]);
    var d = {};
    var payto = makesheet.pay_to
    for (var i = 0; i < payto.length; i++) {
        var p = payto[i];
        if (p.value != 0 || p.address.slice(0, 1) != 0x6a) {
            var ret = decode_check(p.address);
            d[ret] = p.value;
        }
    }


    var pks_out0 = orgsheetMsg.pks_out[0].items;
    var pks_num = pks_out0.length;
    var tx_ins2 = [];
    // console.log('pks_num:',pks_num);
    //sign every inputs
    var tx_in = orgsheetMsg.tx_in;
    for (var idx = 0; idx < tx_in.length; idx++) {
        if (idx < pks_num) {
            var hash_type = 1;
            var payload = script.make_payload(pks_out0[idx], orgsheetMsg.version, orgsheetMsg.tx_in, orgsheetMsg.tx_out, 0, idx, hash_type)  //lock_time=0

        }
    }

})

function decode_check(v) {
    var a = bs58.decode(v);
    var ret = a.slice(0, a.length - 4);
    var check = a.slice(a.length - 4);
    var checksum = toBuffer(sha256(toBuffer(sha256(ret))));
    // console.log('ret:', ret, ret.length)
    // console.log('check', check, check.length);
    // console.log('checksum:', checksum.slice(0, 4))
    if (checksum.compare(check) == 1) {
        // console.log('ret:', ret, ret.length)
        return ret.slice(1);
    }
}

function txnparse(buf) {
    if (buf.slice(0, 4).compare(magic) != 0) {
        throw Error('bad magic number');
    }
    var len = buf.slice(16, 20).readUInt16LE();
    console.log('len buffer:', buf.slice(16, 20), len);
    var payload = buf.slice(24, 24 + len);

    var checksum = toBuffer(sha256(toBuffer(sha256(payload)))).slice(0, 4);
    if (buf.slice(20, 24).compare(checksum) != 0) {
        throw Error('checksum error');
    }

    var command = strip(buf.slice(4, 16)).toString('latin1');
    console.log('>>> command:', command);

    if (command === 'orgsheet') {
        orgsheetMsg = parseOrgSheet(payload);
        // console.log('>>> orgsheetMsg <<< ',orgsheetMsg)
    }
}

const parseOrgSheet = (payload) => {
    var offset = 0;
    var n = 0
    // var hexpayload=bufToStr(payload)
    // console.log('>>> payload:', hexpayload, hexpayload.length);
    var orgSheet = new OrgSheet();
    orgSheet.sequence = ftNumberI();
    orgSheet.pks_out = ftVarStrList();
    orgSheet.last_uocks = ftArrayq();
    orgSheet.version = ftNumberI();
    orgSheet.tx_in = ftArrayTxIn();
    orgSheet.tx_out = ftArrayTxOut();
    orgSheet.lock_time = ftNumberI();
    orgSheet.signature = ftVarString();

    function ftArrayTxOut() {
        var b = readSlice(1);
        n = bufToNumber(b);
        var arrTxnout = [];
        if (n < 0xFD) {
            for (var i = 0; i < n; i++) {
                var txo = new TxnOut();
                txo.value = ftNumberq();
                txo.pk_script = ftVarString();
                arrTxnout.push(txo);
            }
        }
        return arrTxnout;
    }

    function ftArrayTxIn() {
        var b = readSlice(1);
        n = bufToNumber(b);
        var arrTxnIn = [];
        if (n < 0xFD) {
            for (var i = 0; i < n; i++) {
                var txIn = new TxnIn();
                var outPoint = new OutPoint();
                outPoint.hash = ftBytes(32);
                outPoint.index = ftNumberI();
                txIn.prev_output = outPoint;
                txIn.sig_script = ftVarString();
                txIn.sequence = ftNumberI();
                arrTxnIn.push(txIn);
            }
        }
        return arrTxnIn;
    }


    function ftVarStrList() {
        var b = readSlice(1)
        var n = bufToNumber(b);
        var s = '';
        var list = [];
        if (n < 0xFD) {
            for (var i = 0; i < n; i++) {
                var varstrList = new VarStrList();
                b = readSlice(1);
                var m = bufToNumber(b);
                if (m < 0xFD) {
                    for (var j = 0; j < m; j++) {
                        var p = readSlice(1);
                        var q = bufToNumber(p);
                        var s = readSlice(q);
                        s = bufToStr(s);
                        varstrList.items.push(s);
                    }
                    list.push(varstrList);
                }
            }
        }
        // console.log('pks_out:', list, list.length);
        return list;
    }

    function ftArrayq() {
        var b = readSlice(1);
        var n = bufToNumber(b);
        var num = [];
        if (n < 0xFD) {
            n = ftNumberq();
            num.push(n);
        }
        return num;
    }

    function ftVarString() {
        var a = readSlice(1);
        var n = bufToNumber(a);
        var b;
        if (n < 0xFD) {
            b = readSlice(n);
        } else {
        }
        return bufToStr(b);
    }

    function FtVarInteger() {
        var a = readSlice(1);
        var n = bufToNumber(a);
        var b;
        if (n < 0xFD) {
            b = a;
        } else if (n <= 0xFFFF) {
            b = readSlice(2);
        } else if (n <= 0xFFFFFFFF) {
            b = readSlice(4);
        } else {
            b = readSlice(8);
        }
        return bufToNumber(b);
    }

    function ftBytes(n) {
        var b = readSlice(n);
        return bufToStr(b);
    }

    function ftNumberI() {
        var b = readSlice(4);
        var n = bufToNumber(LE(b));
        return n;
    }

    function ftNumberq() {
        var b = readSlice(8);
        var n = bufToNumber(LE(b));
        return n;
    }

    function readSlice(num) {
        var b = payload.slice(offset, offset + num);
        offset += num;
        return b;
    }

    return orgSheet;
}

function LE(buf) {
    var arr = [];
    for (var i = 0; i < buf.length; i++) {
        arr.push(buf[i]);
    }
    arr = arr.reverse();
    var buf2 = Buffer.from(arr);
    return buf2;
}

function bufToNumber(buf) {
    var t = 0;
    for (var i = buf.length - 1; i >= 0; i--) {
        let b = buf[i];
        var d = Math.pow(256, buf.length - i - 1);
        t += b * d;
    }
    return t;
}


function bufToStr(buf) {
    var s = '';
    buf.forEach(ele => {
        var tmp = ele.toString(16);
        if (tmp.length === 1) {
            s += '0' + tmp;
        } else {
            s += tmp;
        }
    });
    return s;
}

function strip(buf) {
    var arr = [];
    for (var i = 0; i < buf.length; i++) {
        arr.push(buf[i]);
    }
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == 0x00) {
            arr.splice(i, 1);
        } else {
            break;
        }
    }
    return Buffer.from(arr);
}

module.exports = {
    verify, query_sheet
}
