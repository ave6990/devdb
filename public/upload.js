const form = document.forms.upload
const button = form.elements.btn_upload

button.onclick = async () => {
	const file = document.getElementById('file').files[0]
	console.log(file.name)
	const data = await file.text()
	$.ajax({
		url: 'upload',
		method: 'POST',
		cache: false,
		dataType: 'json',
		contentType: 'application/json',
		encoding: 'utf-8',
		data: JSON.stringify({
			name: file.name,
			csv: data
		}),
		success: (data) => {
			console.log('Successfull upload.')
		},
		error: () => {
			console.log('Error occured')
		},
		complete: () => {
			console.log('Complete')
		}
	})
}
