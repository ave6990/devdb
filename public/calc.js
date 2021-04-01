$(document).ready(() => {
	addField($('#tb_count').val())

	$('#tb_count').change( () => {
		addField($('#tb_count').val())
	})

	$('#btn_calc').click(() => {
		let values = readData()
		let data = {values: values}

		$.ajax({
			url: 'calc',
			method: 'POST',
			cache: false,
			contentType: 'application/json',
			encoding: 'utf-8',
			data: JSON.stringify(data),
			success: (data) => {
				$('#out_data').html('СКО = ' + data.sko)
			},
			error: () => {
				$('#status_info').text('Error.')
			},
			complete: () => {

			},
		})
	})
})

const addField = (count) => {
	$('#input_data').empty()
	let l = [10.5, 11, 10.6, 10.4, 10.9, 10.6, 10.9, 10.7, 10.8, 10.9]
	for (let i = 0; i < count; i++) {
		$('#input_data').append('<div>').append(`<input type="text" id="input_${i}" value="${l[i]}"/>`)
	}
}

const readData = () => {
	let data = []
	for (let i = 0; i < $('#tb_count').val(); i++) {
		data[i] = $(`#input_${i}`).val()
	}
	return data
}
