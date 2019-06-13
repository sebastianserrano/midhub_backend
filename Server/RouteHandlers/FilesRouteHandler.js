const Files = require('../../ServerComponents/Files/Files.js');

class FilesRouteHandler {
	constructor(global) {
		this.files = new Files(global);
	}

	async handleRequest(routes, body){
		switch(routes[1]) {
			case 'file_link':
				var response = await this.files.retrieveFileLink(body);

				return response;
			default:
				break;
		}
	}
}

module.exports = FilesRouteHandler;
