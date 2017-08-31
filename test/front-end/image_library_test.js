process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

const env = require('jsdom').env;
const html = '<html><body><h1>Hello World!</h1><p class="hello">Heya Big World!</body></html>';

const ImageLibrary = require('../../public/lib/image_library/image_library.js').ImageLibrary;

env(html, function (errors, window) {
	console.log(errors);
	var $ = require('jquery')(window);
	console.log($('.hello').text());
});

describe('ImageLibrary() Front End Script', () => {

	var imageLibrary = new ImageLibrary('bill@billy.com', 'imageLibrary');

	describe('ImageLibrary.openLibrary', () => {

		it('should ', (done) => {

			imageLibrary.openLibrary().should.equal('opened');
			done();

		});

	});

	describe('ImageLibrary.closeLibrary', () => {

		it('should ', (done) => {
			done();
		});

	});

	// describe('ImageLibrary.uploadImage', () => {

	// 	it('should ', (done) => {

	// 	});

	// });

	// describe('ImageLibrary.removeImage', () => {

	// 	it('should ', (done) => {

	// 	});

	// });

	// describe('ImageLibrary.loadMoreImages', () => {

	// 	it('should ', (done) => {

	// 	});

	// });

});