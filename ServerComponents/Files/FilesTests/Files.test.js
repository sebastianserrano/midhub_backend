'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath = process.env.MIDHUB;
const Files = require(EnvironmentPath + '/src/BackEnd/ServerComponents/Files/Files.js');
const Global_ = require(EnvironmentPath + '/src/BackEnd/Server/Global/Global.js');

var Global;

describe('Files', () => {
	before(async () => {
		Global = await new Global_();
	});

	describe('Retrieve Link', () => {
		it('Should Return True An Object With The Link Upon Success', async () => {
			const body = {
				sessionDetails : {
					sessionID: "e0d4fdd2-3ad1-11e9-bf33-7bac956e80d2"
				}
			}

			const files = new Files(Global);
			const response = await files.retrieveFileLink(body)

			expect(response).to.have.all.keys("File Link")
		})
	})

	after(function() {
		const databaseConnection = Global.getDatabase();	
		databaseConnection.$pool.end();
	})
})
