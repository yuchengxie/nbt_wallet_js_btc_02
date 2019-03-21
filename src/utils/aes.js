// const CryptoJS = require('crypto-js')

// const keySize = 128;

// const CipherOption = {
//     mode: CryptoJS.mode.ECB,
//     padding: CryptoJS.pad.Pkcs7,
// }
// /**
//  * 
//  * @param {密码} key 
//  */
// const fillKey = (key) => {
//     const filledKey = Buffer.alloc(keySize / 8);
//     const keys = Buffer.from(key);
//     if (keys.length < filledKey.length) {
//         keys.map((b, i) => {
//             filledKey[i] = b;
//         });
//     }
//     return filledKey;
// }

// /**
//  * 
//  * @param {待加密数据} data 
//  * @param {加密密码} key 
//  */
// const Encrypt = (data, key) => {
//     key = CryptoJS.enc.Utf8.parse(fillKey(key));
//     const cipher = CryptoJS.AES.encrypt(data, key, CipherOption);
//     const base64Cipher = cipher.ciphertext.toString(CryptoJS.enc.Base64);
//     const resultCipher = base64Cipher.replace(/\+/g, '-').replace(/\//g, '_');
//     return resultCipher;
// }

// /**
//  * 
//  * @param {待解密数据} encrypted 
//  * @param {加密密码} key 
//  */
// const Decrypt = (encrypted, key) => {
//     key = CryptoJS.enc.Utf8.parse(fillKey(key));
//     const restoreBase64 = encrypted.replace(/\-/g, '+').replace(/_/g, '/');
//     const decipher = CryptoJS.AES.decrypt(restoreBase64, key, CipherOption);
//     const resultDecipher = CryptoJS.enc.Utf8.stringify(decipher);
//     return resultDecipher;
// }



const crypto = require('crypto');
 
function Encrypt(data, key) {
    console.log('key:',key);
    const cipher = crypto.createCipher('aes-128-ecb', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
 
function Decrypt(encrypted, key) {
    const decipher = crypto.createDecipher('aes-128-ecb', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

exports.Encrypt=Encrypt
exports.Decrypt=Decrypt

//48b72694350dd82db6c78f73a059729a585c849206cbc849b2251db61d59d2f4cdf4f0e88492f4594fb07d63768805545bd2c7a959e5f96cb725c1758074c481
//48b72694350dd82db6c78f73a059729a585c849206cbc849b2251db61d59d2f4cdf4f0e88492f4594fb07d63768805545bd2c7a959e5f96cb725c1758074c481
// console.log(Decrypt('48b72694350dd82db6c78f73a059729a585c849206cbc849b2251db61d59d2f4cdf4f0e88492f4594fb07d63768805545bd2c7a959e5f96cb725c1758074c481','123!@#abc'))

