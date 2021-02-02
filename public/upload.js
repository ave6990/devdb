const form = document.forms.upload
const button = form.elements.btn_upload

button.onclick = () => {
	let file = document.getElementById('file').files[0]
	file.text().then((res, err) => {
		$.ajax({
			url: 'upload',
			type: 'POST',
			cache: false,
			dataType: 'json',
			contentType: 'application/json',
			encoding: 'utf-8',
			data: JSON.stringify({csv: res}),
			success: (data) => {
				console.log('Successfull upload.')
			},
		})
	})
}
