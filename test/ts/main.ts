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

/// <reference path="./../../typings/tsd.d.ts" />

import {OrderByPipe} from './../../ts/pipes';


describe("pipes", function() {

	beforeEach(function() {
		this.orderBy = new OrderByPipe()
		this.array = [
			{ firstname: 'Christopher', lastname: 'Galvin' },
			{ firstname: 'Brian', lastname: 'French' },
			{ firstname: 'Alexander', lastname: 'Galvin' }
		]
	})
	describe('given a pipe OrderByPipe', function() {
		it('it should sort an array correcty', function() {
			let result = this.orderBy.transform(this.array, ['firstname']);
			expect(result[0].firstname).toBe('Alexander')
		})
		it('it should sort an array correctly when using multiple properties', function() {
			let result = this.orderBy.transform(this.array, ['lastname', 'firstname'])
			expect(result[0].firstname).toBe('Brian')
			expect(result[2].firstname).toBe('Christopher')
		})
	})
})






