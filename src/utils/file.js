const fs = require('fs');
const path = require('path');
const fu = require('./fileutils');
const secret = require('./secret')

let default_fp = path.join(__dirname, '../../data/');
let fp = path.join(__dirname, '../../data/account/');
let filename = 'addr1.cfg';
// const readFile = require('util').promisify(fs.readFile);

fu.mkdirs(fp, function () {
    console.log('文件目录创建ok');
})

/**
 * @param {数据:phone+code} data 
 */
function create(data) {
    let res = secret.createWallet(data);
    var jsonData = {
        'encrypted': true,
        "type": "default",
        "vcn": 0,
        "coin_type": "00",
        "testnet": false,
        "prvkey": res.encrypt_prvKey,
        "pubkey": null
    }
    var data = JSON.stringify(jsonData);
    // fu.mkdirs(fp, function () {
    //     saveToFile(data, filename)
    // })
    return res.addr;
}

/**
 * @param {私钥} pvk 
 */
function save(pvk) {
    let aes_prvKey = secret.saveWallet(pvk)
    var jsonData = {
        'encrypted': true,
        "type": "default",
        "vcn": 0,
        "coin_type": "00",
        "testnet": false,
        "prvkey": aes_prvKey,
        "pubkey": null
    }
    var data = JSON.stringify(jsonData);
    fu.mkdirs(fp, function () {
        saveToFile(data, filename)
    })
}

/**
 * 
 * @param {需要保存的数据} data 
 * @param {保存的文件名} filename 
 */
function saveToFile(data, filename) {
    fs.writeFile(fp + filename, data, (err) => {
        if (err) {
            throw Error('err write');
        }
    })
    fs.writeFile(default_fp + 'default.cfg', data, (err) => {
        if (err) {
            throw Error('err write');
        }
    })
}

function readAccount(account, password) {
    let sPath = ''
    if (!account) {
        sPath = default_fp;
    } else {
        sPath = fp + account + '.cfg';
    }
    var addr =loadFromFile(sPath, password);
    console.log('> addr:', addr);
    return addr;
}

function loadFromFile(filename, passphrase) {
    let addr = '';
    try {
        const data = fs.readFileSync(filename, "utf-8");
        let datajson = JSON.parse(data);
        let tp = datajson["type"];
        if (tp === 'HD') {

        } else if (tp === 'default') {
            addr = secret.genAddrFromCfg(datajson, passphrase);
            return addr;
        }
    } catch (err) {
        console.log(err);
    }
    return addr;
}


module.exports.readAccount = readAccount;
module.exports.loadFromFile = loadFromFile;
module.exports.saveToFile = saveToFile;
module.exports.create = create;
module.exports.save = save;
