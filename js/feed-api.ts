
declare let google: any;

import {Injectable,Inject} from 'angular2/angular2';

export interface Entry {

}
export interface FindResultEntry {
    title: string;
    link: string;
    url: string;
    contentSnippet: string;
}

export class SubscriptionRepository{

    private id = 0;
    private _subscriptions: Array<FindResultEntry>;

    constructor() {
        this._subscriptions = [];
    }
    subscribe(findResultEntry):Promise<any>{
        findResultEntry.id = this.id++;
        this._subscriptions.push(findResultEntry)
        return Promise.all([findResultEntry.id])
    }
    getAll():Promise<any>{
        return Promise.all([this._subscriptions])
    }
    removeAll():Promise<any>{
        this._subscriptions.splice(0,this._subscriptions.length)
        return Promise.all([])
    }
    insert(subscription):Promise<any>{
        return Promise.all([this._subscriptions.push(subscription)])
    }
    get subscriptions(){
        console.log(this._subscriptions)
        return this._subscriptions
    }
}

export class Service {

    private debug = this.window.debug;

    get feeds() {
        return this.window.google.feeds;
    }
    constructor(@Inject(Window) private window: Window) {

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
                this.debug ? console.log(result) : void 0; 
                resolve(result.entries)
            })
        })
    }
}

export class CandidateSubscriptionRepository extends SubscriptionRepository{}
