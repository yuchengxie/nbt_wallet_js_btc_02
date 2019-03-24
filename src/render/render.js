const ipcRenderer = require('electron').ipcRenderer;

const E = {
    frame_wallet_create: 'frame_wallet_create',
    btn_wallet_create: 'btn_wallet_create',

    frame_wallet_import: 'frame_wallet_import',
    btn_wallet_import: 'btn_wallet_import',

    frame_wallet_info: 'frame_wallet_info',
    btn_wallet_info: 'btn_wallet_info',


    frame_block: 'frame_block',
    btn_block: 'btn_block',
}

window.onload = function () {
    //wallet_create
    var frmWalletCreate = document.getElementById(E.frame_wallet_create);
    var btn_wallet_create = frmWalletCreate.contentWindow.document.getElementById(E.btn_wallet_create);
    btn_wallet_create.onclick = function () {
        ipcRenderer.send('create', '18800000000123456');
    }
    //wallet_import
    var frmWalletImport = document.getElementById(E.frame_wallet_import);
    var btn_wallet_import = frmWalletImport.contentWindow.document.getElementById(E.btn_wallet_import);

    btn_wallet_import.onclick = function () {
        ipcRenderer.send('save', '4dabbaf739e4dfec415fea38f1efdbb67a0786746db3d1063b2339a44fb13458');
    }

    //wallet_info
    var frmWalletInfo = document.getElementById(E.frame_wallet_info);
    var btn_wallet_info = frmWalletInfo.contentWindow.document.getElementById(E.btn_wallet_info);
    btn_wallet_info.onclick = function () {
        ipcRenderer.send('info', 'this is info');
    }

    //block
    var btn_block = document.getElementById(E.frame_block).contentWindow
        .document.getElementById(E.btn_block);

    btn_block.onclick = function () {
        ipcRenderer.send('test', '区块查询');
    }
}
