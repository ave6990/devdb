const form = document.forms.upload
const button = form.elements.btn_upload

button.onclick = () => {
	let file = document.getElementById('file').files[0]
	file.text().then((res, err) => {
		console.log(res)
		$.ajax({
			url: 'upload',
			type: 'POST',
			cache: false,
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify({text: res}),
			success: (data) => {
				console.log('Successfull upload.')
			},
		})
	})
}
