
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

var sha256 = require('js-sha256');

const magic = Buffer.from([0xf9, 0x6e, 0x62, 0x74]);

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
    console.log('>>>接受buffer', buffer, buffer.length);

    // if (buffer.length < 88) throw new Error('Buffer too small (<88 bytes)');

    let offset = 0;

    let replyHeaders = new ReplyHeaders();

    replyHeaders.link_no = p1();
    replyHeaders.heights = p2();
    // replyHeaders.txcks = m3(buffer);
    // walletinfo.search = m4(buffer);
    // walletinfo.found = m5(buffer);

    return replyHeaders;


    function p1() {
        var b = readSlice(4);
        console.log('link_no buf:', b);
        var linkno=bufToNumber(LE(b));
        console.log('link_no:', linkno);
        return linkno;
    }

    function p2(){
        var buf=readSlice(1);
        console.log('height size buf:', buf);
        var len=bufToNumber(buf);
        var heights=[];
        if (len<0xFD){
            for(var i=0;i<len;i++){
                var b=readSlice(4);
                var h=bufToNumber(LE(b));
                heights.push(h);
            }
        }
        console.log('heights:', heights,heights.length);
        return heights;
    }

    function readSlice(num) {
        var b=buffer.slice(offset, offset + num);
        offset += num;
        return b;
    }


    // function m1(payload) {
    //     var buf = Buffer.allocUnsafe(4);
    //     var buf1 = payload.slice(offset, 4);
    //     offset += 4;
    //     console.log('link_no buf:', buf1);
    //     var v = bufToNumber(buf1);
    //     buf.writeUInt32LE(v, 0);
    //     console.log('> link_no:', buf, bufToNumber(buf));
    //     return bufToNumber(buf);
    // }

    // function m2(payload) {
    //     var s = payload.slice(offset, 5);
    //     offset += 1;
    //     var b = bufToNumber(s);
    //     if (b < 0xFD) {
    //         //b=1
    //         var buf = payload.slice(offset, offset + 4);
    //         offset += 4;
    //         buf = LE64(buf);
    //         var t = bufToNumber(buf);
    //         console.log('heights:', t);
    //         return bufToNumber(buf);
    //     }
    // }


    // function m3(payload) {
    //     var s = payload.slice(offset, offset + 1);
    //     offset += 1;
    //     console.log('s:', s);
    //     var a1 = bufToNumber(s);
    //     if (a1 < 0xFD) {
    //         var buf = payload.slice(offset, offset + a1);


    //         var account = buf.toString('latin1');
    //         console.log('txcks:', account, account.length);
    //         return account;
    //     }

    // }

    // function m4(payload) {
    //     var buf1 = payload.slice(63, 67);
    //     var buf = Buffer.allocUnsafe(4);
    //     console.log('search buf:', buf1);
    //     var v = bufToNumber(buf1);
    //     buf.writeUInt32LE(v, 0);
    //     console.log('> search:', buf, bufToNumber(buf));
    //     return bufToNumber(buf);
    // }

    // function m5(payload) {
    //     var buf1 = payload.slice(67, 68);
    //     console.log('> buf1:', buf1);
    //     var v = bufToNumber(buf1);
    //     if (v < 0xFD) {
    //         var found = new Found();
    //         found.uock = uock(payload);
    //         found.value = value(payload);
    //         found.height = height(payload);
    //         return found;
    //     }
    // }

    // function height(payload) {
    //     var buf1 = payload.slice(84, 88);
    //     var buf = Buffer.allocUnsafe(4);
    //     buf = LE64(buf1);
    //     var _height = bufToNumber(buf);
    //     console.log('height:', _height);
    //     return _height;
    // }

    // function value(payload) {
    //     var buf1 = payload.slice(76, 84);
    //     var buf = Buffer.allocUnsafe(8);
    //     buf = LE64(buf1);
    //     var _value = bufToNumber(buf);
    //     console.log('value:', _value);
    //     return _value;
    // }

    // function uock(payload) {
    //     var buf1 = payload.slice(68, 76);
    //     var buf = Buffer.allocUnsafe(8);
    //     buf = LE64(buf1);
    //     var _uock = bufToNumber(buf);
    //     console.log('uock:', _uock);
    //     return _uock;
    // }
}



function LE(buf) {
    console.log('buf:', buf);
    var arr = [];
    for (var i = 0; i < buf.length; i++) {
        arr.push(buf[i]);
    }
    arr = arr.reverse();
    console.log(arr);
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

//32位无符号小端
function bufULE32(buf) {
    var t = 0;
    var arr = hexArr(buf.toString('hex'));
    console.log('buf:', buf, buf.length);
    for (var i = 0; i < arr.length; i++) {
        let b = arr[i];
        var c = parseInt(b, 16);
        var d = Math.pow(256, i);
        t += c * d;
    }
    return t;
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

