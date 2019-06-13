'use strict';

const PasswordCreator = require('../../Utilities/PasswordCreator.js');
const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

class DatabaseUserCreator {
	constructor(database, userCredentials, ){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
		this.passwordCreator = new PasswordCreator();
	}
	
	create(userCredentials, userPaymentCredentials){
		return new Promise((resolve, reject) => {
			this.database.tx('Insert New User', async transaction => {

				const userID = await this.inUsers(transaction, userCredentials);
				const userPassword = await this.inUserPasswords(transaction, userCredentials, userID);
				const userPaymentKeysID = await this.inUserPaymentKeys(transaction, userPaymentCredentials, userID);
				const countryName = await this.fromCountries(transaction, userCredentials.country)
				await this.inUsersAddress(transaction, countryName["Country Name"], userID["User ID"])
				/*var userPaymentConnectKeys = await this.inUserPaymentConnectKeys(transaction, this.userPaymentCredentials.connect.keys, 

																																	 userPaymentKeysID);*/
			}).then(success => {
				resolve(true)	
			}).catch(exception => {
				console.log(exception)
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}	

	inUsers(transaction, userCredentials){
		return transaction.one('INSERT INTO "Users"("First Name", "Middle Name", "Last Name", "Email", "Country") \
													  VALUES ($1, $2, $3, $4, $5) RETURNING "User ID"',
																  [userCredentials.firstName, userCredentials.middleName, userCredentials.lastName, 
																	userCredentials.email, userCredentials.country]);
	}

	inUserPasswords(transaction, userCredentials, userID){
		const passwordCredentials = this.createPassword(userCredentials.password);

		return transaction.none('INSERT INTO "User Passwords"("Dynamic Salt", "Password Hash", "User ID") \
													  VALUES ($1, $2, $3)',
													  [passwordCredentials.Salt, passwordCredentials.Hash, userID['User ID']]);
	}

	createPassword(inputPassword){
		const passwordCredentials = this.passwordCreator.create(inputPassword, 'sha512')

		return passwordCredentials;
	}

	inUserPaymentKeys(transaction, userPaymentCredentials, userID){
		return transaction.one('INSERT INTO "User Payment Keys"("User Payment Customer ID", \
																				"User Payment Connect ID", "User ID")\
													  VALUES ($1, $2, $3) RETURNING "User Payment Keys ID"', 
														[userPaymentCredentials.customer.ID, userPaymentCredentials.connect.ID, userID['User ID']]);

	}

	inUserPaymentConnectKeys(transaction, userPaymentConnectKeys, userPaymentKeysID){
		return transaction.none('INSERT INTO "User Payment Connect Keys"("User Connect Public Key", "User Connect Secret Key", \
																				 "User Payment Keys ID") \
													  VALUES ($1, $2, $3)', [userPaymentConnectKeys.publishable, 
																		               userPaymentConnectKeys.secret, 
																								   userPaymentKeysID['User Payment Keys ID']]);

	}

	fromCountries(transaction, countryCode){
		return transaction.one('SELECT ("Country Name") FROM "Countries" WHERE ("Country Code" = $1)', [countryCode]);
		
	}

	inUsersAddress(transaction, country, userID){
		return transaction.none('INSERT INTO "Users Address" ("User Country", "User ID") VALUES ($1, $2)', [country, userID]);
	}
}

module.exports = DatabaseUserCreator;
