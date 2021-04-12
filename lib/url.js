const getUrl = (url, filter_obj) => {
	if (filter_obj) {
		url += '?'

		for (let item in filter_obj) {
			if (typeof(filter_obj[item]) == 'object') {
				for (let opt in filter_obj[item]) {
					url += `${item}=${opt}:${filter_obj[item][opt]}&`
				}
			} else {
				url += `${item}=${filter_obj[item]}&`
			}
		}
	}
	return url
}

module.exports = { getUrl }
module.exports.test = { getUrl }
