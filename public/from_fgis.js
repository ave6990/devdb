const form = document.forms.from_fgis
const btn_search = form.elements.btn_from_fgis
const btn_forward = form.elements.btn_forward
const btn_back = form.elements.btn_back
const tb_page = form.elements.tb_page
let journal = ''

let config = {
	records_count: 0,
	rows_count: 20,
	page_num: 0,
	pages_count: 0
}

const show_page_num = () => {
	tb_page.value = config.page_num + 1
	$('#lbl_page').html(` из ${parseInt(config.records_count / config.rows_count) + 1}`)
}

const json_to_aoa = (data) => {
	let res = []
	let i = 0
	res[i] = ['№ п/п', 'Номер счета', 'Модификация', 'Номер_ГРСИ', 'Зав. №', 'Год выпуска', 'Номер документа ФИФ', 'Запись в ФИФ']
	data.forEach((row) => {
		i += 1
		res[i] = [row['number'], row['count_number'], row['modification'], row['registry_number'], row['serial_number'],
			row['manufacture_year'], row['fgis_result_docnum'], get_record_fif(row['fgis_vri_id'])]
	})
	return res
}

const get_record_fif = (num) => {
	return `https://fgis.gost.ru/fundmetrology/cm/results/${num}`
}

const renderXLSX = async (data) => {
	let result
	let records = await data.fgis.docs
	const workSheet = await XLSX.utils.aoa_to_sheet(json_to_aoa(data.fgis.docs))
	const table = await XLSX.utils.sheet_to_html(workSheet)
	$('#upload_comment').html(`Найдено ${data.fgis.numFound} записей.`)
	$('#out_data').html(table)
}

btn_forward.onclick = async () => {
	if (config.rows_count < config.records_count && config.page_num * config.rows_count < config.records_count) {
		console.log('Process next page')
		config.page_num += 1
		btn_search.onclick()
		show_page_num()
	}
}

btn_back.onclick = async () => {
	if (config.rows_count < config.records_count && config.page_num > 0) {
		console.log('Process previous page')
		config.page_num -= 1
		btn_search.onclick()
		show_page_num()
	}
}

tb_page.onchange = async () => {
	let num = parseInt(tb_page.value)
	let pages = parseInt(config.records_count / config.rows_count) + 1

	if (num < 1) num = 1
	if (num > pages) num = pages

	config.page_num = num - 1
	btn_search.onclick()
	show_page_num()
}

btn_search.onclick = async () => {
	const name_listbox = form.elements.verifier
	const res_filter = {
		fq: {
			verification_year: form.elements.tb_verification_year.value,
			org_title: encodeURI(`*${form.elements.tb_organisation.value}*`),
			'mi.number': `*${form.elements.tb_mi_serial_number.value}*`,
			'mi.mitnumber': `*${form.elements.tb_mi_type_number.value}*`,
		},
		q: '*',
		fl: 'vri_id,mi.mitnumber,mi.mitype,mi.modification,mi.number,verification_date,valid_date,result_docnum',
		sort: 'verification_date+desc,org_title+asc',
		rows: 99000,	//config.rows_count,
		start: 0,		//config.rows_count * config.page_num,
	}

	$.ajax({
		url: 'from_fgis',
		method: 'POST',
		cache: false,
		contentType: 'application/json',
		encoding: 'utf-8',
		data: JSON.stringify({
			filter: res_filter,
			journal: journal,
		}),
		success: async (data) => {
			console.log('Successfull upload.')
			config.records_count = data.fgis.numFound
			show_page_num()
			await renderXLSX(data)
		},
		error: (err) => {
			$('#upload_comment').html('Ошибка выгрузки!')
			console.log('Error occured: public/from_fgis.js')
		},
		complete: () => {
			console.log('Complete')
			$('#file').value = null
		}
	})
}

$('#file').change(async () => {
	const file = document.getElementById('file').files[0]
	journal = await file.text()
	console.log('Uploaded')
})

const get_json = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = (obj) => {
			console.log(obj)
			const data = obj.target.result
			console.log(data)
			// some error
			const wb = XLSX.read(data, {type: 'binary'})
			console.log(wb)
			resolve(XLSX.utils.sheet_to_json(wb.Sheets.Sheet1))
		}
		reader.readAsBinaryString(file)
	})
}
