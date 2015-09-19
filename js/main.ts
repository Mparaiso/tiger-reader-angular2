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

/// <reference path="../typings/tsd.d.ts"/>

import {
Component, View, bootstrap, Inject,
NgForm, FORM_DIRECTIVES, CORE_DIRECTIVES,
FormBuilder, ControlGroup, Control, NgControl,
EventEmitter, Pipe, Observable, bind
} from 'angular2/angular2';

import {Http, Headers, HTTP_BINDINGS} from 'angular2/http';
import {
RouteConfig, Router,
ROUTER_BINDINGS, ROUTER_DIRECTIVES,
ROUTER_BINDINGS, APP_BASE_HREF, LocationStrategy, HashLocationStrategy
} from 'angular2/router';


import {OrderByPipe} from './pipes';

@Component({ selector: 'main-menu' })
@View({
    directives: [ROUTER_DIRECTIVES],
    template: `
    <!--Menu-->
    <ul>
        <li><a [router-link]="['/home']">Home</a></li>
        <li><a [router-link]="['/login']">Login</a></li>
        <li><a [router-link]="['/signup']">Signup</a></li>
    </ul>
    `
})
class MainMenu { }

@Component({ selector: 'home' })
@View({
    directives: [MainMenu],
    template: `<h1>Home</h1><main-menu/>`

})
class Home { }

@Component({ selector: 'login' })
@View({
    directives: [MainMenu],
    template: `<h1>Login</h1><main-menu></main-menu>`

})
class Login { }

@Component({ selector: 'signup' })
@View({

    directives: [MainMenu],
    template: `<h1>Signup</h1><main-menu></main-menu>`

})
class Signup { }

// Needed for the router to work instead of putting a BASE tag in index.html
// Not needed with HashLocationStrategy
//let HREF_BINDINGS = bind(APP_BASE_HREF).toValue(window.location.origin + window.location.pathname)

let HASH_LOC_BINDINGS = bind(LocationStrategy).toClass(HashLocationStrategy)
@Component({
    selector: 'root'
    bindings: [ROUTER_BINDINGS,/* HREF_BINDINGS, */ HASH_LOC_BINDINGS]
})
@View({
    directives: [ROUTER_DIRECTIVES],
    template: `
            <!-- router -->
            <router-outlet></router-outlet>
    `
})
@RouteConfig([
    { path: '/', redirectTo: '/home' },
    { path: '/home', as: 'home', component: Home },
    { path: '/login', as: 'login', component: Login },
    { path: '/signup', as: 'signup', component: Signup }
])
class Root {
    constructor(private router: Router) {
    }
}



bootstrap(Root)