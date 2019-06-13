'use strict';

const DatabaseErrorHandler = require('../../Error/ErrorHandler/DatabaseErrorHandler.js');

const Promise = require('bluebird');

class OpenSessionsQuerier {
	constructor(database){
		this.database = database;
		this.databaseErrorHandler = new DatabaseErrorHandler();
	}

	querySessions(email){
		return new Promise((resolve, reject) => {
			this.database.task('Query Sessions', async task => {
				const userPersonalInfo = await this.fromUsers(task, email);
				const sessionIDSFromSessionUsers = await this.fromSessionUsers(task, userPersonalInfo["User ID"]);
				const sessionsInfo = [];

				for(let key in sessionIDSFromSessionUsers){
					var sessionID = sessionIDSFromSessionUsers[key]["Session ID"];
					var paymentInfo = await this.fromPayments(task, sessionID)
					var sessionInfo = await this.fromSessions(task, sessionID)

					if((paymentInfo.length === 1) && (sessionInfo.length === 1)){
						var fileName = await this.fromFiles(task, sessionID)
						var sessionInfo = await this.fromSessions(task, sessionID)
						var userID = userPersonalInfo["User ID"];
						var withUserUserID = await this.userIDFromSessionUsers(task, sessionID, userID);
						for(let key in withUserUserID){
							var withUserPersonalInfo = await this.fromUsersWithUser(task, withUserUserID[key]["User ID"]);
							var response = this.generateFullSessionInfo(withUserPersonalInfo, sessionInfo, paymentInfo, fileName["File Name"])

							sessionsInfo.push(response)
						}
					}
				}

				return sessionsInfo;
			}).then(sessionsInfo => {
				resolve(sessionsInfo);	
			}).catch(exception => {
				console.log(exception)
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
		return task.any('SELECT "Session ID", "Session Name", "Session Duration", "Session Creation Date" FROM "Sessions" WHERE ("Session ID" = $1 AND "Available" = $2 AND "Session Expired" = $3 AND "File Uploaded" = $4)', [sessionID, false, false, true])
	}

	fromFiles(task, sessionID){
		return task.one('SELECT "File Name" FROM "Files" WHERE ("Session ID" = $1)', [sessionID]);
	}

	fromPayments(task, sessionID){
		return task.any('SELECT "Payment Capture", "Payment Amount", "Payment Currency" FROM "Payments" WHERE ("Session ID" = $1 AND "Payment Capture" = $2 AND "Payment Status" = $3)', [sessionID, false, "In Progress"])
	}

	generateFullSessionInfo(withUserInfo, sessionInfo, paymentInfo, fileName){
		const withUserArray = this.generateWithUserInfoArray(withUserInfo)
		const email = withUserArray.pop()
		const fullName = this.generateNameFromInfo(withUserArray)
		const response = this.generateFinalResponse(email, fullName, sessionInfo, paymentInfo, fileName)

		return response;
	}

	generateFinalResponse(email, fullName, sessionInfo, paymentInfo, fileName){
		const originalDate = sessionInfo[0]["Session Creation Date"].toString();
		const date = originalDate.substring(0,24)

		return {
			sessionID: sessionInfo[0]["Session ID"],
			sessionName: sessionInfo[0]["Session Name"],
			withUser: fullName,
			withUserEmail: email,
			date: date,
			duration: sessionInfo[0]["Session Duration"],
			amount: paymentInfo[0]["Payment Amount"],
			currency: paymentInfo[0]["Payment Currency"],
			capture: false,
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

module.exports = OpenSessionsQuerier;
