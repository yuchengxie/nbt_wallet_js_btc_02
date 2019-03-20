const ipcRenderer = require('electron').ipcRenderer;

const E = {
    frame_wallet: 'frame_wallet',
    btn_wallet_create: 'btn_wallet_create',
    frame_block: 'frame_block',
    btn_block: 'btn_block',
}

window.onload = function () {
    /**
     * wallet
     */
    var frm = document.getElementById(E.frame_wallet);
    var btn_wallet_create = frm.contentWindow.document.getElementById(E.btn_wallet_create);

    btn_wallet_create.onclick = function () {
        ipcRenderer.send('create', '18800000000123456');
    }

    /**
     * block
     */
    var btn_block = document.getElementById(E.frame_block).contentWindow
        .document.getElementById(E.btn_block);

    btn_block.onclick = function () {
        ipcRenderer.send('test', 'hahha 1111 db');
    }
}