var bip32=require('bip32');
var bs58=require('bs58');

var a='Kyph8rzUPCpndJfRvFSpQ5TWApHbjRZQy7AE4oiAc2xczyszTgx6';
// 4dabbaf739e4dfec415fea38f1efdbb67a0786746db3d1063b2339a44fb13458
var buf1=bs58.decode(a);
var buf2=buf1.slice(1,33);

function bufToStr(buf2){
    var s='';
    buf2.forEach(ele => {
        var tmp=ele.toString(16);
        if (tmp.length==1){
            tmp='0'+tmp;
        }
        s+=tmp;
    });
    console.log('hex:',s);
}

console.log('buf1:',buf1,buf1.length);
console.log('buf2:',buf2,buf2.length);
bufToStr(buf2);

