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
System.register(['angular2/angular2', 'angular2/http', './pipes'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
        switch (arguments.length) {
            case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
            case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
            case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
        }
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (this && this.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var angular2_1, http_1, pipes_1;
    var Address, AddressService, AddressForm, MainComponent;
    return {
        setters:[
            function (angular2_1_1) {
                angular2_1 = angular2_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (pipes_1_1) {
                pipes_1 = pipes_1_1;
            }],
        execute: function() {
            Address = (function () {
                function Address() {
                    this.type = "address";
                }
                return Address;
            })();
            /**
             * Address Service
             */
            AddressService = (function () {
                function AddressService(http) {
                    this.http = http;
                    this.baseUri = "https://camus.cloudant.com/rest-api/";
                }
                AddressService.prototype.insert = function (address) {
                    var headers = new http_1.Headers();
                    headers.append("Content-Type", "application/json");
                    return this.http.post(this.baseUri, JSON.stringify(address), { headers: headers })
                        .toRx().map(function (r) { return r.json(); });
                };
                AddressService.prototype.getAll = function () {
                    return this.http
                        .post(this.baseUri + "_find", JSON.stringify({ selector: { "type": "address" } }))
                        .toRx().map(function (r) { return r.json().docs; });
                };
                AddressService = __decorate([
                    __param(0, angular2_1.Inject(http_1.Http)), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], AddressService);
                return AddressService;
            })();
            AddressForm = (function () {
                function AddressForm() {
                    this.address_created = new angular2_1.EventEmitter;
                    this.address = new Address;
                }
                AddressForm.prototype.onSubmit = function ($event) {
                    var _this = this;
                    console.log(arguments, this);
                    this.address_service.insert(this.address).subscribe(function () {
                        _this.address_created.next(_this.address);
                        _this.address = new Address;
                    });
                    $event.preventDefault();
                    return false;
                };
                AddressForm = __decorate([
                    angular2_1.Component({
                        selector: 'address-form',
                        properties: ['address_service'],
                        events: ['address_created']
                    }),
                    angular2_1.View({
                        directives: [angular2_1.CORE_DIRECTIVES, angular2_1.FORM_DIRECTIVES],
                        template: "\n        <!-- ADDRESS FORM -->\n        <form class=\"form\" #f=\"form\" (submit)=\"onSubmit($event)\">\n            <fieldset>\n                <legend>New address</legend>\n                <div class=\"form-group\">\n                    <label>City\n                        <input [(ng-model)]=\"address.city\"\n                            ng-control=\"city\"\n                            type=\"text\" name=\"city\"\n                            required maxlength=\"100\"\n                            minlength=\"2\" class=\"form-control\" />\n                    </label>\n                </div>\n                <div  class=\"form-group\">\n                    <label>Country\n                        <input [(ng-model)]=\"address.country\"\n                            ng-control=\"country\"\n                            type=\"text\" name=\"country\"\n                            required maxlength=\"100\"\n                            minlength=\"2\" class=\"form-control\"/>\n                    </label>\n                </div>\n                <div>\n                    <input type=\"submit\"\n                        [disabled]=\"!f.valid\"\n                        class=\"btn btn-default\" value=\"submit\" />\n                    <input type=\"reset\"\n                        class=\"btn btn-default\" value=\"reset\" />\n                </div>\n            </fieldset>\n        </form>\n    "
                    }), 
                    __metadata('design:paramtypes', [])
                ], AddressForm);
                return AddressForm;
            })();
            MainComponent = (function () {
                function MainComponent(addressService) {
                    var _this = this;
                    this.addressService = addressService;
                    this.addressService.getAll().subscribe(function (r) { return _this.addresses = r; });
                }
                MainComponent.prototype.OnAddressCreated = function (address) {
                    var _this = this;
                    this.addressService.getAll().subscribe(function (r) { return _this.addresses = r; });
                };
                MainComponent = __decorate([
                    angular2_1.Component({
                        selector: 'main',
                        changeDetectionStrategy: "ON_PUSH"
                    }),
                    angular2_1.View({
                        pipes: [pipes_1.OrderByPipe],
                        directives: [angular2_1.CORE_DIRECTIVES, AddressForm],
                        template: "\n            <!-- MAIN -->\n            <table class=\"table\">\n                <caption>Addresses</caption>\n                <thead>\n                    <tr>\n                        <th>City</th><th>Country</th>\n                    </tr>\n                </thead>\n                <tbody>\n\n                <tr *ng-for=\"#address of addresses|orderBy:'country':'city'\">\n                    <td>{{address.city}}</td><td>{{address.country}}</td>\n                </tr>\n                </tbody>\n            </table>\n            <section>\n                <address-form [address_service]=\"addressService\"\n                (address_created)=\"OnAddressCreated($event)\">\n                </address-form>\n            </section>\n    "
                    }), 
                    __metadata('design:paramtypes', [AddressService])
                ], MainComponent);
                return MainComponent;
            })();
            angular2_1.bootstrap(MainComponent, [AddressService, http_1.HTTP_BINDINGS]);
        }
    }
});
//# sourceMappingURL=main.js.map