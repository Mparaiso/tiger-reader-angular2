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


import * as ngRouter from 'angular2/router';
import * as backend from './backend';
import * as components from './components';
import * as ng from 'angular2/angular2';
import * as rx from 'rx';


ng.bootstrap(components.RootView, [
	backend.FeedRepository,
	backend.Service,
	ng.bind(backend.Feed).toValue(backend.Feed),
	ng.bind(backend.Entry).toValue(backend.Entry),
	ng.bind(Window).toValue(window),
	ngRouter.ROUTER_BINDINGS,
	ng.bind(ngRouter.LocationStrategy).toClass(ngRouter.HashLocationStrategy)
]).then(_=> console.log('tiger reader is live!'))
	.catch(console.log.bind(console))
