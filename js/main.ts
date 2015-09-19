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

import {
Component, View, bootstrap, Inject,
NgForm, FORM_DIRECTIVES, CORE_DIRECTIVES,
FormBuilder, ControlGroup, Control, NgControl,
EventEmitter, Pipe, Observable
} from 'angular2/angular2';

import {Http, Headers, HTTP_BINDINGS} from 'angular2/http';

import {OrderByPipe} from './pipes';

class Address {
    _id: string;
    _rev: string;
    city: string;
    country: string;
    type = "address";
}

/**
 * Address Service
 */
class AddressService {

    private baseUri: string = "https://camus.cloudant.com/rest-api/";

    constructor( @Inject(Http) private http: Http) { }

    insert(address: Address) {
        let headers: Headers = new Headers();
        headers.append("Content-Type", "application/json");
        return this.http.post(this.baseUri, JSON.stringify(address), { headers })
            .toRx().map(r=> r.json())
    }
    getAll() {
        return this.http
            .post(this.baseUri + "_find", JSON.stringify({ selector: { "type": "address" } }))
            .toRx().map(r=> r.json().docs)
    }
}

@Component({
    selector: 'address-form',
    properties: ['address_service'],
    events: ['address_created']
})
@View({
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES],
    template: `
        <!-- ADDRESS FORM -->
        <form class="form" #f="form" (submit)="onSubmit($event)">
            <fieldset>
                <legend>New address</legend>
                <div class="form-group">
                    <label>City
                        <input [(ng-model)]="address.city"
                            ng-control="city"
                            type="text" name="city"
                            required maxlength="100"
                            minlength="2" class="form-control" />
                    </label>
                </div>
                <div  class="form-group">
                    <label>Country
                        <input [(ng-model)]="address.country"
                            ng-control="country"
                            type="text" name="country"
                            required maxlength="100"
                            minlength="2" class="form-control"/>
                    </label>
                </div>
                <div>
                    <input type="submit"
                        [disabled]="!f.valid"
                        class="btn btn-default" value="submit" />
                    <input type="reset"
                        class="btn btn-default" value="reset" />
                </div>
            </fieldset>
        </form>
    `
})
class AddressForm {
    private address_service: AddressService;
    private address_created = new EventEmitter;
    address = new Address;
    onSubmit($event) {
        console.log(arguments, this)
        this.address_service.insert(this.address).subscribe(() => {
            this.address_created.next(this.address)
            this.address = new Address
        })
        $event.preventDefault();
        return false;
    }
}

@Component({
    selector: 'main',
    changeDetectionStrategy: "ON_PUSH"
})
@View({
    pipes: [OrderByPipe],
    directives: [CORE_DIRECTIVES, AddressForm],
    template: `
            <!-- MAIN -->
            <table class="table">
                <caption>Addresses</caption>
                <thead>
                    <tr>
                        <th>City</th><th>Country</th>
                    </tr>
                </thead>
                <tbody>

                <tr *ng-for="#address of addresses|orderBy:'country':'city'">
                    <td>{{address.city}}</td><td>{{address.country}}</td>
                </tr>
                </tbody>
            </table>
            <section>
                <address-form [address_service]="addressService"
                (address_created)="OnAddressCreated($event)">
                </address-form>
            </section>
    `
})
class MainComponent {
    addresses: any;
    constructor(public addressService: AddressService) {
        this.addressService.getAll().subscribe(r=> this.addresses = r)
    }
    OnAddressCreated(address) {
        this.addressService.getAll().subscribe(r=> this.addresses = r)
    }
}

bootstrap(MainComponent, [AddressService, HTTP_BINDINGS])