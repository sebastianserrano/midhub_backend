'use strict';

const chai = require("chai");
const expect = chai.expect;
const timeout = 5000;

const EnvironmentPath= process.env.MIDHUB;
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/Database/DatabaseUtilities/DatabaseConnectionManager.js');
const DatabaseConnectionPoolManager = require(EnvironmentPath + '/src/BackEnd/Database/DatabaseUtilities/DatabaseConnectionPoolManager.js');

describe('Database Connection Pool Manager', () => {
	it('Should Return A New Database Connection Pool Object Upon Completing Protocol', async () => {
		const databaseConnectionManager = new DatabaseConnectionManager();
		const databaseConnectionPoolManager = new DatabaseConnectionPoolManager(databaseConnectionManager);
	})
})
