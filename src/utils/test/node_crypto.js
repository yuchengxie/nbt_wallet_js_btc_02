var NodeRSA = require('node-rsa');
var key = new NodeRSA({ b: 512 });
var publicDer = key.exportKey('public');
var privateDer = key.exportKey('private');
console.log('公钥:\n', publicDer);
console.log('私钥:\n', privateDer);