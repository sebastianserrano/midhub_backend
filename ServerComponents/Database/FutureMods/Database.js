const EnvironmentPath= process.env.MIDHUB;
const DatabaseConnectionManager = require(EnvironmentPath + '/src/BackEnd/Database/DatabaseUtilities/DatabaseConnectionManager.js');

class Database {
	constructor(){
		try {
			this.database = this.initializeConnection();
		}
	}

	async initializeConnection(){
		const databaseConnectionManager = new DatabaseConnectionManager();
		const databaseConnection = await databaseConnectionManager.establishDatabaseConnection();

		return databaseConnection;
	}

	normalMode(){
		return new Promise(async (resolve, reject) => {
			try {
				const connection = this.databaseConnectionPoolManager.getNormalConnection()
				resolve(connection)
			} catch(exception) {
				reject(exception)
			}
		})
	}

	transactionMode(){
		return new Promise(async (resolve, reject) => {
			try {
				const connection = this.databaseConnectionPoolManager.getTransactionConnection()
				resolve(connection)
			} catch(exception) {
				reject(exception)
			}
		})
	}

	insertReturnNone(connection, statement, values){
		return new Promise(async (resolve, reject) => {
			try {
				const result = await connection.none(statement, values);
				resolve(true);
			} catch(exception) {
				reject(exception)
			}
		})
	}

	insertReturnOne(connection, statement, values){
		return new Promise(async (resolve, reject) => {
			try {
				const result = await connection.one(statement, values);
				resolve(result);
			} catch(exception) {
				reject(exception)
			}
		})
	}

	insertReturnMany(connection, statements, values){
		return new Promise(async (resolve,reject) => {
			try {
				const result = await connection.multi(statements, values);
				resolve(result)	
			} catch(exception){
				reject(exception)
			}
		})
		this.database.tx('Insert Many', transaction => {
			task.multi(queryArray, queryValues)	
		
		})	
	}

	calling insert many
	database.transactionMode.then(connection => {
		var resultOne = await database.insertReturnOne(connection, statement, values);
	}).catch(error => {
	
	})
}
