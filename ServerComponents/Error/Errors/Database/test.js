class DatabaseError extends Error {
	constructor(){
		super();
		this.type = 'Database';
	}
}

class DuplicateKeyError extends DatabaseError {
	constructor(){
		super();
		this.message = 'gT'
		this.type = 'DuplicateError';
	}
}


var duplicate = new DuplicateKeyError();
console.log(Object.getPrototypeOf(duplicate.constructor).name)

class X {}

class A extends X{}

class J extends A {}
    
class K extends J {}

class L extends K {}

function getBaseClass(targetClass){
	  if(targetClass instanceof Function){
			    let baseClass = targetClass;

			    while (baseClass){
						      const newBaseClass = Object.getPrototypeOf(baseClass);

						      if(newBaseClass && newBaseClass !== Object && newBaseClass.name){
										        baseClass = newBaseClass;
										      }else{
														        break;
														      }
						    }

			    return baseClass;
			  }
}

console.log(getBaseClass(L));
