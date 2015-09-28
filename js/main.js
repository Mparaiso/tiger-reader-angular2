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
System.register(['angular2/router', './backend', './components', 'angular2/angular2'], function(exports_1) {
    var ngRouter, backend, components, ng;
    return {
        setters:[
            function (ngRouter_1) {
                ngRouter = ngRouter_1;
            },
            function (backend_1) {
                backend = backend_1;
            },
            function (components_1) {
                components = components_1;
            },
            function (ng_1) {
                ng = ng_1;
            }],
        execute: function() {
            ng.bootstrap(components.RootView, [
                backend.FeedRepository,
                backend.Service,
                ng.bind(backend.Feed).toValue(backend.Feed),
                ng.bind(backend.Entry).toValue(backend.Entry),
                ng.bind(Window).toValue(window),
                ngRouter.ROUTER_BINDINGS,
                ng.bind(ngRouter.LocationStrategy).toClass(ngRouter.HashLocationStrategy)
            ]).then(function (_) { return console.log('tiger reader is live!'); })
                .catch(console.log.bind(console));
        }
    }
});
//# sourceMappingURL=main.js.map