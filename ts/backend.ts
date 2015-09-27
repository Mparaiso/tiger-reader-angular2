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

import * as ng from 'angular2/angular2';
import * as Parse from 'parse';
import * as rx from 'rx';




Parse.initialize("IDeoQisjtABLNVellf2KRiSegrUq3QHr34Thk9lk", "UuNlwKveKs4A410SyA1b9sjZZhE4Z8NZEqYBULnt");



@ng.Injectable()
export class Service {

    constructor(private window: Window) { }

    get feeds() {
        return this.window['google'].feeds;
    }
    /**
     * Search for a feed
     */
    findQuery(query: string) {
        return new Promise((resolve, reject) => {
            this.feeds.findFeeds(query, result => {
                if (result.error) {
                    return reject(result.error);
                }
                resolve(result.entries);
            });
        })
    }
    /**
     * load a feed by url
     */
    loadFeed(url: string) {
        return new Promise((resolve, reject) => {
            var feed = new this.feeds.Feed(url);
            feed.setNumEntries(30)
            feed.includeHistoricalEntries();
            feed.load((result) => {
                if (result.error) {
                    return reject(result.error)
                }
                resolve(result.feed)
            });
        });
    }

}

@ng.Injectable()
export class FeedRepository {
    feeds=[];
}

@ng.Injectable()
export class Entry extends Parse.Object {

    get feed() { return this.get("feed") };
    get mediaGroup() { return this.get("mediaGroup") };
    get title() { return this.get("title") };
    get link() { return this.get("link") };
    get content() { return this.get("content") };
    get contentSnippet() { return this.get("contentSnippet") };
    get publishedDate() { return this.get("publishedDate") };
    get categories() { return this.get("categories") };

    constructor() {
        super('Entry')
    }
    static findAll() {
        let query = new Parse.Query(Entry);
        return query.find();
    }
    static findOne(id) {
        let query = new Parse.Query(Entry);
        return query.get(id);
    }
    static findByFeed(feed: Feed) {
        let relation = feed.relation('entries')
        return relation.query().find()
    }
}

Parse.Object['registerSubclass']('Entry', Entry)


@ng.Injectable()
export class Feed extends Parse.Object {

    get feedUrl() { return this.get('feedUrl') }
    get title() { return this.get('title') }
    get link() { return this.get('link') }
    get description() { return this.get('description') }
    get author() { return this.get('author') }
    get entries() {
        return this.relation('entries').query()
    }
    constructor() {
        super('Feed');
    }
    static findAll() {
        let query = new Parse.Query(Feed);
        return query.find()
    }
    static findOne(id) {
        let query = new Parse.Query(Feed);
        return query.get(id)
    }

    static subscribe(findResultEntry: FindResultEntry) {
        let feed, entries, service = new Service(window);
        return service.loadFeed(findResultEntry.url)
            .then((f: { entries: {}[] }) => {
                feed = new Feed;
                entries = f.entries
                f.entries = undefined;
                return feed.save(f)
            }).then(f => {
                feed = f
                return Promise.all(entries.map((e) => {
                    let entry = new Entry;
                    entry.set('feed', feed)
                    return entry.save(e)
                }))
            }).then((entries) => {

                console.log(entries)
                let relation = feed.relation('entries')
                entries.forEach(entry => relation.add(entry))
                return feed.save()
            })
    }
}

Parse.Object['registerSubclass']('Feed', Feed)


export const API_BINDINGS = [Entry, Feed, Service]

export interface FindResultEntry {
    id: number;
    title: string;
    link: string;
    url: string;
    contentSnippet: string;
}