var bip32 = require('bip32');
var CryptoJS = require('crypto-js');  //引用AES源码js
var buf = '123123123123123123';
var _BIP32 = bip32.fromSeed(Buffer.from(buf));

var s = ''
var _privateKey = _BIP32.privateKey.toJSON().data;
var _publicKey = _BIP32.publicKey.toJSON().data;
var s0=BufferToString(_privateKey);
console.log(s0);
//wif
var m=_BIP32.toWIF(s0);
console.log(m);
var n=(m.length).toString(16);
console.log(n)
var a=n+m;
console.log(a);

// let key='111\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
let key='111\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
console.log('key:'+key);


var CBCIV = "1234567890123456";

//加密3
var encrypt = CryptoJS.AES.encrypt(a, CryptoJS.enc.Utf8.parse(key), {
    // mode: CryptoJS.mode.ECB,
    // iv:CryptoJS.enc.Utf8.parse(CBCV),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
});

console.log("encrypt: "+encrypt);
var m=_BIP32.toBase58(encrypt);
console.log('toBase58:'+m);
console.log(m.length);




//解密
var decrypt = CryptoJS.AES.decrypt(encrypt, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
});

console.log("解密value: "+decrypt.toString(CryptoJS.enc.Utf8));

function strToHexCharCode(str) {
    　　if(str === "")
    　　　　return "";
    　　var hexCharCode = [];
    　　hexCharCode.push("0x"); 
    　　for(var i = 0; i < str.length; i++) {
    　　　　hexCharCode.push((str.charCodeAt(i)).toString(16));
    　　}
    　　return hexCharCode.join("");
    }
    
    

function BufferToString(buf) {
    let s = '';
    buf.forEach(element => {
        let tmp = element.toString(16);
        if (tmp.length == 1) {
            s += '0' + tmp;
        } else {
            s += tmp;
        }
    })
    return s;
}

function saveTo(sPath, addr, password) {
    let cfg = {
        'encrypted': False,
        'type': 'default',
        'vcn': 0,
        'coin_type': 0,
        'testnet': 'testnet',
        'prvkey': None,
        'pubkey': None,
    }

}


