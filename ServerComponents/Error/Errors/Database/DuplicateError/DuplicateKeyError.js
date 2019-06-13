class DuplicateKeyError extends DatabaseError {
	constructor(){
		this.parent = 'DatabaseError';
		this.type = 'DuplicateError';
	}
}
