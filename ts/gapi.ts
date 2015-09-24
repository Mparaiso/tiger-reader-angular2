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

// <reference path="../typings/tsd.d.ts" />

import * as Ng from 'angular2/angular2'

@Ng.Injectable()
export class Gapi {
	private _gapi;

	constructor(private window: Window) { }

	getGapi() {
		if (this._gapi) {
			return Promise.resolve(this._gapi)
		}
		var script = this.window.document.createElement('SCRIPT')
		script.src = "https://apis.google.com/js/client.js?onload=loadApiClient"
		return new Promise((resolve, reject) => {
			this.window['loadApiClient'] = (result) => {
				this._gapi = this.window['gapi']
				resolve(this._gapi)
			}
			this.window.document.head.appendChild(script)
		})
	}

	authorize(client_id, scope,immediate = false) {
		var config = {
			client_id: client_id ,
			scope: scope ,
			immediate:immediate
		};
		return this.getGapi().then(gapi=> {
			return new Promise((resolve, reject) => {
				gapi.auth.authorize(config, function(authResult) {
					console.log(authResult)
					if (authResult && !authResult.error) {
						resolve(authResult);
					}
					reject(authResult.error)
				});
			});
		})
	}

	getClientLibrary(lib, version) {
		return this.getGapi().then(gapi=> {
			return gapi.client.load(lib || 'drive', version || 'v1')
		})
	}

	getGoogleDrive(){
		return this.getClientLibrary("drive", "v2").then( _=> this._gapi.client.drive )
	}
	getOAuth2(){
		return this.getClientLibrary("oauth2", "v2").then(_ => this._gapi.client.oauth2 )
	}
	getUser() {
		return this.getGapi().then(gapi=>{
			return gapi.auth.getToken()
		})
	}
}