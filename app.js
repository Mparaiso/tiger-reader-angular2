/*jslint browser:true */
/*global ng */
(function () {
    "use strict";
    var DisplayComponent,RestTestComponent
        ,FriendsService,TodoComponent,t;

    t = function (aFunction) {
        var res = aFunction.toString().match(/\/\*\*?\*?([\w \W \s \S \t \n \r]+)\*\//mi)
        if (res instanceof Array && res.length == 2) {
            return res[1]
        }
        return ""
    }

    FriendsService=function() {
        this.names = ["John", "Jane", "Michael", "David"];
    }

    DisplayComponent = ng.Component({
        viewBindings: [FriendsService, RestTestComponent],
        selector: 'display'
    }).View({
        directives: [ng.NgFor, ng.NgIf, TodoComponent, RestTestComponent],
        template: t(function () { /***
         <section>
            <h1 id="output">Hi my name is {{ myName }}</h1>
            <p>Friends:</p>
            <ul>
                <li *ng-for="#name of names">{{ name }}</li>
            </ul>
            <p *ng-if="names.length>3">You have many friends !</p>
            <input #myname (keyup)>
            <p>{{myname.value}}</p>
            <todo></todo>
            <rest></rest>
         </section>
         */
        })
    }).Class({
        constructor: [FriendsService, function (FriendsService) {
            this.myName = "Alice"
            this.names = FriendsService.names;
        }]
    });


    TodoComponent = ng.Component({
        selector: 'todo'
        }).View({
            directives: [ng.NgFor],
            template: t(function () {/**
             <h2>Todo List</h2>
             <ul>
                <li *ng-for="#todo of todos">{{todo}}</li>
             </ul>
             <label> Task :
                <input #todotext>
             </label>
             <input type="button"  value="Add Task" (click)="addTodo(todotext.value)"/>
             */
            })
        }).Class({
            constructor: function () {
                this.todos = ["Eat Breakfast", "Do the laundry"];
            },
            addTodo: function (todo) {
                this.todos.push(todo);
            }
        })


     RestTestComponent = ng.Component({
        selector: 'rest',
        appInjector: [ng.Http]
    }).View({
        directives: [ng.NgFor],
        template: t(function () {
            /**
             <h2>Addresses</h2>
             <table>
             <thead>
             <tr>
             <th>City</th><th>Country</th>
             </tr>
             </thead>
             <tbody>
             <tr *ng-for="#address of addresses">
             <td>{{address.City|noop}}</td><td>{{address.Country}}</td>
             </tr>
             </tbody>
             </table>
             */
        })
        // pipes:[NoOpPipeComponent]
    }).Class({
        constructor: [ng.Http, function (http) {
            var self = this;
            http.get('http://localhost:9000/addresses').toRx().subscribe(function (r) {
                self.addresses = r.json().Addresses;
            });
        }]
    })
/*
    var NoOpPipeComponent = ng.Pipes({
        name:'noop',
        transform:function(value){return value}
    })
*/
    document.addEventListener('DOMContentLoaded', function () {
        console.log(new Date())
        ng.bootstrap(DisplayComponent);
    });
}());