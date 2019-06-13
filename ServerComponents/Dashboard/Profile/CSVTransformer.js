'use strict';

const fs = require('fs');
const Promise = require('bluebird');

class CSVTransformer {
	constructor(){
	}

	transformCSVWithName(name){
		return new Promise((resolve, reject) => {
			fs.readFile(name,function (error,data) {
				if(error){
					reject();
				}
				var bufferString = data.toString(); 

				var arr = bufferString.split('\n');     

				var jsonObj = [];
				var headers = arr[0].split(',');
				for(var i = 1; i < arr.length; i++) {
					var data = arr[i].split(',');
					var obj = {};
					for(var j = 0; j < data.length; j++) {
						 obj[headers[j].trim()] = data[j].trim();
					}
					jsonObj.push(obj);
				}

				resolve(jsonObj)
			})
		})
	}
}

module.exports = CSVTransformer;
