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

declare let google: any;

import {Injectable, Inject} from 'angular2/angular2';

/** an entry of a feed */
export interface Entry {
    feed_id: number;
    mediaGroup;
    title;
    link;
    content;
    contentSnippet;
    publishedDate;
    categories: any[];
}

export interface Feed {
    id;
    feedUrl;
    title;
    link;
    description;
    author;
    entries: Entry[];
}

export interface FindResultEntry {
    id: number;
    title: string;
    link: string;
    url: string;
    contentSnippet: string;
}

@Injectable()
export class Service {

    constructor(private window: Window) { }

    get feeds() {
        return this.window.google.feeds;
    }
    /**
     * Search for a feed
     */
    findQuery(query: string): Promise<Array<Entry>> {
        return new Promise((resolve, reject) => {
            this.feeds.findFeeds(query, result=> {
                if (result.error) {
                    return reject(result.error)
                }
                resolve(result.entries)
            })
        })
    }
    loadFeed(url: string): Promise<Feed> {
        return new Promise((resolve, reject) => {
            var feed = new this.feeds.Feed(url);
            feed.setNumEntries(30)
            feed.includeHistoricalEntries();
            feed.load((result) => {
                if (result.error) { return reject(result.error) }
                resolve(result.feed);
            })
        });
    }
}

class InMemoryStore{}

class GoogleDriveStore{}

/**
 * base class for all repositories
 */
class Repository {
    private _id = 0;
    private _idField = "id";
    private _collection = [];

    findAll() {
        return Promise.resolve(this._collection)
    }

    findOne(query :number|string|any){
        if(typeof query === 'number' || typeof query ==='string'){
            let index,indexes = this.collection.map((entry) => { return entry[this._idField].toString() })
            index = indexes.indexOf(query.toString())
            if (index >= 0) return Promise.resolve(this.collection[index]);
            return Promise.resolve(null)
        }else{
            throw "complex queries not implemented yet"
        }
    }

    deleteAll() {
        this._collection.splice(0, this._collection.length)
        return Promise.resolve([])
    }
    insert(document) {
        document[this.getIdField()] = this.generateNewId();
        this.collection.push(document)
        return Promise.resolve(document[this.getIdField()])
    }

    generateNewId() {
        return ++this._id;
    }

    getIdField() {
        return this._idField;
    }

    get collection() {
        return this._collection
    }
}

@Injectable()
export class EntryRepository extends Repository {
    get entries() {
        return this.collection;
    }
    findByFeed(feed: Feed) {
        return Promise.resolve(this.entries.filter(entry => {
            return entry.feed_id == feed.id}))
    }
}

/**
 * feeds
 */
@Injectable()
export class FeedRepository extends Repository {

    constructor(private entryRepository: EntryRepository, private service: Service) {
        super();
    }

    subscribe(findResultEntry: FindResultEntry): Promise<any> {
        var f, i;
        return this.service.loadFeed(findResultEntry.url)
            .then((feed: Feed) => {
                f = feed;
                return this.insert(feed)
            }).then(id=> {
                i = id;
                return Promise.all(f.entries.map((entry) => {
                    entry.feed_id = id;
                    return this.entryRepository.insert(entry);
                }))
            }).then(() => i)
    }

    get feeds() {
        return this.collection
    }
}

/**
 * feed candidates
 */
@Injectable()
export class CandidateFeedRepository extends FeedRepository { }


export const FEED_API_BINDINGS = [EntryRepository, FeedRepository, CandidateFeedRepository, Service]