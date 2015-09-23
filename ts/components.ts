/// <reference path="../typings/tsd.d.ts" />

import * as ng from 'angular2/angular2';
import * as ngRouter from 'angular2/router';
import * as user from './user';

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
/**
 * displays a vertical menu with a list of  feed titles
 */
export class FeedList {
	getFaviconUrl(domain) {
		return "http://www.google.com/s2/favicons?domain=" + domain
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
	constructor(private session: user.Session) { }
}  