const ipcRenderer = require('electron').ipcRenderer;

const E = {
    frame_wallet: 'frame_wallet',
    btn_wallet_create: 'btn_wallet_create',
    btn_wallet_save: 'btn_wallet_save',

    frame_block: 'frame_block',
    btn_block: 'btn_block',

    frame_info: 'frame_info',
    btn_info: 'btn_info',
}

window.onload = function () {
    /**
     * wallet
     */
    var frmWallet = document.getElementById(E.frame_wallet);
    var btn_wallet_create = frmWallet.contentWindow.document.getElementById(E.btn_wallet_create);
    var btn_wallet_save = frmWallet.contentWindow.document.getElementById(E.btn_wallet_save);

    btn_wallet_create.onclick = function () {
        ipcRenderer.send('create', '18800000000123456');
    }

    btn_wallet_save.onclick = function () {
        // ipcRenderer.send('save',address);
        ipcRenderer.send('save', '4dabbaf739e4dfec415fea38f1efdbb67a0786746db3d1063b2339a44fb13458');
    }

    /**
     * block
     */
    var btn_block = document.getElementById(E.frame_block).contentWindow
        .document.getElementById(E.btn_block);

    btn_block.onclick = function () {
        ipcRenderer.send('test', 'hahha 1111 db');
    }

    /**
     * info
     */
    var btn_info = document.getElementById(E.frame_info).contentWindow
        .document.getElementById(E.btn_info);
        btn_info.onclick = function () {
            
        ipcRenderer.send('info', 'this is info');
    }
}