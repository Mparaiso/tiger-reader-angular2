/// <reference path="../typings/tsd.d.ts" />
System.register(['angular2/angular2', 'angular2/router', './backend'], function(exports_1) {
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
    var Entry, EntryList, FeedList, MainMenu;
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
                        .then(function () { return feed.destroy; })
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
        }
    }
});
//# sourceMappingURL=components.js.map