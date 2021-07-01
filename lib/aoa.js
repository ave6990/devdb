const jsonToAOA = (data, fields = [], header = []) => {
	// prepare data to use as input data in XLsX.utils.aoa_to_json
	let res = []

	if (header.length == 0) {
		if (fields.length == 0) {
			res[0] = Object.keys(data[0])
		} else {
			res[0] = fields
		}
	} else {
		res[0] = header
	}

	for (const row of data) {
		let vals = []

		if (fields.length == 0) {
			fields = Object.keys(row)
		}

		for (const field of fields) {
			vals.push(row[field])
		}
		res.push(vals)
	}

	return res
}

export { jsonToAOA }
