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
	
	getFaviconUrl(domain) {
		return "https://www.google.com/s2/favicons?domain=" + domain
	}
	
	onRemoveFeedClicked(feed:backend.Feed){
		Promise.resolve(feed.relation('entries').query().select('id').find())
		.then((entries:any)=>{
			Promise.all(entries.map(e=>e.destroy()))
		})
		.then(()=>feed.destroy)
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