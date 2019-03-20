const R = {
    Home: 'home',
    Wallet: 'wallet',
    Block: 'block'
}

var navhome = document.getElementById('nav_home');
var navwallet = document.getElementById('nav_wallet');
var navblock = document.getElementById('nav_block');
console.log('nav:', navhome);

function tab(e) {
    var url=e.getAttribute('id').split('_')[1];
    sessionStorage.setItem('currentUrl',url);
    console.log('保存currentUrl:',sessionStorage.getItem('currentUrl'));
    display(url);
}

window.addEventListener('load', function () {
    console.log('reload');
    console.log('currentUrl:',sessionStorage.getItem('currentUrl'));
    
    display(sessionStorage.getItem('currentUrl')||'home');
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