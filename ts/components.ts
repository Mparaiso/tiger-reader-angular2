/// <reference path="../typings/tsd.d.ts" />

import * as ng from 'angular2/angular2';
import * as ngRouter from 'angular2/router';
import * as backend from './backend';

@ng.Component({ selector: 'entry', properties: ['entry'] })
@ng.View({
	templateUrl: 'templates/entry.tpl.html',
	directives: [ng.CORE_DIRECTIVES,ngRouter.ROUTER_DIRECTIVES]
})
export class Entry {
	constructor(private window:Window){}
	/** if content is clicked, when a link , open in a new window */
	onContentClicked($event: Event) {
		var target;
		$event.stopPropagation()
		$event.preventDefault()
		if ((target = $event.target)['tagName'] === 'A') {
			this.window.open(target.href)
		}
		return false;
	}
}

@ng.Component({selector:'entrylist',properties:['entries']})
@ng.View({templateUrl:'templates/entrylist.tpl.html',
	directives:[ng.CORE_DIRECTIVES,ngRouter.ROUTER_DIRECTIVES]
})
export class EntryList {}

@ng.Component({ selector: 'feedlist', properties: ['feeds'] })
@ng.View({
	templateUrl: 'templates/feedlist.tpl.html',
	directives: [ngRouter.ROUTER_DIRECTIVES, ng.CORE_DIRECTIVES]
})
export class FeedList {
	constructor(
		private feedRepository:backend.FeedRepository,
		@ng.Inject(backend.Feed) private Feed:typeof backend.Feed,
		@ng.Inject(backend.Entry) private Entry:typeof backend.Entry) {
		}
	
	getFaviconUrl(domain:string):string {
		if (domain.trim()===""){
			return "https://www.google.com/s2/favicons?domain=http://nodomain"
		}
		return "https://www.google.com/s2/favicons?domain=" + domain
	}
	
	onRemoveFeedClicked(feed:backend.Feed){
		Promise.resolve(feed.relation('entries').query().select('id').find())
		.then((entries:any)=>{
			Promise.all(entries.map(e=>e.destroy()))
		})
		.then(()=>feed.destroy())
		.then(()=>{
			this.feedRepository.feeds.splice(
				this.feedRepository.feeds.indexOf(feed),
				1
			)
		})
		return false
	}
}

@ng.Component({
	selector: 'mainmenu'
})
@ng.View({
	templateUrl: 'templates/mainmenu.tpl.html',
	directives: [ngRouter.ROUTER_DIRECTIVES, ng.CORE_DIRECTIVES]
})
/**
 * displays the main menu
 */
export class MainMenu {
	constructor() { }
}  

@ng.Component({
	selector: 'subscribe-component'
})
@ng.View({
	directives: [ng.CORE_DIRECTIVES, ng.EventEmitter],
	templateUrl: 'templates/subscribe.tpl.html'

})
/** list of feeds to subscribe*/
export class SubscribeComponent {
	private findResultEntries = [];
	private query = "";
	private allSelected = false;
	private feeds;
	constructor(private feedApi: backend.Service,
		private feedRepository: backend.FeedRepository,
		@ng.Inject(backend.Feed) private Feed: typeof backend.Feed,
		private routeParams: ngRouter.RouteParams,
		private router: ngRouter.Router) {
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

@ng.Component({ selector: 'detailview' })
@ng.View({
	directives: [ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES, Entry],
	template: '<entry [entry]="entry"></entry>'
})
export class DetailView {
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

@ng.Component({
	selector: 'masterview',
	properties: ['feed', 'entries']
})
@ng.View({
	directives: [ng.CORE_DIRECTIVES, ngRouter.ROUTER_DIRECTIVES, EntryList],
	templateUrl: 'templates/masterview.tpl.html'

})
export class MasterView { }

@ng.Component({
	selector: 'feedshow',
})
@ng.View({
	directives: [MasterView],
	template: '<masterview [feed]="feed" [entries]="entries"></masterview>'

})
export class FeedShowView {

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

@ng.Component({
	selector: 'feedindex',
})
@ng.View({
	directives: [MasterView],
	template: '<masterview [entries]="entries"></masterview>'
})
export class FeedIndexView {
	private entries;
	constructor( @ng.Inject(backend.Entry) private Entry: typeof backend.Entry) { }
	onActivate(next, prev) {
		return this.Entry.findAll().then(entries=> {
			this.entries = entries
		})
	}
}

export class MasterViewByCategory extends MasterView { }

@ng.Component({ selector: 'home-component' })
@ng.View({
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
export class HomeComponent { }

@ngRouter.RouteConfig([
	/* note: @angular2 this is the top-level router */
	{ path: '/', redirectTo: '/home/' },
	{ path: '/home/...', component: HomeComponent, as: 'home' }
])
@ng.Component({
	selector: 'root',
})
@ng.View({
	directives: [ngRouter.ROUTER_DIRECTIVES, ng.CORE_DIRECTIVES, FeedList, MainMenu],
	templateUrl: 'templates/root.tpl.html'
})
/** Root element */
export class RootView {
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