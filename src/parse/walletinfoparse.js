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
        var info = fromBuffer(payload);
        return info;
    } else {
        throw Error('command error');
    }
}

function Found() {
    this.uock = 0;
    this.value = 0;
    this.height = 0;
}

function WalletInfo() {
    this.link_no = 0;
    this.timestamp = 0;
    this.account = '';
    this.search = 0;
    this.found = [];
}

const fromBuffer = (buffer) => {

    let offset = 0;
    let walletinfo = new WalletInfo();

    walletinfo.link_no = ftNumberI();
    walletinfo.timestamp = ftNumberI();
    walletinfo.account = ftVarString();
    walletinfo.search = ftNumberI();
    walletinfo.found = found();

    return walletinfo;

    function found() {
        var a = readSlice(1);
        var n = bufToNumber(a);
        var b = [];
        if (n < 0xFD) {
            for (var i = 0; i < n; i++) {
                var f = new Found();
                f.uock = ftNumberq();
                f.value = ftNumberq();
                f.height = ftNumberq();
                b.push(f);
            }
        } else {

        }
        return b;
    }

    function ftVarString() {
        var a = readSlice(1);
        var n = bufToNumber(a);
        var b;
        if (n < 0xFD) {
            b = readSlice(n).toString('latin1');
        } else {
            //todo
        }
        return b;
    }

    function ftNumberI() {
        var b = readSlice(4);
        return bufToNumber(LE(b));
    }

    function ftNumberq() {
        var b = readSlice(8);
        return bufToNumber(LE(b));
    }

    function readSlice(num) {
        var b = buffer.slice(offset, offset + num);
        offset += num;
        return b;
    }




    // walletinfo.link_no = m1(buffer);
    // walletinfo.timestamp = m2(buffer);
    // walletinfo.account = m3(buffer);
    // walletinfo.search = m4(buffer);
    // walletinfo.found = m5(buffer);

    // return walletinfo;

    // function m1(payload) {
    //   var buf = Buffer.allocUnsafe(4);
    //   var buf1 = payload.slice(0, 4);
    //   console.log('link_no buf:', buf1);
    //   var v = bufToNumber(buf1);
    //   buf.writeUInt32LE(v, 0);
    //   console.log('> link_no:', buf, bufToNumber(buf));
    //   return bufToNumber(buf);
    // }

    // function m2(payload) {
    //   var buf = Buffer.allocUnsafe(4);
    //   var buf1 = payload.slice(4, 8);
    //   console.log('timestamp buf:', buf1);
    //   var v = bufToNumber(buf1);
    //   buf.writeUInt32LE(v, 0);
    //   console.log('> timestamp:', buf, bufToNumber(buf));
    //   return bufToNumber(buf);
    // }

    // function m3(payload) {
    //   var s = payload.slice(8, 9);
    //   console.log('s:', s);
    //   var a1 = bufToNumber(s);
    //   if (a1 < 0xFD) {
    //     var buf = payload.slice(9, 9 + a1);
    //     var account = buf.toString('latin1');
    //     console.log('account:', account, account.length);
    //     return account;
    //   }

    // }

    // function m4(payload) {
    //   var buf1 = payload.slice(63, 67);
    //   var buf = Buffer.allocUnsafe(4);
    //   console.log('search buf:', buf1);
    //   var v = bufToNumber(buf1);
    //   buf.writeUInt32LE(v, 0);
    //   console.log('> search:', buf, bufToNumber(buf));
    //   return bufToNumber(buf);
    // }

    // function m5(payload) {
    //   var buf1 = payload.slice(67, 68);
    //   console.log('> buf1:', buf1);
    //   var v = bufToNumber(buf1);
    //   if (v < 0xFD) {
    //     var found = new Found();
    //     found.uock = uock(payload);
    //     found.value = value(payload);
    //     found.height = height(payload);
    //     return found;
    //   }
    // }

    // function height(payload) {
    //   var buf1 = payload.slice(84, 88);
    //   var buf = Buffer.allocUnsafe(4);
    //   buf = LE64(buf1);
    //   var _height = bufToNumber(buf);
    //   console.log('height:', _height);
    //   return _height;
    // }

    // function value(payload) {
    //   var buf1 = payload.slice(76, 84);
    //   var buf = Buffer.allocUnsafe(8);
    //   buf = LE64(buf1);
    //   var _value = bufToNumber(buf);
    //   console.log('value:', _value);
    //   return _value;
    // }

    // function uock(payload) {
    //   var buf1 = payload.slice(68, 76);
    //   var buf = Buffer.allocUnsafe(8);
    //   buf = LE64(buf1);
    //   var _uock = bufToNumber(buf);
    //   console.log('uock:', _uock);
    //   return _uock;
    // }

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

