const _BASE58_CHAR = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const _TX_TRANSFER_MAX = 1000000000000     //10000 NBC
const WEB_SERVER_ADDR = 'http://raw0.nb-chain.net'

var sequence = 0

function PayFrom() {
    this.value = 0;
    this.address = '';
}

function PayTo() {
    this.value = 0;
    this.address = '';
}

function MakeSheet() {
    this.vcn = 0;
    this.sequence = 0;
    this.pay_from = [];
    this.pay_to = [];
    this.scan_count = 0;
    this.min_utxo = 0;
    this.max_utxo = 0;
    this.sort_flag = 0;
    this.last_uocks = [];
}

function verify(addr) {
    if (addr.length <= 32) {
        throw Error('invalid address');
        return false;
    };
    for (var i = 0; i < addr.length; i++) {
        var ch = addr[i];
        if (_BASE58_CHAR.indexOf(ch) == -1) {
            throw Error('invalid address');
            return false;
        }
    }
    return true;
}


function query_sheet(pay_to, from_uocks) {
    var ext_in = null;
    var submit = true;
    var scan_count = 0;
    var min_utxo = 0;
    var max_utxo = 0;
    var sort_flag = 0;
    var from_uocks = null;

    prepare_txn1_(pay_to, ext_in, scan_count, min_utxo, max_utxo, sort_flag, from_uocks);
}

function prepare_txn1_(pay_to, ext_in, scan_count, min_utxo, max_utxo, sort_flag, from_uocks) {
    if (!WEB_SERVER_ADDR) {
        return null;
    }
    sequence += 1;
    var pay_from = [];
    var pay_from1 = new PayFrom();
    pay_from1.value = 0;
    pay_from1.address = '1118Mi5XxqmqTBp7TnPQd1Hk9XYagJQpDcZu6EiGE1VbXHAw9iZGPV';
    pay_from.push(pay_from1);
    var pay_to = [];
    var pay_to1 = new PayTo()
    pay_to1.value = 100000000;
    pay_to1.address = '1119AwBxBnRX3SdNM67EwPGb9CmSTUcP3qk7hhNVUuSGdXJGLjEnis';
    pay_to.push(pay_to1);

    var makesheet = new MakeSheet();
    makesheet.vcn = 0;
    makesheet.pay_from = pay_from;
    makesheet.pay_to = pay_to;
    makesheet.scan_count = scan_count;
    makesheet.min_utxo = min_utxo;
    makesheet.max_utxo = max_utxo;
    makesheet.sort_flag = sort_flag;
    // makesheet.from_uocks=from_uocks;
    makesheet.last_uocks=[0];
    submit_txn_(makesheet,true);
}

function submit_txn_(msg, submit){
    console.log('>>> msg',msg);
    console.log('--------------------------')
    //转二进制
    // for(var name in msg){
    //     console.log(name,msg[name]);
    // }
    var a=DFtNumberH();
    console.log('a:',a);
}

function DFtNumberH(){
    var buf=new Buffer(12);
    return buf.readInt8(0);
}


module.exports = {
    verify, query_sheet
}