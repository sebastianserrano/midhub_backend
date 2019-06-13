class DatabaseError extends Error {
	constructor(){
		super();
		this.type = 'Database'
	}
}

module.exports = DatabaseError;
