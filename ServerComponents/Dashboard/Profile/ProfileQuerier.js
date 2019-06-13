'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');
const SanitizeNulls = require('../../Utilities/SanitizeNulls.js')

const Promise = require('bluebird');

class ProfileQuerier {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	queryProfile(email){
		return new Promise((resolve, reject) => {
			this.database.task('Query Profile', async task => {

				const userPersonalInfo = await this.fromUsers(task, email);
				const userAddressInfo = await this.fromUsersAddress(task, userPersonalInfo["User ID"]);

				const userProfileInformation = this.createProfilePersonalInformation(userPersonalInfo, userAddressInfo)

				const sanitizedUserProfileInformation = this.sanitizeProfileInformation(userProfileInformation);

				return sanitizedUserProfileInformation;
			}).then(userCredentials => {
				resolve(userCredentials);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	createProfilePersonalInformation(userPersonalInfo, userAddressInfo){
		if(userAddressInfo['0']){
			return {
				...userPersonalInfo,
				...userAddressInfo['0']
			}
		} else {
			return {
				...userPersonalInfo,
				'User Street Name': '',
				'User Street Number': '',
				'User Apt Number': '',
				'User City': '',
				'User State': '',
				'User Country': '',
				'User Zip Code': ''
			}
		}
	}

	sanitizeProfileInformation(userProfileInformation){
		const sanitizedProfileInformation = SanitizeNulls(userProfileInformation);
		const streetNumberString = sanitizedProfileInformation['User Street Number'].toString()
		const aptNumberString =  sanitizedProfileInformation['User Apt Number'].toString()
		
		const DOB = sanitizedProfileInformation['DOB']
		const finalDOB = this.transformDOB(DOB);

		sanitizedProfileInformation['User Street Number'] = streetNumberString;
		sanitizedProfileInformation['User Apt Number'] = aptNumberString;
		sanitizedProfileInformation['DOB'] = finalDOB;

		return sanitizedProfileInformation;
	}

	transformDOB(DOB){
		if(DOB !== ''){
			return DOB.toISOString().slice(0,10)
		} else {
			return DOB
		}
	}

	fromUsers(task, email){
		return task.one('SELECT "User ID", "First Name", "Middle Name", "Last Name", "Email", "DOB", "User Personal ID", "Phone Number" FROM "Users" WHERE ("Email" = $1)', [email]);
	}

	fromUsersAddress(task, userID){
		return task.any('SELECT "User Street Name", "User Street Number", "User Apt Number", "User City", "User State", "User Country", "User Zip Code" FROM "Users Address" WHERE ("User ID" = $1)', [userID]);
	}
}

module.exports = ProfileQuerier;
