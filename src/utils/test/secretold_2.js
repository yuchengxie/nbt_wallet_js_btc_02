const secureRandom = require('secure-random');
const base58 = require('bs58')
const ec = require('elliptic').ec
const ecdsa = new ec('secp256k1')
const sha256 = require('js-sha256');
const bs58 = require('bs58')
const sha512 = require('js-sha512');
const bip32 = require('bip32')
const ripemd160 = require('ripemd160');
const wif = require('wif');
const AES = require('./aes')

let BIP32;

function savePrvKeyWithStr(prvKeyStr) {
    if (prvKeyStr.length != 64) throw Error('长度须为64');
    let prvKeyBuf = toBuffer(prvKeyStr);
    BIP32 = bip32.fromPrivateKey(prvKeyBuf, new Buffer(32));

    console.log('> prvKeyBuf:', prvKeyBuf, prvKeyBuf.length);

    let keyWIF = toWIF(prvKeyStr);
    console.log('> keyWIF:', keyWIF, keyWIF.length);
    //加密私钥
    AES.Encrypt(keyWIF)
    genAddr();

    // // //生成公钥
    // let pubKeyHash = createPubKeyHashWithPrvKeyHash();
    // console.log("> pubKeyHash:", pubKeyHash);

    //生成地址
    // let addr = createPublicAddress(pubKeyHash);
    // console.log("> addr:", addr, addr.length);


    // if (prvKeyStr.length != 64) throw Error('长度须为64');
    // let keyWIF = toWIF(prvKeyStr);

    // let prvKeyBuf = toBuffer(prvKeyStr);
    // console.log('prvKeyBuf:', prvKeyBuf, prvKeyBuf.length);
    // //生成公钥
    // let pubKeyHash = createPubKeyHashWithPrvKeyHash(prvKeyBuf);
    // console.log("> pubKeyHash:", pubKeyHash, pubKeyHash.length);
    // //  //生成地址
    // let addr = createPublicAddress(pubKeyHash);
    // console.log("> addr:", addr, addr.length);
    // console.log('> encoded:', keyWIF, keyWIF.length);
    // // //给私钥作AES加密
    // let encrypt_prvKey = AES.Encrypt(keyWIF);
    // console.log("> encrypt_prvKey:", encrypt_prvKey, encrypt_prvKey.length);
    // return 'encrypt_prvKey';
    return '';
}

function createPrvKeyWithStr(str) {
    console.log('> str:' + str, str.length);
    if (str.length < 16 || str.length > 32) throw new Error('长度必须16到32之间');
    BIP32 = bip32.fromSeed(Buffer.from(str));
    let prvKeyBuf = BIP32.privateKey;
    console.log('> prvKeyBuf:', prvKeyBuf, prvKeyBuf.length);
    let prvKeyStr = BufferToString(prvKeyBuf);
    console.log('> prvKeyStr:', prvKeyStr, prvKeyStr.length);
    let keyWIF = toWIF(prvKeyStr);
    console.log('> keyWIF:', keyWIF, keyWIF.length);
    //给私钥作AES加密
    let encrypt_prvKey = AES.Encrypt(keyWIF);
    console.log("> encrypt_prvKey:", encrypt_prvKey, encrypt_prvKey.length);
    //生成公钥
    // let pubKeyHash = createPubKeyHashWithPrvKeyHash(prvKeyBuf);
    // console.log("> pubKeyHash:", pubKeyHash, pubKeyHash.length);
    // // 生成地址
    // let addr = createPublicAddress(pubKeyHash);
    // console.log("> addr:", addr, addr.length);
    return encrypt_prvKey;
}

//根据私钥生成公钥
function genAddr() {
    let pubbuf = BIP32.publicKey;
    console.log('> publickey,', pubbuf, pubbuf.length);
    let hashbuf = sha512.array(pubbuf);
    console.log('>hashbuf:', hashbuf, hashbuf.length);

    let s1 = new ripemd160().update(Buffer.from(hashbuf.slice(0, 32), 'hex')).digest();
    console.log(s1, s1.length);
    let s2 = new ripemd160().update(Buffer.from(hashbuf.slice(32, 64), 'hex')).digest();
    console.log(s2, s2.length);

    //上面ok

    let vcn = 0x00;
    let hi = vcn & 0xffff;

    let version = 0x00;
    let b0 = Buffer.from(new Array(0x00));
    console.log('b0:', b0, b0.length);

    let arr = new Array(0x00, 0x00);
    let b1 = Buffer.from(arr);
    console.log('b1:', b1, b1.length);

    let h = sha256(Buffer.concat([s1,s2]));
    console.log(h, h.length);
    let b2 = toBuffer(h);
    console.log('b2:', b2, b2.length);

    let cointype = 0x00;
    let b3 = Buffer.from(new Array(0x00));
    console.log('b3:', b3, b3.length);

    
    let t = Buffer.concat([Buffer.from([0x00]), Buffer.from([0x00,0x00]), b2, Buffer.from([0x00])]);
    console.log('t:', t, t.length);

    // let d = sha256.sha256(t);
    let d1=sha256(t);
    console.log('> d1:',d1,d1.length);
    let d1buf=toBuffer(d1);
    console.log('> d1buf:',d1buf,d1buf.length);
    let d2=sha256(d1buf);
    console.log('> d2:',d2,d2.length);
    let checksum=toBuffer(d2).slice(0,4);
    console.log('> checksum:',checksum,checksum.length);
    let result=Buffer.concat([t,checksum]);
    console.log('> result:',result,result.length);
    let addr=bs58.encode(result);
    console.log('> addr:',addr,addr.length);

    // let encoder = bs58.encode(t);
    // console.log('> encoder:', encoder, encoder.length);

    // let digest = sha256(d);
    // let digest = sha256(toBuffer(d));
    // console.log('> digest:', digest, digest.length);
    // // let digest2 = sha256(digest);
    // let digest2 = sha256(toBuffer(digest));
    // console.log('> digest2:', digest2, digest2.length);
    // let checksum = digest2.substring(0, 8);
    // console.log('> checksum:', checksum, checksum.length);
    // let pre = d + checksum;
    // let pre = tstr + checksum;
    // let pre = tstr + checksum;
    // console.log('> pre:', pre, pre.length);
    // let addr = bs58.encode(toBuffer(pre));
    // console.log('> addr:', addr, addr.length);


    // console.log('> prvKeyBuf:',prvKeyBuf,prvKeyBuf.length);

    // let keys = ecdsa.keyFromPrivate(prvKeyBuf);
    // let a=keys.getPublic('hex');
    // console.log('a:',a,a.length);
    // let hash = sha256(Buffer.from(publicKey, 'hex'))



    // //BTC地址
    // let keys = ecdsa.keyFromPrivate(prvKeyBuf);
    // let publicKey = keys.getPublic('hex');
    // console.log('> publicKey:', publicKey, publicKey.length);
    // let hash = sha256(Buffer.from(publicKey, 'hex'))
    // console.log('> hash:' + hash, hash.length);
    //NBC地址 TODO
    // let hash2=sha512('hello');
    // console.log('> hash2:' + hash2, hash2.length);
    //[)
    // console.log(hash.substring(0,16))
    // let s1=new ripemd160().update(Buffer.from(hash.substring(0,32),'hex')).digest();
    // console.log('> s1:' + s1, s1.length);d
    // let s2=new ripemd160().update(Buffer.from(hash.substring(32,64),'hex')).digest();
    // console.log('> s2:' + s2, s2.length);
    // let publicKeyHash = new ripemd160().update(Buffer.from(hash, 'hex')).digest();
}

//根据公钥生成地址 --比特币的方式
function createPublicAddress(publicKeyHash) {
    // step 1 - add prefix "00” in hex 
    const s1 = Buffer.from('00' + publicKeyHash.toString('hex'), 'hex');
    // step 2 - create SHA256 hash of step 1
    const s2 = sha256(s1);
    // step 3 - create SHA256 hash of step 2 
    const s3 = sha256(Buffer.from(s2, 'hex'));
    // step 4 - find the 1st byte of step 3 - save as "checksum” 
    const checksum = s3.substring(0, 8);
    // step 5 - add step 1 +checksun
    const s5 = s1.toString('hex') + checksum;
    // step 6 - base58 encoding of step 5
    const addr = base58.encode(Buffer.from(s5, 'hex'));
    return addr;


}

// 对私钥编码:
function toWIF(privateKeyStr) {
    let encoded = wif.encode(
        0x80, // 0x80前缀
        Buffer.from(privateKeyStr, 'hex'), // 转换为字节
        true // 非压缩格式
    );
    let len = (encoded.length).toString(16);
    encoded = len + encoded;
    return encoded;
}

// function prvKeyWIF(prvKey) {
//     let s1 = Buffer.from('80' + prvKey.toString('hex'), 'hex');
//     let s2 = sha256(s1);
//     let s3 = sha256(Buffer.from(s2, 'hex'));
//     let checksum = s3.substring(0, 8);
//     let s4 = s1.toString('hex') + checksum;
//     return base58.encode(Buffer.from(s4, 'hex'));
// }

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

function toBuffer(hex) {
    var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }))
    var buffer = typedArray.buffer
    buffer = Buffer.from(buffer);
    return buffer;
}

exports.createPrvKeyWithStr = createPrvKeyWithStr
exports.savePrvKeyWithStr = savePrvKeyWithStr
