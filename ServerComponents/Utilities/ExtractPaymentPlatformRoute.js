function extractRouteFromPath(path) {
	const result = path.split('.');

	return result;
}

module.exports = extractRouteFromPath;
