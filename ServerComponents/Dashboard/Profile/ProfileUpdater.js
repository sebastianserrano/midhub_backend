'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class ProfileUpdater {
	constructor(global){
		this.database = global.getDatabase();
		this.paymentPlatform = global.getPaymentPlatform();
		this.states = global.getStates();
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	updateProfile(body){
		return new Promise((resolve, reject) => {
			this.database.tx('Update Profile', async transaction => {

				const userInfo = this.createUserInfo(body);
				const addressInfo = this.createAddressInfo(body);

				this.checkAndSanitizeEmptyStrings(userInfo, addressInfo);

				const userID = await this.fromUsers(transaction, userInfo.Email)

				const connectID = await this.fromUserPaymentKeys(transaction, userID["User ID"])
				await this.updateIndividualInPaymentPlatform(connectID["User Payment Connect ID"], userInfo, addressInfo)

				await this.inUsers(transaction, userInfo);
				const addressExistance = await this.checkAddressExistance(transaction, userID['User ID'])

				if(addressExistance.length === 0){
					this.inUsersAddress(transaction, addressInfo, userID['User ID'])
				} else {
					this.updateUsersAddress(transaction, addressInfo, userID['User ID'])
				}


				return;
			}).then(userCredentials => {
				resolve(true);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}

	createUserInfo(body){
		const userInfo = {
			DOB: body.DOB,
			UserPersonalID: body.UserPersonalID,
			PhoneNumber: body.PhoneNumber,
			Email: body.Email,
		}

		return userInfo
	}

	createAddressInfo(body){
		const addressInfo = {
			StreetName: body.StreetName,
			StreetNumber: body.StreetNumber,
			AptNumber: body.AptNumber,
			City: body.City,
			State: body.State,
			Country: body.Country,
			Zip: body.Zip
		}

		return addressInfo;
	}

	checkAndSanitizeEmptyStrings(userInfo, addressInfo){
		if(userInfo["DOB"] === ''){
			userInfo["DOB"] = null;
		}

		if(addressInfo["StreetNumber"] === ''){
			addressInfo["StreetNumber"] = null;
		}

		if(addressInfo["AptNumber"] === ''){
			addressInfo["AptNumber"] = null;
		}
	}

	fromUsers(transaction, userEmail){
		return transaction.one('SELECT "User ID" FROM "Users" WHERE ("Email" = $1)', [userEmail]);
	}

	inUsers(transaction, userInfo){
		return transaction.none('UPDATE "Users" SET "DOB" = $1, "User Personal ID" = $2, "Phone Number" = $3 WHERE "Email" = $4', [userInfo.DOB, userInfo.UserPersonalID, userInfo.PhoneNumber, userInfo.Email]);
	}

	checkAddressExistance(transaction, userID){
		return transaction.any('SELECT "User ID" FROM "Users Address" WHERE "User ID" = $1', [userID])
	}

	inUsersAddress(transaction, addressInfo, userID){
		return transaction.none('INSERT INTO "Users Address" ("User Street Name", "User Street Number", "User Apt Number", "User City", "User State", "User Country", "User Zip Code", "User ID") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [addressInfo.StreetName, addressInfo.StreetNumber, addressInfo.AptNumber, addressInfo.City, addressInfo.State, addressInfo.Country, addressInfo.Zip, userID]);
	}

	updateUsersAddress(transaction, addressInfo, userID){
		return transaction.none( 'UPDATE "Users Address" SET "User Street Name" = $1, "User Street Number" = $2, \
											"User Apt Number" = $3, "User City" = $4, "User State" = $5, "User Country" = $6, \
											"User Zip Code" = $7 WHERE "User ID" = $8', [addressInfo.StreetName, addressInfo.StreetNumber, addressInfo.AptNumber, addressInfo.City, addressInfo.State, addressInfo.Country, addressInfo.Zip, userID])
	
	}

	fromUserPaymentKeys(task, userID){
		return task.one('SELECT "User Payment Connect ID" FROM "User Payment Keys" WHERE ("User ID" = $1)', [userID]);
	}

	updateIndividualInPaymentPlatform(connectID, userInfo, addressInfo){
		const payload = this.generatePaymentPlatformObject(userInfo, addressInfo)

		return this.paymentPlatform.accounts.update(connectID, {
			individual: payload
		})
	}

	generatePaymentPlatformObject(userInfo, addressInfo){
		const dob = (userInfo.DOB !== null) ? this.getDate(userInfo.DOB) : 0;
		const city = (addressInfo.City !== '') ? addressInfo.City : 0;
		const state = (addressInfo.State !== '') ? this.findState(addressInfo): 0;
		const apt = (addressInfo.AptNumber !== null) ? " Apt " + addressInfo.AptNumber : '';
		const line1 = (addressInfo.StreetNumber !== null) ? addressInfo.StreetNumber + " " + addressInfo.StreetName + apt : 0;
		const postal_code = (addressInfo.Zip !== '') ? addressInfo.Zip : 0;
		const phone = (userInfo.PhoneNumber !== '') ? userInfo.PhoneNumber : 0;
		const id_number = (userInfo.UserPersonalID !== '') ? userInfo.UserPersonalID : 0;

		return Object.assign({}, dob && { dob: { day: dob.day, month: dob.month, year: dob.year }},
														 (city || state || line1 || postal_code) && {
															 address:	Object.assign({},
																					city && { city : city },
																					state && { state: state },
																					line1 && { line1: line1 },
																					postal_code && { postal_code: postal_code }
																				 )
														 },
														 phone && { phone: phone },
														 id_number && { id_number: id_number})
	
	}

	findState(addressInfo){
		return this.states.find(state => state.state === addressInfo.State).code
	}

 	getDate(date){
    var day, month, year, result, dateSplitted;
    
    result = date.match("[0-9]{2}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{4}");
    if(null != result) {
        dateSplitted = result[0].split(result[1]);
        day = dateSplitted[0];
        month = dateSplitted[1];
        year = dateSplitted[2];
    }
    result = date.match("[0-9]{4}([\-/ \.])[0-9]{2}[\-/ \.][0-9]{2}");
    if(null != result) {
        dateSplitted = result[0].split(result[1]);
        day = dateSplitted[2];
        month = dateSplitted[1];
        year = dateSplitted[0];
    }
    
    if(month>12) {
        aux = day;
        day = month;
        month = aux;
    }
    
		return {
			year: year,
			month: month,
			day: day
		}
	}
}

module.exports = ProfileUpdater;
