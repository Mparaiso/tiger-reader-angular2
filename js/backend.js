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
System.register(['angular2/angular2', 'parse'], function(exports_1) {
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
    var ng, Parse;
    var Service, FeedRepository, Entry, Feed, API_BINDINGS;
    return {
        setters:[
            function (ng_1) {
                ng = ng_1;
            },
            function (Parse_1) {
                Parse = Parse_1;
            }],
        execute: function() {
            Parse.initialize("IDeoQisjtABLNVellf2KRiSegrUq3QHr34Thk9lk", "UuNlwKveKs4A410SyA1b9sjZZhE4Z8NZEqYBULnt");
            Service = (function () {
                function Service(window) {
                    this.window = window;
                }
                Object.defineProperty(Service.prototype, "feeds", {
                    get: function () {
                        return this.window['google'].feeds;
                    },
                    enumerable: true,
                    configurable: true
                });
                Service.prototype.findQuery = function (query) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        _this.feeds.findFeeds(query, function (result) {
                            if (result.error) {
                                return reject(result.error);
                            }
                            resolve(result.entries);
                        });
                    });
                };
                Service.prototype.loadFeed = function (url) {
                    var _this = this;
                    return new Promise(function (resolve, reject) {
                        var feed = new _this.feeds.Feed(url);
                        feed.setNumEntries(30);
                        feed.includeHistoricalEntries();
                        feed.load(function (result) {
                            if (result.error) {
                                return reject(result.error);
                            }
                            resolve(result.feed);
                        });
                    });
                };
                Service = __decorate([
                    ng.Injectable(), 
                    __metadata('design:paramtypes', [Window])
                ], Service);
                return Service;
            })();
            exports_1("Service", Service);
            FeedRepository = (function () {
                function FeedRepository() {
                    this.feeds = [];
                }
                FeedRepository = __decorate([
                    ng.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], FeedRepository);
                return FeedRepository;
            })();
            exports_1("FeedRepository", FeedRepository);
            Entry = (function (_super) {
                __extends(Entry, _super);
                function Entry() {
                    _super.call(this, 'Entry');
                }
                Object.defineProperty(Entry.prototype, "feed", {
                    get: function () { return this.get("feed"); },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Entry.prototype, "mediaGroup", {
                    get: function () { return this.get("mediaGroup"); },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Entry.prototype, "title", {
                    get: function () { return this.get("title"); },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Entry.prototype, "link", {
                    get: function () { return this.get("link"); },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Entry.prototype, "content", {
                    get: function () { return this.get("content"); },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Entry.prototype, "contentSnippet", {
                    get: function () { return this.get("contentSnippet"); },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Entry.prototype, "publishedDate", {
                    get: function () { return this.get("publishedDate"); },
                    enumerable: true,
                    configurable: true
                });
                ;
                Object.defineProperty(Entry.prototype, "categories", {
                    get: function () { return this.get("categories"); },
                    enumerable: true,
                    configurable: true
                });
                ;
                Entry.findAll = function () {
                    var query = new Parse.Query(Entry);
                    return query.find();
                };
                Entry.findOne = function (id) {
                    var query = new Parse.Query(Entry);
                    return query.get(id);
                };
                Entry.findByFeed = function (feed) {
                    var relation = feed.relation('entries');
                    return relation.query().find();
                };
                Entry = __decorate([
                    ng.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], Entry);
                return Entry;
            })(Parse.Object);
            exports_1("Entry", Entry);
            Parse.Object['registerSubclass']('Entry', Entry);
            Feed = (function (_super) {
                __extends(Feed, _super);
                function Feed() {
                    _super.call(this, 'Feed');
                }
                Object.defineProperty(Feed.prototype, "feedUrl", {
                    get: function () { return this.get('feedUrl'); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Feed.prototype, "title", {
                    get: function () { return this.get('title'); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Feed.prototype, "link", {
                    get: function () { return this.get('link'); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Feed.prototype, "description", {
                    get: function () { return this.get('description'); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Feed.prototype, "author", {
                    get: function () { return this.get('author'); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Feed.prototype, "entries", {
                    get: function () {
                        return this.relation('entries').query();
                    },
                    enumerable: true,
                    configurable: true
                });
                Feed.findAll = function () {
                    var query = new Parse.Query(Feed);
                    return query.find();
                };
                Feed.findOne = function (id) {
                    var query = new Parse.Query(Feed);
                    return query.get(id);
                };
                Feed.subscribe = function (findResultEntry) {
                    var feed, entries, service = new Service(window);
                    return service.loadFeed(findResultEntry.url)
                        .then(function (f) {
                        feed = new Feed;
                        entries = f.entries;
                        f.entries = undefined;
                        return feed.save(f);
                    }).then(function (f) {
                        feed = f;
                        return Promise.all(entries.map(function (e) {
                            var entry = new Entry;
                            entry.set('feed', feed);
                            return entry.save(e);
                        }));
                    }).then(function (entries) {
                        console.log(entries);
                        var relation = feed.relation('entries');
                        entries.forEach(function (entry) { return relation.add(entry); });
                        return feed.save();
                    });
                };
                Feed = __decorate([
                    ng.Injectable(), 
                    __metadata('design:paramtypes', [])
                ], Feed);
                return Feed;
            })(Parse.Object);
            exports_1("Feed", Feed);
            Parse.Object['registerSubclass']('Feed', Feed);
            exports_1("API_BINDINGS", API_BINDINGS = [Entry, Feed, Service]);
        }
    }
});
//# sourceMappingURL=backend.js.map