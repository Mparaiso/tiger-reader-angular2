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

import * as ng from 'angular2/angular2'
import * as gapi from './gapi'


interface UserInfo {
	given_name: string;
	locale: string;
	name: string;
	picture: string;
}

@ng.Injectable()
export class Session {
	token;
	userinfo: UserInfo;
	private config;
	constructor(private _gapi: gapi.Gapi) {
		this.config = {
			client_id: '466994525316-kgurs2vm3h1012kv8vsuoukf4dg4vfnh.apps.googleusercontent.com',
			scopes: 'https://www.googleapis.com/auth/drive.file'
		};

	}
	getUserInfo() {
		if (this.userinfo){
			return Promise.resolve(this.userinfo)
		}
		return this.authorize()
			.then(_ => this._gapi.getOAuth2())
			.then(oauth2=> oauth2.userinfo.get())
			.then(userinfo=> this.userinfo = userinfo.result)
			.catch(err=> (this.userinfo = null,err))
	}
	authorize(immediate = true) {
		return this._gapi.authorize(this.config.client_id, this.config.scopes, immediate)
			.then(t => this.token = t)
			.catch(err => (this.token = null, err))

	}
}
