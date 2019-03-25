var sha256 = require('js-sha256');
var wallet_info = require('./message/wallet_info');
var request = require('sync-request')


var url_base = 'http://raw0.nb-chain.net/txn/state/account?'

// addr=1118Mi5XxqmqTBp7TnPQd1Hk9XYagJQpDcZu6EiGE1VbXHAw9iZGPV&uock=0&uock2=0

var URL = 'http://raw0.nb-chain.net/txn/state/account?addr=1118Mi5XxqmqTBp7TnPQd1Hk9XYagJQpDcZu6EiGE1VbXHAw9iZGPV&uock=0&uock2=0'

function getInfoData(addr, uock, uock2) {
  // var URL=url_base+'addr='+addr+'&uock='+uock+'&uock2='+uock2;
  // console.log('URL:', URL);
  // var res = request('GET', URL);
  // var res=res.getBody();
  // console.log('sync-res:',res,res.length);
  // parse(b);

}

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
    // var walletinfo=wallet_info.WalletInfo();
    var v = wallet_info.fromBuffer(payload);
    console.log('v:', v);
    return v;

    // walletinfo.fromBuffer(payload);
    // //TODO
    // m1(payload);
    // m2(payload);
    // m3(payload);
    // m4(payload);
    // m5(payload);
  } else {
    throw Error('command error');
  }
}

function m1(payload) {
  var buf = Buffer.allocUnsafe(4);
  var buf1 = payload.slice(0, 4);
  console.log('link_no buf:', buf1);
  var v = bufToNumber(buf1);
  buf.writeUInt32LE(v, 0);
  console.log('> link_no:', buf, bufToNumber(buf));
}

function m2(payload) {
  var buf = Buffer.allocUnsafe(4);
  var buf1 = payload.slice(4, 8);
  console.log('timestamp buf:', buf1);
  var v = bufToNumber(buf1);
  buf.writeUInt32LE(v, 0);
  console.log('> timestamp:', buf, bufToNumber(buf));
}

function m3(payload) {
  var s = payload.slice(8, 9);
  console.log('s:', s);
  var a1 = bufToNumber(s);
  if (a1 < 0xFD) {
    var buf = payload.slice(9, 9 + a1);
    var account = buf.toString('latin1');
    console.log('> account buf:', buf, buf.length);
    console.log('account:', account, account.length);
  }
}

function m4(payload) {
  var buf1 = payload.slice(63, 67);
  var buf = Buffer.allocUnsafe(4);
  console.log('search buf:', buf1);
  var v = bufToNumber(buf1);
  buf.writeUInt32LE(v, 0);
  console.log('> search:', buf, bufToNumber(buf));
}

function m5(payload) {
  var buf1 = payload.slice(67, 68);
  var buf = Buffer.allocUnsafe(4);
  console.log('> buf1:', buf1);
  var v = bufToNumber(buf1);
  if (v < 0xFD) {
    uock(payload);
    value(payload);
    height(payload);
  }
}

function height(payload) {
  var buf1 = payload.slice(84, 88);
  var buf = Buffer.allocUnsafe(4);
  console.log('> height buf1:', buf1);
  buf = LE64(buf1);
  console.log('> LE64 buf1:', buf);
  var v = bufToNumber(buf);
  console.log('height:', v);
}

function value(payload) {
  var buf1 = payload.slice(76, 84);
  var buf = Buffer.allocUnsafe(8);
  console.log('> value buf1:', buf1);
  buf = LE64(buf1);
  console.log('> LE64 buf1:', buf);
  var v = bufToNumber(buf);
  console.log('value:', v);
}

function uock(payload) {
  var buf1 = payload.slice(68, 76);
  var buf = Buffer.allocUnsafe(8);
  console.log('> uock buf1:', buf1);
  buf = LE64(buf1);
  console.log('> LE64 buf1:', buf);
  var v = bufToNumber(buf);
  console.log('uock:', v);
}

function LE64(buf) {
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


exports.getInfoData = getInfoData

// getInfoData();

//测试
// let buf1 = Buffer.from([0x58, 0xcf, 0x01, 0x20]);
// LE64(buf1);
// console.log('number:', calcValue(buf1));
// console.log('v:',v);

// f96e6274616363737461746500000000580000003bb69b1500000000fb12955c36313131384d69355878716d7154427037546e50516431486b39585961674a517044635a7536456947453156625848417739695a4750560004000001000010000051500000743ba40b0000004b4f0000