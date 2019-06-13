'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const PasswordCreator = require(EnvironmentPath + '/src/Utilities/PasswordCreator.js');

describe('Password', () => {
	describe('Upon Creation', () => {
		it('Should Return An Object With The Dynamic Salt And Hash', () => {
				const password = new PasswordCreator();
				
				const response = password.create('my 12 character long password', 'sha512')
				expect(response).to.be.an('object').that.has.all.keys('Salt', 'Hash');
		}).timeout(timeout);
	}),

	describe('Create Hash', () => {
		it('Should Be Produced With The SHA-512 Algoritihm And Be 128 Characters Long', () => {
				const password = new PasswordCreator();
				const salt = 'ff1599b5-ec50-4045-8567-a2e4985f13af';

				const hash = password.createHash(salt, 'my 12 character long password', 'sha512');
				expect(hash).to.have.lengthOf(128);
		})
	}),

	describe('Create Salt', () => {
		it('Should Produce A Random Salt That Is 36 Characters Long And Conforms To Regex [a-z0-9-]{36}', () => {
				const password = new PasswordCreator();

				const salt = password.createSalt();
				expect(salt).to.have.lengthOf(36);
				expect(salt).to.match(/^[a-z0-9-]{36}$/);
		})
	})
})
