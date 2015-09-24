/* tslint experimentalDecorators:true */
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

/// <reference path="../typings/tsd.d.ts" />

import * as ng from 'angular2/angular2';
import * as rx from 'rx';
import * as gapi from './gapi';
import * as feedApi from './feed-api';

interface StoreInterface{
    findOne(query):rx.Observable<{}>;
    findAll(query?):rx.Observable<Array<{}>>;
    insert(document):rx.Observable<number>;
    update(document):rx.Observable<number>;
    delete(document):rx.Observable<number>;
}

@ng.Injectable()
class InMemoryStore{}

@ng.Injectable()
class GoogleDriveStore implements StoreInterface{

    private _drive;
    private _install:rx.Observable<{}>;
    
    constructor(private _gapi:gapi.Gapi) {}
    
    findOne(document):rx.Observable<{}>{return }
    findAll(document):rx.Observable<Array<{}>>{return }
    insert(document):rx.Observable<number>{
        return;
    }
    update(document):rx.Observable<number>{return }
    delete(document):rx.Observable<number>{return }
    
   private get drive():rx.Observable<{}>{
       if (this._drive!=null){
           return rx.Observable.just(this._drive);
       }
       return rx.Observable.fromPromise(this._gapi.getGoogleDrive()).flatMap(drive=>{
            this._drive = drive;
            return this._drive;
        });
   }
}