// tiger-reader is an opensource rss reader 
// Copyright (C) 2015 mparaiso <mparaiso@online.fr>
//
// tiger-reader program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// tiger-reader program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with tiger-reader program.  If not, see <http://www.gnu.org/licenses/>.
System.register(['angular2/angular2', 'angular2/router'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
            case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
            case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
            case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
        }
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var angular2_1, router_1;
    var MainMenu, Home, Login, Signup, HASH_LOC_BINDINGS, Root;
    return {
        setters:[
            function (angular2_1_1) {
                angular2_1 = angular2_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            MainMenu = (function () {
                function MainMenu() {
                }
                MainMenu = __decorate([
                    angular2_1.Component({ selector: 'main-menu' }),
                    angular2_1.View({
                        directives: [router_1.ROUTER_DIRECTIVES],
                        template: "\n    <!--Menu-->\n    <ul>\n        <li><a [router-link]=\"['/home']\">Home</a></li>\n        <li><a [router-link]=\"['/login']\">Login</a></li>\n        <li><a [router-link]=\"['/signup']\">Signup</a></li>\n    </ul>\n    "
                    }), 
                    __metadata('design:paramtypes', [])
                ], MainMenu);
                return MainMenu;
            })();
            Home = (function () {
                function Home() {
                }
                Home = __decorate([
                    angular2_1.Component({ selector: 'home' }),
                    angular2_1.View({
                        directives: [MainMenu],
                        template: "<h1>Home</h1><main-menu/>"
                    }), 
                    __metadata('design:paramtypes', [])
                ], Home);
                return Home;
            })();
            Login = (function () {
                function Login() {
                }
                Login = __decorate([
                    angular2_1.Component({ selector: 'login' }),
                    angular2_1.View({
                        directives: [MainMenu],
                        template: "<h1>Login</h1><main-menu></main-menu>"
                    }), 
                    __metadata('design:paramtypes', [])
                ], Login);
                return Login;
            })();
            Signup = (function () {
                function Signup() {
                }
                Signup = __decorate([
                    angular2_1.Component({ selector: 'signup' }),
                    angular2_1.View({
                        directives: [MainMenu],
                        template: "<h1>Signup</h1><main-menu></main-menu>"
                    }), 
                    __metadata('design:paramtypes', [])
                ], Signup);
                return Signup;
            })();
            // Needed for the router to work instead of putting a BASE tag in index.html
            // Not needed with HashLocationStrategy
            //let HREF_BINDINGS = bind(APP_BASE_HREF).toValue(window.location.origin + window.location.pathname)
            HASH_LOC_BINDINGS = angular2_1.bind(router_1.LocationStrategy).toClass(router_1.HashLocationStrategy);
            Root = (function () {
                function Root(router) {
                    this.router = router;
                }
                Root = __decorate([
                    angular2_1.Component({
                        selector: 'root',
                        bindings: [router_1.ROUTER_BINDINGS, HASH_LOC_BINDINGS]
                    }),
                    angular2_1.View({
                        directives: [router_1.ROUTER_DIRECTIVES],
                        template: "\n            <!-- router -->\n            <router-outlet></router-outlet>\n    "
                    }),
                    router_1.RouteConfig([
                        { path: '/', redirectTo: '/home' },
                        { path: '/home', as: 'home', component: Home },
                        { path: '/login', as: 'login', component: Login },
                        { path: '/signup', as: 'signup', component: Signup }
                    ]), 
                    __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object])
                ], Root);
                return Root;
                var _a;
            })();
            angular2_1.bootstrap(Root);
        }
    }
});
//# sourceMappingURL=main.js.map