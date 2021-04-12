// dependece: JQuery

const addInputField = (parrent, name, title='', value='') => {
	if (title != '') {
		parrent.append(`<label>${title}<label>`)
	}
	parrent.append(`<input type='text' id=${name} value=${value}`)
}
