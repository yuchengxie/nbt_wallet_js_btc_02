var NodeRSA = require('node-rsa');
const BASE64 = 'base64';
// var key = new NodeRSA({ b: 512 }); //生成新的512位长度密钥
// console.log(key);
var privateKey = new NodeRSA(` -----BEGIN RSA PRIVATE KEY-----
MIIBOQIBAAJBAOaL9QN6K00oTXTW/AUV9/QFFoHANznZLOBSfPyQIcrCA4qJWmWF
BiHsR1Unco52j/WHL3r60fNk+1T5p5xQdx8CAwEAAQJAFr03LWCfZLzU5vFNajMA
gdD+p02OJOaGxplcOoz8yEKqoSpkTEfBLPTh8JYuUx+55yD//G9Ip+ZaldvgImFI
AQIhAPx6uuJsFTed6qinEoI96X9Ul3PIoIcWj+zbNV76egYxAiEA6cLvM+h78nKo
USgOpSyCaRHuLyABYMGfuvtpbriX7k8CIC8O1PxUttOp7E3I7gs2bOndo2jiMQFc
tDCqXtU4DDxRAiBWJ2w1u2eDMdLrJlJPehoOU3dvkuIvIO2X4nU3Q31rbQIgFa5C
Hoj/tVihsIrVvFA3wV6DMVHP25xUg8VYm9jhy5Y=
-----END RSA PRIVATE KEY-----`);
var str = `{
    "name": "myapp",
    "path": "./app",
    "write": "true",
    "read": "false"
}`; // 加密前数据

//签名
var signedData = privateKey.sign(Buffer.from(str), BASE64).toString(BASE64);
console.log(signedData);


//验证签名
var publicKey = new NodeRSA(` -----BEGIN PUBLIC KEY-----
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAOaL9QN6K00oTXTW/AUV9/QFFoHANznZ
LOBSfPyQIcrCA4qJWmWFBiHsR1Unco52j/WHL3r60fNk+1T5p5xQdx8CAwEAAQ==
-----END PUBLIC KEY-----`);
signedData = 'WIrb/w2f4fSzUvQhDQAG+rDqVccufZ0isR3k04XjFDHSglsRWn9GlH56JEDO0YMULac1EO4oIIQctIYOUylCyg==';
var result = publicKey.verify(Buffer.from(str), signedData, 'Buffer', BASE64);
console.log(result)