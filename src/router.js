const R = {
    Home: 'home',
    // Wallet: 'wallet',
    Wallet_Create: 'wallet_create',
    Wallet_Import: 'wallet_import',
    Wallet_Info: 'wallet_info',
    Block: 'block',
    Info:'info',
}

// <a class="dropdown-item" id='nav_wallet_create' onclick="tab(this)">创建钱包</a>
// 						<a class="dropdown-item" id='nav_wallet_import' onclick="tab(this)">导入钱包</a>
// 						<div class="dropdown-divider"></div>
// 						<a class="dropdown-item" id='nav_wallet_info' onclick="tab(this)">查看钱包</a>

var navhome = document.getElementById('nav_home');
// var navwallet = document.getElementById('nav_wallet');
var navwallet = document.getElementById('nav_wallet_create');
var navwallet = document.getElementById('nav_wallet_import');
var navwallet = document.getElementById('nav_wallet_info');
var navblock = document.getElementById('nav_block');
// var navinfo = document.getElementById('nav_info');

function tab(e) {
    var p=e.getAttribute('id').split('_');
    console.log('p:',p,p.length);
    var url='';
    if(p.length==2){
        url=p[1];
    }else if(p.length==3){
        url=p[1]+'_'+p[2];
    }else{
        throw Error('url error');
    }
    console.log('tab url:',url);
    sessionStorage.setItem('currentUrl',url);
    console.log('保存currentUrl:',sessionStorage.getItem('currentUrl'));
    display(url);
}

window.addEventListener('load', function () {
    console.log('reload');
    console.log('currentUrl:',sessionStorage.getItem('currentUrl'));
    
    display(sessionStorage.getItem('currentUrl')||'info');
})

function display(url) {
    var eles = document.getElementById('content').children;
    // console.log('eles:',eles);
    console.log('display url:',url);
    for (var i = 0; i < eles.length; i++) {
        var e = eles[i];
        
        if (url != e.getAttribute('id')) {
            e.classList.remove('active');
        } else {
            console.log('当前点击了:',e);
            e.classList.add('active');
        }
    }
}