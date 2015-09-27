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
// You should have  received a copy of the GNU General Public License
// along  with pi peline program.  If not, see <htt p://www.gnu.org/licenses/>.
System.register(['angular2/angular2'], function(exports_1) {
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
    var angular2_1;
    var Join, OrderByPipe;
    return {
        setters:[
            function (angular2_1_1) {
                angular2_1 = angular2_1_1;
            }],
        execute: function() {
            Join = (function () {
                function Join() {
                }
                Join.prototype.transform = function (value, args) {
                    if (args === void 0) { args = []; }
                    if (value instanceof Array) {
                        return value.join(args[0]);
                    }
                };
                Join = __decorate([
                    angular2_1.Pipe({ name: 'join' }), 
                    __metadata('design:paramtypes', [])
                ], Join);
                return Join;
            })();
            exports_1("Join", Join);
            /**
             * sort a collection
             * exemples:
             *    collection|orderBy:property
             *    collection|orderBy:propertyA:-propertyB
             *    collection|orderBy:sortFunction
             */
            OrderByPipe = (function () {
                function OrderByPipe() {
                }
                OrderByPipe.prototype.transform = function (value, args) {
                    if (args === void 0) { args = []; }
                    var sortProperties, array, reverse = false, sortFunction, wrapped;
                    if (value && value.wrapped && value.wrapped instanceof Array) {
                        wrapped = true;
                        array = value.wrapped;
                    }
                    else if (value && value instanceof Array) {
                        array = value;
                    }
                    else {
                        return value;
                    }
                    if (args.length === 1) {
                        if (typeof args[0] === 'boolean') {
                            reverse = args[0];
                        }
                        else if (args[0] instanceof Function) {
                            sortFunction = args[0];
                        }
                        else {
                            sortProperties = args;
                        }
                    }
                    else {
                        sortProperties = args;
                    }
                    if (sortFunction) {
                        array.sort(sortFunction);
                    }
                    else if (sortProperties.length > 0) {
                        array.sort(function (a, b) {
                            return sortProperty(sortProperties, 0, a, b);
                        });
                    }
                    else {
                        array.sort();
                    }
                    if (reverse === true) {
                        array = array.reverse();
                    }
                    return (wrapped ? ((value.wrapped = array), value) : array);
                    /* recursive sort based on property list */
                    function sortProperty(properties, i, a, b) {
                        var prop = properties[i];
                        if (i == properties.length) {
                            return 0;
                        }
                        if (prop.charAt(0) === '-') {
                            prop = prop.substr(1);
                            return a[prop] < b[prop] ? 1 : (a[prop] > b[prop] ? -1 : sortProperty(properties, i + 1, a, b));
                        }
                        else {
                            return a[prop] < b[prop] ? -1 : (a[prop] > b[prop] ? 1 : sortProperty(properties, i + 1, a, b));
                        }
                    }
                };
                OrderByPipe = __decorate([
                    angular2_1.Pipe({ name: 'orderBy' }), 
                    __metadata('design:paramtypes', [])
                ], OrderByPipe);
                return OrderByPipe;
            })();
            exports_1("OrderByPipe", OrderByPipe);
        }
    }
});
//# sourceMappingURL=pipes.js.map