/// <reference path="../typings/tsd.d.ts" />

import { Component, View, bootstrap, bind, CORE_DIRECTIVES, FORM_DIRECTIVES, EventEmitter} from 'angular2/angular2'
import * as NgRouter from 'angular2/router'
import * as FeedApi from './feed-api'


@Component({
	selector: 'sub-route-component',
	//properties:['feeds'],
	//events:['onSubscribed']
})
@View({
	directives: [CORE_DIRECTIVES, FORM_DIRECTIVES],
	templateUrl: 'templates/do-subscribe.tpl.html'
})
/** list of feeds to subscribe*/
class DoSubscribeComponent {
	private feeds;
	constructor(private Candidates: FeedApi.CandidateSubscriptionRepository,
		private SubscriptionRepository: FeedApi.SubscriptionRepository,
		private router: NgRouter.Router) {
		this.feeds = Candidates.subscriptions || [];
	}

	onSubmit($event) {
		Promise.all(this.feeds.filter(r=> r.subscribe).map((subscription) => this.SubscriptionRepository.subscribe(subscription)))
			.then(() => this.Candidates.removeAll())
			.then(() => this.router.navigate('/home/main'))
	}
}

@Component({
	selector: 'sub-home-component'
})
@View({
	templateUrl: 'templates/home-main.tpl.html'
})
class HomeMainComponent {
	constructor(private router: NgRouter.Router) {
	}
}

@Component({ selector: 'home-component' })
@View({
	template: `<router-outlet></router-outlet>
	`,
	directives: [NgRouter.ROUTER_DIRECTIVES]
})
@NgRouter.RouteConfig([
	{ path: '/', redirectTo: '/main' },
	{ path: '/main', component: HomeMainComponent, as: 'main' },
	{ path: '/do-subscribe', component: DoSubscribeComponent, as: 'dosubscribe' }
])
class HomeComponent {
	constructor() {
	}

}

@NgRouter.RouteConfig([
	/* note: @angular2 this is the top-level router */
	{ path: '/', redirectTo: '/home/' },
	{ path: '/home/...', component: HomeComponent, as: 'home' }
])
@Component({
	selector: 'root',
})
@View({
	directives: [NgRouter.ROUTER_DIRECTIVES, CORE_DIRECTIVES],
	templateUrl: 'templates/root.tpl.html'
})
/** Root element */
class RootComponent {
	constructor(private feedApi: FeedApi.Service,
		private router: NgRouter.Router,
		private CandidateRepository: FeedApi.CandidateSubscriptionRepository,
		private SubscriptionRepository: FeedApi.SubscriptionRepository) {
	}
	onSubscribeClicked($event) {
		let query = prompt('Enter a url where to look for rss feeds');
		if (query.trim() === "") {
			return
		}
		this.feedApi.findQuery(query).then(r=> {
			if (r.length == 0) {
				return this.feedApi.findQuery('site:' + query);
			} else {
				return r
			}
		}).then((r) => {
			if (r.length > 0) {
				this.CandidateRepository.removeAll()
					.then(() => {
						return Promise.all(r.map(r=> this.CandidateRepository.insert(r))
				}).then(() => this.router.navigate('/home/do-subscribe'))
			}
		})
	}
}

bootstrap(RootComponent, [
	FeedApi.CandidateSubscriptionRepository,
	FeedApi.Service,
	FeedApi.SubscriptionRepository,
	bind(Window).toValue(window),
	NgRouter.ROUTER_BINDINGS,
	bind(NgRouter.LocationStrategy).toClass(NgRouter.HashLocationStrategy)
])
