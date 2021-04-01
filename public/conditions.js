$(document).ready(() => {
//	$.ajax({
//		
//	})

	$('#btn_write').click(() => {
		console.log('Clicked')
		let data = {
			date: $('#tb_date').val(),
			location: $('#tb_location').val(),
			temperature: $('#tb_temperature').val(),
			hummidity: $('#tb_hummidity').val(),
			pressure: $('#tb_pressure').val(),
			other: $('#tb_other').val(),
		}
		$.ajax({
			url: 'conditions',
			method: 'POST',
			cache: false,
			contentType: 'application/json',
			encoding: 'utf-8',
			data: JSON.stringify(data),
			success: (data) => {
				$('#status_info').text(data.message)
			},
			error: () => {
				$('#status_info').text('Error.')
			},
			complete: () => {

			},
		})
	})
})
