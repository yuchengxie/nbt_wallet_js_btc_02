var sha256 = require('js-sha256');

const magic = Buffer.from([0xf9, 0x6e, 0x62, 0x74]);

function ReplyHeaders() {
    this.link_no = 0;
    this.heights = [];
    this.txcks = [];
    this.headers = [];
}

function BlockHeader() {
    this.version = 0;
    this.link_no = 0;
    this.prev_block = '';
    this.merkle_root = '';
    this.timestamp = 0;
    this.bits = 0;
    this.nonce = 0;
    this.miner = '';
    this.sig_tee = '';
    this.txn_count = 0;
}

function parse(data) {
    console.log('data:', data, data.length);
    if (data.slice(0, 4).compare(magic) != 0) {
        throw Error('bad magic number');
    }
    var buf = data.slice(16, 20);
    var value = bufToNumber(buf);
    var buf = Buffer.allocUnsafe(4);
    buf.writeUInt32LE(value, 0);
    var v2 = bufToNumber(buf);
    var payload = data.slice(24, 24 + v2);
    console.log('> payload:', payload, payload.length);
    //check the checksum
    var checksum = toBuffer(sha256(toBuffer(sha256(payload)))).slice(0, 4);
    console.log('> checksum:', checksum, checksum.length);
    if (data.slice(20, 24).compare(checksum) != 0) {
        throw Error('bad checksum');
    }
    var command = data.slice(4, 16);
    var stripCommand = strip(command);
    var msg_type = stripCommand.toString('latin1');
    console.log('> msg_type:', msg_type, msg_type.length);
    if (msg_type) {
        var block = fromBuffer(payload);
        return block;
    } else {
        throw Error('command error:', msg_type);
    }
}

const fromBuffer = (buffer) => {

    let offset = 0;

    let replyHeaders = new ReplyHeaders();

    replyHeaders.link_no = p1();
    replyHeaders.heights = p2();
    replyHeaders.txcks = p3();
    replyHeaders.headers = p4();
    return replyHeaders;

    function p1() {
        return ftNumberI();
    }

    function p2() {
        var buf = readSlice(1);
        var len = bufToNumber(buf);
        var heights = [];
        if (len < 0xFD) {
            for (var i = 0; i < len; i++) {
                var h = ftNumberI();
                heights.push(h);
            }
        }
        return heights;
    }

    function p3() {
        var buf = readSlice(1);
        var len = bufToNumber(buf);
        var txcks = [];
        if (len < 0xFD) {
            for (var i = 0; i < len; i++) {
                var h = ftNumberq();
                txcks.push(h);
            }
        }
        return txcks;
    }

    function p4() {
        var buf = readSlice(1);
        var len = bufToNumber(buf);
        var headers = [];
        if (len < 0xFD) {
            for (var i = 0; i < len; i++) {
                var header = new BlockHeader();
                header.version = ftNumberI();
                header.link_no = ftNumberI();
                header.prev_block = ftBytes(32);
                header.merkle_root = ftBytes(32);
                header.timestamp = ftNumberI();
                header.bits = ftNumberI();
                header.nonce = ftNumberI();
                header.miner = ftBytes(32);
                header.sig_tee = ftVarString();
                header.txn_count = FtVarInteger();
                headers.push(header);
            }
        }
        return headers;
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

    function bufToStr(buf) {
        var s = '';
        buf.forEach(ele => {
            var tmp = ele.toString(16);
            if (tmp.length === 1) {
                s += '0' + tmp;
            }else{
                s+=tmp;
            }
        });
        return s;
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
        var b = buffer.slice(offset, offset + num);
        offset += num;
        return b;
    }
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
    var arr = hexArr(buf.toString('hex'));
    for (var i = arr.length - 1; i >= 0; i--) {
        let b = arr[i];
        var c = parseInt(b, 16);
        var d = Math.pow(256, arr.length - i - 1);
        t += c * d;
    }
    return t;
}

function toBuffer(hex) {
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }))
    var buffer = typedArray.buffer
    buffer = Buffer.from(buffer);
    return buffer;
}

function hexArr(hexStr) {
    var arr = [];
    for (var i = 0; i < hexStr.length / 2; i++) {
        arr.push(hexStr[2 * i] + hexStr[2 * i + 1]);
    }
    return arr;
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

exports.parse = parse;

