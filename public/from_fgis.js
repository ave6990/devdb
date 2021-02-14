const form = document.forms.from_fgis
const button = form.elements.btn_run

button.onclick = async () => {
	const file = document.getElementById('file').files[0]
	const data = await get_data(file)
	const db_listbox = $('#db_listbox')
//	const db_name = db_listbox[db_listbox.selectedIndex].value

	$.ajax({
		url: 'upload',
		method: 'POST',
		cache: false,
		contentType: 'application/json',
		encoding: 'utf-8',
		data: JSON.stringify({
			name: file.name,
			csv: data
		}),
		success: (data) => {
			console.log('Successfull upload.')
		},
		error: (err) => {
			console.log('Error occured')
		},
		complete: () => {
			console.log('Complete')
		}
	})
}

const get_data = async (file) => {
	const suffix = (name) => {
		const s_name = name.split('.')
		return s_name[s_name.length - 1]
	}

	if (['xlsx', 'xls'].indexOf(suffix(file.name)) != -1) {
		console.log('Not supported yet.')
	} else {
		return file.text()
	}
}
