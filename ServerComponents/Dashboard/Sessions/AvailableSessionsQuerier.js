'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class AvailableSessionsQuerier {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	querySessions(email){
		return new Promise((resolve, reject) => {
			this.database.task('Query Available Sessions', async task => {
				const userPersonalInfo = await this.fromUsers(task, email);
				const sessionIDSFromSessionUsers = await this.fromSessionUsers(task, userPersonalInfo["User ID"]);
				const sessionsInfo = [];

				for(let key in sessionIDSFromSessionUsers){
					var userID = userPersonalInfo["User ID"];
					var sessionID = sessionIDSFromSessionUsers[key]["Session ID"];
					var sessions = await this.fromSessions(task, sessionID)
					var file = await this.fromFiles(task, sessionID)
					var fileName;

					if(file.length === 1){
						fileName = file[0]["File Name"]
					} else {
						fileName = "";
					}

					for(let session in sessions){
						var withUserUserID = await this.userIDFromSessionUsers(task, sessionID, userID);
						var withUserPersonalInfo = await this.fromUsersWithUser(task, withUserUserID[0]["User ID"]);
						var paymentInfo = await this.fromPayments(task, sessionID)
						var sessionInfo = sessions[session]
						sessionInfo["Session ID"] = sessionID;
						var response = this.generateFullSessionInfo(withUserPersonalInfo, sessionInfo, paymentInfo, fileName)

						sessionsInfo.push(response)
					}
				}

				return sessionsInfo;
			}).then(sessionsInfo => {
				resolve(sessionsInfo);	
			}).catch(exception => {
				const error = this.databaseErrorHandler.detectError(exception);
				reject(error);
			})
		})
	}


	fromUsers(task, email){
		return task.one('SELECT "User ID" FROM "Users" WHERE ("Email" = $1)', [email]);
	}

	fromSessionUsers(task, userID){
		return task.any('SELECT "Session ID" FROM "Session Users" WHERE ("User ID" = $1)', [userID]);
	}

	userIDFromSessionUsers(task, sessionID, userID){
		return task.any('SELECT "User ID" FROM "Session Users" WHERE ("Session ID" = $1 AND "User ID" != $2)', [sessionID, userID])
	
	}

	fromUsersWithUser(task, userID){
		return task.one('SELECT "First Name", "Middle Name", "Last Name", "Email" FROM "Users" WHERE ("User ID" = $1)', [userID]);
		
	}

	fromSessions(task, sessionID){
		return task.any('SELECT "Session Name", "Session Creator", "Funds Loaded", "File Uploaded" FROM "Sessions" WHERE ("Session ID" = $1 AND "Available" = $2)', [sessionID, true])
	}

	fromFiles(task, sessionID){
		return task.any('SELECT "File Name" FROM "Files" WHERE ("Session ID" = $1)', [sessionID]);
	}

	fromPayments(task, sessionID){
		return task.any('SELECT "Payment Amount", "Payment Currency" FROM "Payments" WHERE ("Session ID" = $1)', [sessionID])
	}

	generateFullSessionInfo(withUserInfo, sessionInfo, paymentInfo, fileName){
		const withUserArray = this.generateWithUserInfoArray(withUserInfo)
		const email = withUserArray.pop()
		const fullName = this.generateNameFromInfo(withUserArray)
		const response = this.generateFinalResponse(email, fullName, sessionInfo, paymentInfo, fileName)

		return response;
	}

	generateFinalResponse(email, fullName, sessionInfo, paymentInfo, fileName){

		var sessionAmount;
		var sessionCurrency;

		if(paymentInfo[0]){
			sessionAmount = paymentInfo[0]["Payment Amount"]		
			sessionCurrency = paymentInfo[0]["Payment Currency"]	
		} else {
			sessionAmount = 0		
			sessionCurrency = 0
		}

		return {
			sessionCreator: sessionInfo["Session Creator"],
			sessionAmount: sessionAmount,
			sessionCurrency: sessionCurrency,
			sessionID: sessionInfo["Session ID"],
			sessionName: sessionInfo["Session Name"],
			withUser: fullName,
			withUserEmail: email,
			fundsLoaded: sessionInfo["Funds Loaded"],
			fileUploaded: sessionInfo["File Uploaded"],
			fileName: fileName
		}
	}

	generateWithUserInfoArray(info){
		var index = 0;
		const fullNameArray = [];
		for(let key in info){
			fullNameArray[index] = info[key]
			index++;
		}
		return fullNameArray;
	}

	generateNameFromInfo(infoArray){
		var fullName;
		if(infoArray[1] === ''){
			infoArray.splice(1, 1)
			fullName = infoArray.join(' ')
		} else {
			fullName = infoArray.join(' ')
		}
		return fullName
	}
}

module.exports = AvailableSessionsQuerier;
