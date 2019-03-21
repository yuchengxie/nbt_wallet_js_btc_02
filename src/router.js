const R = {
    Home: 'home',
    Wallet: 'wallet',
    Block: 'block',
    Info:'info',
}

var navhome = document.getElementById('nav_home');
var navwallet = document.getElementById('nav_wallet');
var navblock = document.getElementById('nav_block');
var navinfo = document.getElementById('nav_info');

function tab(e) {
    var url=e.getAttribute('id').split('_')[1];
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
    console.log('url:',url);
    for (var i = 0; i < eles.length; i++) {
        var e = eles[i];
        if (url != e.getAttribute('id')) {
            e.classList.remove('active');
        } else {
            e.classList.add('active');
        }
    }
}