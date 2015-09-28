/// <reference path="./../../typings/tsd.d.ts" />

import {OrderByPipe} from './../../ts/pipes';


describe("pipes", function() {
	
	beforeEach(function() {
		this.orderBy = new OrderByPipe()
		this.array = [
			{ firstname: 'Brian',lastname:'French' },
			{ firstname: 'Christopher',lastname:'Galvin' },
			{ firstname: 'Alexander',lastname:'Galvin' }
		]
	})
	describe('OrderByPipe', function() {
		it('should sort an array correcty', function() {
			let res = this.orderBy.transform(this.array, ['firstname']);
			expect(res[0].firstname).toBe('Alexander')
		})
		it('should sort an array correct when using multiple properties',function(){
			let res1 = this.orderBy.transform(this.array,['lastname','firstname'])
			expect(res1[0].firstname).toBe('Brian')
			expect(res1[2].firstname).toBe('Christopher')
		})
	})
})






