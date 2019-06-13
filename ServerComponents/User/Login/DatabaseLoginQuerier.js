'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');
const PasswordCreator = require('../../Utilities/PasswordCreator.js');
const PasswordsDontMatch = require('../../Error/Errors/Server/Login/PasswordsDontMatch');

class DatabaseLoginQuerier {
	constructor(database){
		this.database = database;
		this.passwordCreator = new PasswordCreator();
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}
	
	checkLoginCredentials(email, password){
		return new Promise((resolve, reject) => {
			this.database.task('Retrieve Password Credentials', async task => {
				const userInfo = await this.fromUsers(task, email);
				const passwordCredentials = await this.fromUserPasswords(task, userInfo["User ID"]);
				this.checkCredentials(password, passwordCredentials)

				const countryInfo = await this.fromCountries(task, userInfo["Country"])
				const response = this.generateResponse(email, userInfo, countryInfo)

				return response
			}).then(loginCredentials => {
				resolve(loginCredentials);	
			}).catch(exception => {
				reject(exception);
			})
		})
	}	

	checkCredentials(password, passwordCredentials){
		try {
			const salt = passwordCredentials['Dynamic Salt'];
			const userHash = this.passwordCreator.createHash(salt, password, 'sha512')
			const databaseHash = passwordCredentials['Password Hash'];

			const hashesEquality = this.checkHashesEquality(userHash, databaseHash);

			return
		} catch(exception) {
			throw exception;
		}	
	}

	checkHashesEquality(userHash, databaseHash){
		if(userHash === databaseHash){
			return;
		}
		throw new PasswordsDontMatch();
	}

	fromUsers(task, email){
		return task.one('SELECT "First Name", "Middle Name", "Last Name", "Country", "User ID" FROM "Users" WHERE ("Email" = $1)', [email]);
	}

	fromUserPasswords(task, userID){
		return task.one('SELECT "Dynamic Salt", "Password Hash" FROM "User Passwords" WHERE ("User ID" = $1)', [userID]);
	}

	fromCountries(task, countryCode){
		return task.one('SELECT "Country Name", "Country Currency" FROM "Countries" WHERE ("Country Code" = $1)', [countryCode]);
	}

	generateResponse(email, userInfo, countryInfo){
		if(userInfo["Middle Name"] === ""){
			return {
				email: email,
				name: userInfo["First Name"] + " " + userInfo["Last Name"],
				countryCode: userInfo["Country"],
				countryName: countryInfo["Country Name"],
				countryCurrency: countryInfo["Country Currency"]
			}
		} else {
			return {
				email: email,
				name: userInfo["First Name"] + " " + userInfo["Middle Name"] + " " + userInfo["Last Name"],
				countryCode: userInfo["Country"],
				countryName: countryInfo["Country Name"],
				countryCurrency: countryInfo["Country Currency"]
			}
		}
	}
}

module.exports = DatabaseLoginQuerier;
