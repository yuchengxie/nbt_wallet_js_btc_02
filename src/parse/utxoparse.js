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
        var utxo = fromBuffer(payload);
        return utxo;
    } else {
        throw Error('command error:', msg_type);
    }
}

function UTXOState(){
    this.link_no=0;
    this.heights=[];
    this.indexes=[];
    this.txns=[];
}

function Txn(){
    this.version=0;
    this.tx_in=[];
    this.tx_out=[];
    this.lock_time=0;
    this.sig_raw='';
}

function TxnIn(){
    this.prev_output='';
    this.sig_script='';
    this.sequence=0;
}

function OutPoint(){
    this.hash='';
    this.index=0;
}

function TxnOut(){
    this.value=0;
    this.pk_script='';
}

const fromBuffer = (buffer) => {

    let offset = 0;

    let utxoState = new UTXOState();

    utxoState.link_no = ftNumberI();
    utxoState.heights=ftArrayI();
    utxoState.indexes=ftArrayI();
    utxoState.txns=txns();
    return utxoState;

    function ftArrayI() {
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

    function txns(){
        var buf = readSlice(1);
        var len = bufToNumber(buf);
        var ts = [];
        if(len<0xFD){
            var t=new Txn();
            t.version=ftNumberI();
            t.tx_in=txIn();
            t.tx_out=txOut();
            t.lock_time=ftNumberI;
            t.sig_raw=ftVarString();
            ts.push(t);
        }
        return ts;
    }

    function txIn(){
        var buf = readSlice(1);
        var len = bufToNumber(buf);
        var ins = [];
        if (len < 0xFD) {
            for (var i = 0; i < len; i++) {
                var txnIn=new TxnIn();
                txnIn.prev_output=outPoint();
                txnIn.sig_script=ftVarString();
                txnIn.sequence=ftNumberI();
                ins.push(txnIn);
            }
        }
        return ins;
    }

    function outPoint(){
        var op=new OutPoint();
        op.hash=ftBytes(32);
        op.index=ftNumberI();
        return op;
    }

    function txOut(){
        var buf = readSlice(1);
        var len = bufToNumber(buf);
        var outs = [];
        if (len < 0xFD) {
            for (var i = 0; i < len; i++) {
                var txout=new TxnOut();
                txout.value=ftNumberq();
                txout.pk_script=ftVarString();
                outs.push(txout);
            }
        }
        return outs;
    }

    function ftArrayq() {
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

    function headers() {
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
            } else {
                s += tmp;
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

