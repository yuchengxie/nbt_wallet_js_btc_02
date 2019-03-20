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
console.log('a---:'+a);

var AesKey = "1111111111111111";
var CBCIV = "1234567890123456";

console.log('Aeskey:'+AesKey);
var CBCOptions={
    iv:CryptoJS.enc.Utf8.parse(CBCIV),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
}
//加密3
console.log('CryptoJS.enc.Utf8.parse(AesKey):'+CryptoJS.enc.Utf8.parse(AesKey));
var encrypt = CryptoJS.AES.encrypt(a, CryptoJS.enc.Utf8.parse(AesKey),CBCOptions );
console.log('encrypt:'+encrypt);
// console.log('encrypt:'+encrypt);
// console.log('encrypt2:'+_BIP32.toBase58(encrypt.toString()));

//解密
var decrypt=CryptoJS.AES.decrypt(encrypt.toString(), CryptoJS.enc.Utf8.parse(AesKey),CBCOptions);

// console.log('dencrypt:'+decrypt.toString());
console.log('dencrypt:'+CryptoJS.enc.Utf8.stringify(decrypt).toString());


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


