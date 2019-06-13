function extractRouteFromPath(path) {
	const regex = new RegExp('[a-z_]+', 'g');
	const result = path.match(regex);

	return result;
}

module.exports = extractRouteFromPath;
