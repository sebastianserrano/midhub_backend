'use strict';

const DatabaseLoginQuerier = require('./DatabaseLoginQuerier.js');
const JWTGenerator = require('../../../Server/Utilities/JWTGenerator.js')

class UserLogin {
	constructor(global){
		this.database = global.getDatabase()
		this.jwtGenerator = new JWTGenerator();
		this.databaseLoginQuerier = new DatabaseLoginQuerier(this.database)
	}

	async checkCredentials(email, password){
		try {
			const databaseLoginCredentials = await this.databaseLoginQuerier.checkLoginCredentials(email, password)
			const loginCredentials = this.generateLoginCredentials(email, databaseLoginCredentials)

			return loginCredentials;
		} catch(exception){
			throw exception
		}
	}

	generateLoginCredentials(email, databaseLoginCredentials){
		const token = this.jwtGenerator.generateToken(email);
		return {
			token: token,
			...databaseLoginCredentials
		}
	}
}

module.exports = UserLogin;
