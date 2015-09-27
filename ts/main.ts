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

import { Component, View, bootstrap, bind, CORE_DIRECTIVES,
FORM_DIRECTIVES, EventEmitter, Observable} from 'angular2/angular2'
import * as ngRouter from 'angular2/router';
import * as backend from './backend';
import * as components from './components';
import * as ng from 'angular2/angular2';
import * as rx from 'rx';
@Component({
	selector: 'subscribe-component'
})
@View({
	directives: [CORE_DIRECTIVES, FORM_DIRECTIVES],
	templateUrl: 'templates/subscribe.tpl.html'

})
/** list of feeds to subscribe*/
class SubscribeComponent {
	private findResultEntries = [];
	private query = "";
	private allSelected = false;
	private feeds;
	constructor(private feedApi: backend.Service,
		private feedRepository: backend.FeedRepository,
		@ng.Inject(backend.Feed) private Feed: typeof backend.Feed,
		private routeParams: ngRouter.RouteParams,
		private router: ngRouter.Router) {
		foo;
		this.feeds = this.feedRepository.feeds;
		this.query = this.routeParams.get('query');
		this.feedApi.findQuery(this.query)
			.then(results => {
				if (results.length > 0) {
					return Promise.resolve(results)
				} else {
					return this.feedApi.findQuery(`site:${this.query}`)
				}
			}).then(results => this.findResultEntries.splice(0, 0, ...results))
	}

	onSubmit($event) {
		Promise.all(
		this.findResultEntries.filter(e => e.selected)
		.map(feed=>this.Feed.subscribe(feed)))
		.then(feeds=>{
			this.feedRepository.feeds.push(...feeds);
		})
		this.router.navigate('/home/feeds')
		return false;
	}

	onSelectAllFieldsChange($event) {
		if (this.findResultEntries.every(entry=> entry.selected == true)) {
			this.findResultEntries.forEach(entry=> entry.selected = false)
		} else {
			this.findResultEntries.forEach(entry=> entry.selected = true)
		}
	}
}

@Component({ selector: 'detailview' })
@View({
	directives: [CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES, components.Entry],
	template: '<entry [entry]="entry"></entry>'
})
class DetailView {
	entry: backend.Entry;
	constructor(private routeParams: ngRouter.RouteParams,
		@ng.Inject(backend.Entry) private Entry: typeof backend.Entry,
		private window: Window) {
		let entryId = routeParams.get('entry_id');
		if (entryId) {
			this.Entry.findOne(entryId).then(e=> { this.entry = e });
		}
	}
}

@Component({
	selector: 'masterview',
	properties: ['feed', 'entries']
})
@View({
	directives: [CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES, components.EntryList],
	templateUrl: 'templates/masterview.tpl.html'

})
class MasterView { }

@Component({
	selector: 'feedshow',
})
@View({
	directives: [MasterView],
	template: '<masterview [feed]="feed" [entries]="entries"></masterview>'

})
class FeedShowView {

	private feed: backend.Feed;
	private entries;
	constructor(private routeParams: ngRouter.RouteParams,
		@ng.Inject(backend.Feed) private Feed: typeof backend.Feed) { }
	onActivate(next, prev) {
		Promise.resolve(this.routeParams.get('feed_id'))
			.then(feed_id=> {
				return this.Feed.findOne(feed_id)
			})
			.then(feed=> {
				if (feed == null) {
					return Promise.reject(new Error('feed not found'))
				}
				this.feed = feed;
				return this.feed.entries.find()
			}).then(entries=> {
				this.entries = entries;
			})
	}

}

@Component({
	selector: 'feedindex',
})
@View({
	directives: [MasterView],
	template: '<masterview [entries]="entries"></masterview>'

})
class FeedIndexView {
	private entries;
	constructor( @ng.Inject(backend.Entry) private Entry: typeof backend.Entry) { }
	onActivate(next, prev) {
		return this.Entry.findAll().then(entries=> {
			this.entries = entries
		})
	}
}

class MasterViewByCategory extends MasterView { }

@Component({ selector: 'home-component' })
@View({
	template: `<router-outlet></router-outlet>`,
	directives: [ngRouter.ROUTER_DIRECTIVES]
})
@ngRouter.RouteConfig([
	{ path: '/', redirectTo: '/feeds' },
	{ path: '/subscribe/:query', component: SubscribeComponent, as: 'subscribe' },
	{ path: '/feeds', component: FeedIndexView, as: 'feeds' },
	{ path: '/by-category/:category', component: MasterViewByCategory, as: 'by-category' },
	{ path: '/feeds/:feed_id', component: FeedShowView, as: 'feeds' },
	{ path: '/entries/:entry_id', component: DetailView, as: 'entries' }
])
class HomeComponent { }

@ngRouter.RouteConfig([
	/* note: @angular2 this is the top-level router */
	{ path: '/', redirectTo: '/home/' },
	{ path: '/home/...', component: HomeComponent, as: 'home' }
])
@Component({
	selector: 'root',
})
@View({
	directives: [ngRouter.ROUTER_DIRECTIVES, CORE_DIRECTIVES, components.FeedList, components.MainMenu],
	templateUrl: 'templates/root.tpl.html'
})
/** Root element */
class RootView {
	private feeds = [];
	constructor(private feedApi: backend.Service,
		private router: ngRouter.Router,
		private feedRepository: backend.FeedRepository,
		@ng.Inject(backend.Feed) private Feed: typeof backend.Feed,
		@ng.Inject(backend.Entry)private Entry:typeof backend.Entry) {
		this.feeds = this.feedRepository.feeds
		this.Feed.findAll()
		.then((feeds:any)=>{
			this.feedRepository.feeds.push(...feeds)
		})
	}

	onSubscribeClicked($event) {
		let query = prompt('Enter a url where to look for rss feeds', '');
		if (query.trim() === "") {
			return
		}
		this.router.navigate(`/home/subscribe/${query}`)
	}
}

bootstrap(RootView, [
	backend.FeedRepository,
	backend.Service,
	bind(backend.Feed).toValue(backend.Feed),
	bind(backend.Entry).toValue(backend.Entry),
	bind(Window).toValue(window),
	ngRouter.ROUTER_BINDINGS,
	bind(ngRouter.LocationStrategy).toClass(ngRouter.HashLocationStrategy)
]).then(_=> console.log('tiger reader is live!'))
	.catch(console.log.bind(console))
