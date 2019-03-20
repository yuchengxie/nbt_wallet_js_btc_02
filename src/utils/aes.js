const CryptoJS = require('crypto-js')

const keySize = 128;

const CipherOption = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
}
/**
 * 
 * @param {密码} key 
 */
const fillKey = (key) => {
    const filledKey = Buffer.alloc(keySize / 8);
    const keys = Buffer.from(key);
    if (keys.length < filledKey.length) {
        keys.map((b, i) => {
            filledKey[i] = b;
        });
    }
    return filledKey;
}

/**
 * 
 * @param {待加密数据} data 
 * @param {加密密码} key 
 */
const Encrypt = (data, key) => {
    key = CryptoJS.enc.Utf8.parse(fillKey(key));
    const cipher = CryptoJS.AES.encrypt(data, key, CipherOption);
    const base64Cipher = cipher.ciphertext.toString(CryptoJS.enc.Base64);
    const resultCipher = base64Cipher.replace(/\+/g, '-').replace(/\//g, '_');
    return resultCipher;
}

/**
 * 
 * @param {待解密数据} encrypted 
 * @param {加密密码} key 
 */
const Decrypt = (encrypted, key) => {
    key = CryptoJS.enc.Utf8.parse(fillKey(key));
    const restoreBase64 = encrypted.replace(/\-/g, '+').replace(/_/g, '/');
    const decipher = CryptoJS.AES.decrypt(restoreBase64, key, CipherOption);
    const resultDecipher = CryptoJS.enc.Utf8.stringify(decipher);
    return resultDecipher;
}

exports.Encrypt=Encrypt
exports.Decrypt=Decrypt

