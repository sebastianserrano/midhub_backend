module.exports = function(object){
	for(let key of Object.keys(object)){
		if(object[key] === null){
			object[key] = "";
		}
	}
	return object;
}
