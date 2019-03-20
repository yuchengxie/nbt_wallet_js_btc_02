function Router() {
    this.routes = {};
    this.currentURL = '';
}

const RouterPath = {
    Home: 'home',
    Wallet: 'wallet',
    Block: 'block'
}

Router.prototype.route = function (path, callback) {
    this.routes[path] = callback || function () { };
}

Router.prototype.refresh = function () {
    this.currentURL = location.hash.slice(1) || '/home';
    this.routes[this.currentURL]();
}

Router.prototype.init = function () {
    window.addEventListener('load', this.refresh.bind(this), false);
    window.addEventListener('hashchange', this.refresh.bind(this), false);
}

function display_page(url) {
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

window.Router = new Router();

Router.route('/' + RouterPath.Home, function () {
    display_page(RouterPath.Home);
})

Router.route('/' + RouterPath.Wallet, function () {
    display_page(RouterPath.Wallet);
})

Router.route('/' + RouterPath.Block, function () {
    display_page(RouterPath.Block);
})

window.Router.init();