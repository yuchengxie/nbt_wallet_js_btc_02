const R = {
    Home: 'home',
    Wallet_Create: 'wallet_create',
    Wallet_Import: 'wallet_import',
    Wallet_Info: 'wallet_info',
    Block: 'block',
}

var navhome = document.getElementById('nav_home');
// var navwallet = document.getElementById('nav_wallet');
var navwallet = document.getElementById('nav_wallet_create');
var navwallet = document.getElementById('nav_wallet_import');
var navwallet = document.getElementById('nav_wallet_info');
var navblock = document.getElementById('nav_block');
// var navinfo = document.getElementById('nav_info');

function tab(e) {
    var p=e.getAttribute('id').split('_');
    var url='';
    if(p.length==2){
        url=p[1];
    }else if(p.length==3){
        url=p[1]+'_'+p[2];
    }else{
        throw Error('url error');
    }
    sessionStorage.setItem('currentUrl',url);
    display(url);
}

window.addEventListener('load', function () {
    
    display(sessionStorage.getItem('currentUrl')||R.Block);
})

function display(url) {
    var eles = document.getElementById('content').children;
    for (var i = 0; i < eles.length; i++) {
        var e = eles[i];
        
        if (url != e.getAttribute('id')) {
            e.classList.remove('active');
        } else {
            e.classList.add('active');
        }
    }
}