const form = document.forms.from_fgis
const button = form.elements.btn_from_fgis

// XLSX.json_to_xlsx Данные из ФГИС вывести на страницу в виде таблицы.

button.onclick = async () => {
	const name_listbox = form.elements.verifier
//	const name = name_listbox[name_listbox.selectedIndex].value
	const res_filter = {
		fq: {
			verification_year: form.elements.tb_verification_year.value,
			org_title: encodeURI(`*${form.elements.tb_organisation.value}*`)
		},
		q: '*',
//		fl: 'vri_id,org_title,mi.mitnumber,mi.mititle,mi.mitype,mi.modification,mi.number,verification_date,valid_date,applicability,result_docnum',
		sort: 'verification_date+desc,org_title+asc',
		rows: 20,
		start: 0,
	}

	$.ajax({
		url: 'from_fgis',
		method: 'POST',
		cache: false,
		contentType: 'application/json',
		encoding: 'utf-8',
		data: JSON.stringify({
			filter: res_filter,
		}),
		success: async (data) => {
			console.log('Successfull upload.')
			await console.log(data)
		},
		error: (err) => {
			console.log('Error occured: public/from_fgis.js')
		},
		complete: () => {
			console.log('Complete')
		}
	})
}
