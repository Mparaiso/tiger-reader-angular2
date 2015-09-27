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
System.register(['angular2/angular2', 'angular2/router', './backend', './components'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
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
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var angular2_1, ngRouter, backend, components, ng;
    var SubscribeComponent, DetailView, MasterView, FeedShowView, FeedIndexView, MasterViewByCategory, HomeComponent, RootView;
    return {
        setters:[
            function (angular2_1_1) {
                angular2_1 = angular2_1_1;
                ng = angular2_1_1;
            },
            function (ngRouter_1) {
                ngRouter = ngRouter_1;
            },
            function (backend_1) {
                backend = backend_1;
            },
            function (components_1) {
                components = components_1;
            }],
        execute: function() {
            SubscribeComponent = (function () {
                function SubscribeComponent(feedApi, feedRepository, Feed, routeParams, router) {
                    var _this = this;
                    this.feedApi = feedApi;
                    this.feedRepository = feedRepository;
                    this.Feed = Feed;
                    this.routeParams = routeParams;
                    this.router = router;
                    this.findResultEntries = [];
                    this.query = "";
                    this.allSelected = false;
                    foo;
                    this.feeds = this.feedRepository.feeds;
                    this.query = this.routeParams.get('query');
                    this.feedApi.findQuery(this.query)
                        .then(function (results) {
                        if (results.length > 0) {
                            return Promise.resolve(results);
                        }
                        else {
                            return _this.feedApi.findQuery("site:" + _this.query);
                        }
                    }).then(function (results) { return (_a = _this.findResultEntries).splice.apply(_a, [0, 0].concat(results)); var _a; });
                }
                SubscribeComponent.prototype.onSubmit = function ($event) {
                    var _this = this;
                    Promise.all(this.findResultEntries.filter(function (e) { return e.selected; })
                        .map(function (feed) { return _this.Feed.subscribe(feed); }))
                        .then(function (feeds) {
                        (_a = _this.feedRepository.feeds).push.apply(_a, feeds);
                        var _a;
                    });
                    this.router.navigate('/home/feeds');
                    return false;
                };
                SubscribeComponent.prototype.onSelectAllFieldsChange = function ($event) {
                    if (this.findResultEntries.every(function (entry) { return entry.selected == true; })) {
                        this.findResultEntries.forEach(function (entry) { return entry.selected = false; });
                    }
                    else {
                        this.findResultEntries.forEach(function (entry) { return entry.selected = true; });
                    }
                };
                SubscribeComponent = __decorate([
                    angular2_1.Component({
                        selector: 'subscribe-component'
                    }),
                    angular2_1.View({
                        directives: [angular2_1.CORE_DIRECTIVES, angular2_1.FORM_DIRECTIVES],
                        templateUrl: 'templates/subscribe.tpl.html'
                    }),
                    __param(2, ng.Inject(backend.Feed)), 
                    __metadata('design:paramtypes', [backend.Service, backend.FeedRepository, Object, ngRouter.RouteParams, ngRouter.Router])
                ], SubscribeComponent);
                return SubscribeComponent;
            })();
            DetailView = (function () {
                function DetailView(routeParams, Entry, window) {
                    var _this = this;
                    this.routeParams = routeParams;
                    this.Entry = Entry;
                    this.window = window;
                    var entryId = routeParams.get('entry_id');
                    if (entryId) {
                        this.Entry.findOne(entryId).then(function (e) { _this.entry = e; });
                    }
                }
                DetailView = __decorate([
                    angular2_1.Component({ selector: 'detailview' }),
                    angular2_1.View({
                        directives: [angular2_1.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES, components.Entry],
                        template: '<entry [entry]="entry"></entry>'
                    }),
                    __param(1, ng.Inject(backend.Entry)), 
                    __metadata('design:paramtypes', [ngRouter.RouteParams, Object, Window])
                ], DetailView);
                return DetailView;
            })();
            MasterView = (function () {
                function MasterView() {
                }
                MasterView = __decorate([
                    angular2_1.Component({
                        selector: 'masterview',
                        properties: ['feed', 'entries']
                    }),
                    angular2_1.View({
                        directives: [angular2_1.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES, components.EntryList],
                        templateUrl: 'templates/masterview.tpl.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], MasterView);
                return MasterView;
            })();
            FeedShowView = (function () {
                function FeedShowView(routeParams, Feed) {
                    this.routeParams = routeParams;
                    this.Feed = Feed;
                }
                FeedShowView.prototype.onActivate = function (next, prev) {
                    var _this = this;
                    Promise.resolve(this.routeParams.get('feed_id'))
                        .then(function (feed_id) {
                        return _this.Feed.findOne(feed_id);
                    })
                        .then(function (feed) {
                        if (feed == null) {
                            return Promise.reject(new Error('feed not found'));
                        }
                        _this.feed = feed;
                        return _this.feed.entries.find();
                    }).then(function (entries) {
                        _this.entries = entries;
                    });
                };
                FeedShowView = __decorate([
                    angular2_1.Component({
                        selector: 'feedshow',
                    }),
                    angular2_1.View({
                        directives: [MasterView],
                        template: '<masterview [feed]="feed" [entries]="entries"></masterview>'
                    }),
                    __param(1, ng.Inject(backend.Feed)), 
                    __metadata('design:paramtypes', [ngRouter.RouteParams, Object])
                ], FeedShowView);
                return FeedShowView;
            })();
            FeedIndexView = (function () {
                function FeedIndexView(Entry) {
                    this.Entry = Entry;
                }
                FeedIndexView.prototype.onActivate = function (next, prev) {
                    var _this = this;
                    return this.Entry.findAll().then(function (entries) {
                        _this.entries = entries;
                    });
                };
                FeedIndexView = __decorate([
                    angular2_1.Component({
                        selector: 'feedindex',
                    }),
                    angular2_1.View({
                        directives: [MasterView],
                        template: '<masterview [entries]="entries"></masterview>'
                    }),
                    __param(0, ng.Inject(backend.Entry)), 
                    __metadata('design:paramtypes', [Object])
                ], FeedIndexView);
                return FeedIndexView;
            })();
            MasterViewByCategory = (function (_super) {
                __extends(MasterViewByCategory, _super);
                function MasterViewByCategory() {
                    _super.apply(this, arguments);
                }
                return MasterViewByCategory;
            })(MasterView);
            HomeComponent = (function () {
                function HomeComponent() {
                }
                HomeComponent = __decorate([
                    angular2_1.Component({ selector: 'home-component' }),
                    angular2_1.View({
                        template: "<router-outlet></router-outlet>",
                        directives: [ngRouter.ROUTER_DIRECTIVES]
                    }),
                    ngRouter.RouteConfig([
                        { path: '/', redirectTo: '/feeds' },
                        { path: '/subscribe/:query', component: SubscribeComponent, as: 'subscribe' },
                        { path: '/feeds', component: FeedIndexView, as: 'feeds' },
                        { path: '/by-category/:category', component: MasterViewByCategory, as: 'by-category' },
                        { path: '/feeds/:feed_id', component: FeedShowView, as: 'feeds' },
                        { path: '/entries/:entry_id', component: DetailView, as: 'entries' }
                    ]), 
                    __metadata('design:paramtypes', [])
                ], HomeComponent);
                return HomeComponent;
            })();
            RootView = (function () {
                function RootView(feedApi, router, feedRepository, Feed, Entry) {
                    var _this = this;
                    this.feedApi = feedApi;
                    this.router = router;
                    this.feedRepository = feedRepository;
                    this.Feed = Feed;
                    this.Entry = Entry;
                    this.feeds = [];
                    this.feeds = this.feedRepository.feeds;
                    this.Feed.findAll()
                        .then(function (feeds) {
                        (_a = _this.feedRepository.feeds).push.apply(_a, feeds);
                        var _a;
                    });
                }
                RootView.prototype.onSubscribeClicked = function ($event) {
                    var query = prompt('Enter a url where to look for rss feeds', '');
                    if (query.trim() === "") {
                        return;
                    }
                    this.router.navigate("/home/subscribe/" + query);
                };
                RootView = __decorate([
                    ngRouter.RouteConfig([
                        { path: '/', redirectTo: '/home/' },
                        { path: '/home/...', component: HomeComponent, as: 'home' }
                    ]),
                    angular2_1.Component({
                        selector: 'root',
                    }),
                    angular2_1.View({
                        directives: [ngRouter.ROUTER_DIRECTIVES, angular2_1.CORE_DIRECTIVES, components.FeedList, components.MainMenu],
                        templateUrl: 'templates/root.tpl.html'
                    }),
                    __param(3, ng.Inject(backend.Feed)),
                    __param(4, ng.Inject(backend.Entry)), 
                    __metadata('design:paramtypes', [backend.Service, ngRouter.Router, backend.FeedRepository, Object, Object])
                ], RootView);
                return RootView;
            })();
            angular2_1.bootstrap(RootView, [
                backend.FeedRepository,
                backend.Service,
                angular2_1.bind(backend.Feed).toValue(backend.Feed),
                angular2_1.bind(backend.Entry).toValue(backend.Entry),
                angular2_1.bind(Window).toValue(window),
                ngRouter.ROUTER_BINDINGS,
                angular2_1.bind(ngRouter.LocationStrategy).toClass(ngRouter.HashLocationStrategy)
            ]).then(function (_) { return console.log('tiger reader is live!'); })
                .catch(console.log.bind(console));
        }
    }
});
//# sourceMappingURL=main.js.map