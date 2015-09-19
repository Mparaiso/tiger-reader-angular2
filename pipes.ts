// pipes.ts

/// <reference path="typings/tsd.d.ts"/>

import {Pipe} from 'angular2/angular2';

@Pipe({ name: 'orderBy' })
export class OrderByPipe {
    transform(value, args = []) {
        let sortProperties, array, reverse = false, sortFunction,wrapped;
        if (value && value.wrapped && value.wrapped instanceof Array){
            wrapped = true;
            array = value.wrapped;
        }else if(value && value instanceof Array){
            array = value;
        }else{
            return value
        }
        if (args.length === 1) {
            if (typeof args[0] === 'boolean') {
                reverse = args[0]
            } else if (args[0] instanceof Function) {
                sortFunction = args[0]
            } else {
                sortProperties = args
            }
        } else {
            sortProperties = args
        }
        if (sortFunction) {
            array.sort(sortFunction)
        } else if (sortProperties.length>0) {
            array.sort((a, b) => {
                return sortProperty(sortProperties, 0, a, b)
            })
        } else {
            array.sort()
        }
        if (reverse === true) {
            array = array.reverse()
        }
        return (wrapped ? ((value.wrapped = array),  value) : array )

        /* recursive sort based on property list */
        function sortProperty(properties, i, a, b) {
            let prop = <string>properties[i];
            if (i == properties.length) {
                return 0;
            }
            if (prop.charAt(0) === '-') {
                prop = prop.substr(1);
                return a[prop] < b[prop] ? 1 : (a[prop] > b[prop] ? -1 : sortProperty(properties, i + 1, a, b));
            } else {
                return a[prop] < b[prop] ? -1 : (a[prop] > b[prop] ? 1 : sortProperty(properties, i + 1, a, b));
            }
        }

    }
}