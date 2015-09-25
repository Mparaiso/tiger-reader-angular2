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
import * as feedapi from './feed-api';
import * as components from './components';
import * as ng from 'angular2/angular2';

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
	constructor(private feedApi: feedapi.Service,
		private FeedRepository: feedapi.FeedRepository,
		private routeParams: ngRouter.RouteParams,
		private router: ngRouter.Router) {
		this.query = routeParams.get('query');
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
		Promise.all(this.findResultEntries.filter(e => e.selected)
			.map(feed => this.FeedRepository.subscribe(feed)))
			.then(_=> this.router.navigate('/home/feeds'))
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
	entry: feedapi.Entry;
	constructor(private routeParams: ngRouter.RouteParams,
		private entryRepository: feedapi.EntryRepository,
		private window: Window) {
		let entryId = routeParams.get('entry_id');
		if (entryId) {
			this.entryRepository.findOne(entryId).then(e=> { this.entry = e });
		}
	}
}

@Component({
	selector: 'masterview',
})
@View({
	directives: [CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES, components.EntryList],
	templateUrl: 'templates/masterview.tpl.html'

})
class MasterView {
	feed_id;
	feed = {};
	entries = [];
	constructor(private routeParams: ngRouter.RouteParams,
		private entryRepository: feedapi.EntryRepository,
		private feedRepository: feedapi.FeedRepository) {
			this.feed_id = this.routeParams.get('feed_id');
		if (this.feed_id) {
			this.feedRepository.findOne(this.feed_id)
				.then(feed=> {
					if (feed) {
						this.feed = feed;
						return this.entryRepository.findByFeed(feed);
					} else {
						return this.entryRepository.findAll()
					}
				})
				.then((entries) => { this.entries = entries })
		} else {
			this.entryRepository.findAll()
				.then((entries) => {
					this.entries = entries
				})
		}
	}
}

@Component({ selector: 'home-component' })
@View({
	template: `<router-outlet></router-outlet>`,
	directives: [ngRouter.ROUTER_DIRECTIVES]
})
@ngRouter.RouteConfig([
	{ path: '/', redirectTo: '/feeds' },
	{ path: '/subscribe/:query', component: SubscribeComponent, as: 'subscribe' },
	{ path: '/feeds', component: MasterView, as: 'feeds' },
	{ path: '/by-category/:category', component: MasterView, as: 'by-category' },
	{ path: '/feeds/:feed_id', component: MasterView, as: 'feeds' },
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
	constructor(private feedApi: feedapi.Service,
		private router: ngRouter.Router,
		private CandidateRepository: feedapi.CandidateFeedRepository,
		private FeedRepository: feedapi.FeedRepository) {
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
	feedapi.FEED_API_BINDINGS,
	bind(Window).toValue(window),
	ngRouter.ROUTER_BINDINGS,
	bind(ngRouter.LocationStrategy).toClass(ngRouter.HashLocationStrategy)
]).then(_=> console.log('tiger reader is live!'))
	.catch(console.log.bind(console))
