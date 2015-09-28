/// <reference path="../typings/tsd.d.ts" />
System.register(['angular2/angular2', 'angular2/router', './backend'], function(exports_1) {
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
    var ng, ngRouter, backend;
    var Entry, EntryList, FeedList, MainMenu, SubscribeComponent, DetailView, MasterView, FeedShowView, FeedIndexView, MasterViewByCategory, HomeComponent, RootView;
    return {
        setters:[
            function (ng_1) {
                ng = ng_1;
            },
            function (ngRouter_1) {
                ngRouter = ngRouter_1;
            },
            function (backend_1) {
                backend = backend_1;
            }],
        execute: function() {
            Entry = (function () {
                function Entry(window) {
                    this.window = window;
                }
                Entry.prototype.onContentClicked = function ($event) {
                    var target;
                    $event.stopPropagation();
                    $event.preventDefault();
                    if ((target = $event.target)['tagName'] === 'A') {
                        this.window.open(target.href);
                    }
                    return false;
                };
                Entry = __decorate([
                    ng.Component({ selector: 'entry', properties: ['entry'] }),
                    ng.View({
                        templateUrl: 'templates/entry.tpl.html',
                        directives: [ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [Window])
                ], Entry);
                return Entry;
            })();
            exports_1("Entry", Entry);
            EntryList = (function () {
                function EntryList() {
                }
                EntryList = __decorate([
                    ng.Component({ selector: 'entrylist', properties: ['entries'] }),
                    ng.View({ templateUrl: 'templates/entrylist.tpl.html',
                        directives: [ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [])
                ], EntryList);
                return EntryList;
            })();
            exports_1("EntryList", EntryList);
            FeedList = (function () {
                function FeedList(feedRepository, Feed, Entry) {
                    this.feedRepository = feedRepository;
                    this.Feed = Feed;
                    this.Entry = Entry;
                }
                FeedList.prototype.getFaviconUrl = function (domain) {
                    if (domain.trim() === "") {
                        return "https://www.google.com/s2/favicons?domain=http://nodomain";
                    }
                    return "https://www.google.com/s2/favicons?domain=" + domain;
                };
                FeedList.prototype.onRemoveFeedClicked = function (feed) {
                    var _this = this;
                    Promise.resolve(feed.relation('entries').query().select('id').find())
                        .then(function (entries) {
                        Promise.all(entries.map(function (e) { return e.destroy(); }));
                    })
                        .then(function () { return feed.destroy(); })
                        .then(function () {
                        _this.feedRepository.feeds.splice(_this.feedRepository.feeds.indexOf(feed), 1);
                    });
                    return false;
                };
                FeedList = __decorate([
                    ng.Component({ selector: 'feedlist', properties: ['feeds'] }),
                    ng.View({
                        templateUrl: 'templates/feedlist.tpl.html',
                        directives: [ngRouter.ROUTER_DIRECTIVES, ng.CORE_DIRECTIVES]
                    }),
                    __param(1, ng.Inject(backend.Feed)),
                    __param(2, ng.Inject(backend.Entry)), 
                    __metadata('design:paramtypes', [backend.FeedRepository, Object, Object])
                ], FeedList);
                return FeedList;
            })();
            exports_1("FeedList", FeedList);
            MainMenu = (function () {
                function MainMenu() {
                }
                MainMenu = __decorate([
                    ng.Component({
                        selector: 'mainmenu'
                    }),
                    ng.View({
                        templateUrl: 'templates/mainmenu.tpl.html',
                        directives: [ngRouter.ROUTER_DIRECTIVES, ng.CORE_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [])
                ], MainMenu);
                return MainMenu;
            })();
            exports_1("MainMenu", MainMenu);
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
                    ng.Component({
                        selector: 'subscribe-component'
                    }),
                    ng.View({
                        directives: [ng.CORE_DIRECTIVES, ng.EventEmitter],
                        templateUrl: 'templates/subscribe.tpl.html'
                    }),
                    __param(2, ng.Inject(backend.Feed)), 
                    __metadata('design:paramtypes', [backend.Service, backend.FeedRepository, Object, ngRouter.RouteParams, ngRouter.Router])
                ], SubscribeComponent);
                return SubscribeComponent;
            })();
            exports_1("SubscribeComponent", SubscribeComponent);
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
                    ng.Component({ selector: 'detailview' }),
                    ng.View({
                        directives: [ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES, Entry],
                        template: '<entry [entry]="entry"></entry>'
                    }),
                    __param(1, ng.Inject(backend.Entry)), 
                    __metadata('design:paramtypes', [ngRouter.RouteParams, Object, Window])
                ], DetailView);
                return DetailView;
            })();
            exports_1("DetailView", DetailView);
            MasterView = (function () {
                function MasterView() {
                }
                MasterView = __decorate([
                    ng.Component({
                        selector: 'masterview',
                        properties: ['feed', 'entries']
                    }),
                    ng.View({
                        directives: [ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES, EntryList],
                        templateUrl: 'templates/masterview.tpl.html'
                    }), 
                    __metadata('design:paramtypes', [])
                ], MasterView);
                return MasterView;
            })();
            exports_1("MasterView", MasterView);
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
                    ng.Component({
                        selector: 'feedshow',
                    }),
                    ng.View({
                        directives: [MasterView],
                        template: '<masterview [feed]="feed" [entries]="entries"></masterview>'
                    }),
                    __param(1, ng.Inject(backend.Feed)), 
                    __metadata('design:paramtypes', [ngRouter.RouteParams, Object])
                ], FeedShowView);
                return FeedShowView;
            })();
            exports_1("FeedShowView", FeedShowView);
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
                    ng.Component({
                        selector: 'feedindex',
                    }),
                    ng.View({
                        directives: [MasterView],
                        template: '<masterview [entries]="entries"></masterview>'
                    }),
                    __param(0, ng.Inject(backend.Entry)), 
                    __metadata('design:paramtypes', [Object])
                ], FeedIndexView);
                return FeedIndexView;
            })();
            exports_1("FeedIndexView", FeedIndexView);
            MasterViewByCategory = (function (_super) {
                __extends(MasterViewByCategory, _super);
                function MasterViewByCategory() {
                    _super.apply(this, arguments);
                }
                return MasterViewByCategory;
            })(MasterView);
            exports_1("MasterViewByCategory", MasterViewByCategory);
            HomeComponent = (function () {
                function HomeComponent() {
                }
                HomeComponent = __decorate([
                    ng.Component({ selector: 'home-component' }),
                    ng.View({
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
            exports_1("HomeComponent", HomeComponent);
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
                    ng.Component({
                        selector: 'root',
                    }),
                    ng.View({
                        directives: [ngRouter.ROUTER_DIRECTIVES, ng.CORE_DIRECTIVES, FeedList, MainMenu],
                        templateUrl: 'templates/root.tpl.html'
                    }),
                    __param(3, ng.Inject(backend.Feed)),
                    __param(4, ng.Inject(backend.Entry)), 
                    __metadata('design:paramtypes', [backend.Service, ngRouter.Router, backend.FeedRepository, Object, Object])
                ], RootView);
                return RootView;
            })();
            exports_1("RootView", RootView);
        }
    }
});
//# sourceMappingURL=components.js.map