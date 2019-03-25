const ipcRenderer = require('electron').ipcRenderer;

window.onload = function () {
    //wallet_create
    var btn_wallet_create=getElement('frame_wallet_create','btn_wallet_create');
    var phone=getElement('frame_wallet_create','phone');
    var pwd=getElement('frame_wallet_create','pwd');
    var addr=getElement('frame_wallet_create','addr');
    btn_wallet_create.onclick = function () {
        var v=phone.value+pwd.value;
        console.log('phone v:',v,v.length);
        ipcRenderer.send('create', v);
    }

    ipcRenderer.on('replycreate',function(event,data){
        if (data){
            console.log('replycreate:',data,data.length);
            addr.innerText=data;
        }
    })

    //wallet_import
    var btn_wallet_import=getElement('frame_wallet_import','btn_wallet_import');
    btn_wallet_import.onclick = function () {
        ipcRenderer.send('save', '4dabbaf739e4dfec415fea38f1efdbb67a0786746db3d1063b2339a44fb13458');
    }

    //wallet_info
    var btn_wallet_info=getElement('frame_wallet_info','btn_wallet_info');
    btn_wallet_info.onclick = function () {
        ipcRenderer.send('info', 'this is info');
    }

    var info_list=getElement('frame_wallet_info','info_list');
    var link_no=getElement('frame_wallet_info','link_no');
    var timestamp=getElement('frame_wallet_info','timestamp');
    var account=getElement('frame_wallet_info','account');
    var search=getElement('frame_wallet_info','search');
    var found_uock=getElement('frame_wallet_info','found_uock');
    var found_value=getElement('frame_wallet_info','found_value');
    var found_height=getElement('frame_wallet_info','found_height');
    ipcRenderer.on('replyinfo',function(event,data){
        if (data){
            console.log('replyinfo:',data,data.length);
            info_list.style.display='block';
            link_no.innerText='link_no:'+data.link_no;
            timestamp.innerText='timestamp:'+data.timestamp;
            account.innerText='account:'+data.account;
            search.innerText='search:'+data.search;
            found_uock.innerText='found_uock:'+data.found.uock;
            found_value.innerText='found_value:'+data.found.value;
            found_height.innerText='found_height:'+data.found.height;
        }
    })

    //block
    var btn_block=getElement('frame_block','btn_block');
    btn_block.onclick = function () {
        ipcRenderer.send('test', '区块查询');
    }
}


function getElement(frameId,eleId) {
    var ele=document.getElementById(frameId).contentWindow.document.getElementById(eleId);
    return ele;
}