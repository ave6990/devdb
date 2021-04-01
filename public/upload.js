//$(document).ready(() => {
//	$('#upload_form').submit = ( () => {
//		const file = document.getElementById('file').files[0]
//		$(this).ajaxSubmit({
//			error: (err) => {
//				$('#status_info').empty().text('An error has occured.')
//			},
//			success: (res) => {
//				$('#status_info').empty().text(res)
//			},
//		})
//	})
//	return false
//})

//$('#btn_upload').click( async () => {
//	let fdata = new FormData()
//	const file = $('#input_file')[0].files[0]
//	fdata.append('uploadFile', file)
//	$('#status_info').empty().text(file.name)
//	let data = {
//		file: fdata,
//		name: file.name,
//	}
//
//	$.ajax({
//		url: 'upload',
//		data: JSON.stringify(data),
//		cache: false,
//		contentType: false,
//		processData: false,
//		method: 'POST',
//		success: (data) => {
//			$('#status_info').empty().text('Successfull uploaded!.')
//		},
//		error: (err) => {
//			$('#status_info').empty().text('Error!!!.')
//		},
//	})
//})
