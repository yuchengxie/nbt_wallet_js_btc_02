// b'\xf9nbtaccstate\x00\x00\x00\x00X\x00\x00\x00.\xe1:\xe7\x00\x00\x00\x00{V\x94\\61118Mi5XxqmqTBp7TnPQd1Hk9XYagJQpDcZu6EiGE1VbXHAw9iZGPV\x00\x04\x00\x00\x01\x00\x00\x10\x00\x00QP\x00\x00t;\xa4\x0b\x00\x00\x00KO\x00\x00
// var ddd= "<AccState link_no=0 timestamp=1553225339 account=b'1118Mi5XxqmqTBp7TnPQd1Hk9XYagJQpDcZu6EiGE1VbXHAw9iZGPV' search=1024 found=[<UockValue uock=22607058579750912 value=50000000000 height=20299>]>"
// http://raw0.nb-chain.net/txn/state/account?addr=1118Mi5XxqmqTBp7TnPQd1Hk9XYagJQpDcZu6EiGE1VbXHAw9iZGPV&uock=0&uock2=0

var http = require('http');
var sha256=require('js-sha256');
var URL = 'http://raw0.nb-chain.net/txn/state/account?addr=1118Mi5XxqmqTBp7TnPQd1Hk9XYagJQpDcZu6EiGE1VbXHAw9iZGPV&uock=0&uock2=0'
const StringDecoder = require('string_decoder').StringDecoder;
var decoder = new StringDecoder('utf8');

//get 请求外网

function getInfoData() {
  http.get(URL, function (req, res) {
    req.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    req.timeout = 30
    var arr = [];
    req.on('data', function (chunk) {
      arr.push(chunk);
    });
    req.on('end', function () {
      var b = arr[0];
      for (var i = 1; i < arr.length; i++) {
        b0 = Buffer.concat(b0, arr[i]);
      }
      parse(b);
    });
  });
}

const magic = Buffer.from([0xf9, 0x6e, 0x62, 0x74]);

function parse(data) {
  console.log('data:', data, data.length);
  if (data.slice(0, 4).compare(magic) != 0) {
    //不相等
    throw Error('bad magic number');
  }
  //get binary payload
  var buf = data.slice(16, 20);
  var length = littleEndian(buf);
  var payload=data.slice(24,24+length);
  console.log('> payload:',payload,payload.length);
  //check the checksum
  var checksum=toBuffer(sha256(toBuffer(sha256(payload)))).slice(0,4);
  console.log('> checksum:',checksum,checksum.length);
  if(data.slice(20,24).compare(checksum)!=0){
      throw Error('bad checksum');
  }
  console.log(data.slice(20,24));
  var command=data.slice(4,16);
  console.log('> command:',command,command.length);
}

function toBuffer(hex) {
  var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
  }))
  var buffer = typedArray.buffer
  buffer = Buffer.from(buffer);
  return buffer;
}

function littleEndian(buf) {
  var t = 0;
  var arr=hexArr(buf.toString('hex'));
  console.log('buf:', buf, buf.length);
  for (var i = 0; i < arr.length; i++) {
    let b = arr[i];
    var c=parseInt(b,16);
    var d=Math.pow(256,i);
    t+=c*d;
  }
  return t;
}

function hexArr(hexStr) {
  var arr=[];
  for (var i = 0; i < hexStr.length/2; i++) {
    arr.push(hexStr[2*i]+hexStr[2*i+1]);
  }
  return arr;
}



// getInfoData();

//测试
buf1 = Buffer.from([0x58, 0xcf, 0x01, 0x10]);
// littleEndian(buf1)