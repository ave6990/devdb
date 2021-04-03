const fgis = require('../api/fgis_api')

const getData = async () => {
	let res = [1,2 ,3]
	const filter_obj = {
		pageNumber: 10000,
		pageSize: 3,
		orgID: 'CURRENT_ORG',
	}
	const data = await fgis.registryRecords(filter_obj)
	for (const [i, item] of data.items.entries()) {
		const record = await fgis.registryRecord(item.id)
		res[i] = parseData(extractFields(record))
	}
	return res
}

const extractFields = (record) => {
	let res = []
	for (const section of record.sections) {
		res.push(...section.fields)
	}
	return res
}

const getValue = (fields, name) => {
	const vals = fields.filter( (field) => {
		return field.name == name
	} )
	if (vals.length > 0) {
		return vals[0].value
	} else {
		return undefined
	}
}

const getObjects = (value, data_fields, fgis_fields) => {
	let manufacturer_obj = []
	for (const [i, fields] of value.entries()) {
		obj = {}
		for (const [i, field] of data_fields.entries()) {
			obj[field] = getValue(fields.fields, fgis_fields[i])
		}
		manufacturer_obj[i] = obj
	}
	return manufacturer_obj
}

const parseData = (fields) => {
	const data = {}
	const data_fields = ['registry_number', 'name', 'type',
		'manufacturer_first', 'manufacturer', 'type_description',
		'verification_document', 'procedure', 'info', 'certificate_life',
		'serial_number', 'verification_interval', 'periodic_verification',
		'interval_years', 'interval_months', 'status']
	const fgis_fields = ['foei:NumberSI', 'foei:NameSI', 'foei:DesignationSI',
		'foei:ManufacturerTotalSI', 'foei:SI2_assoc', 'foei:DescriptionSI',
		'foei:MethodVerifSI', 'foei:ProcedSI', 'foei:SvedenSI',
		'foei:CertificateLifeSI', 'foei:FactoryNumSI', 'foei:MPISI',
		'foei:NextVerifSI', 'foei:YearSI', 'foei:MonthsSI', 'foei:StatusSI']
	const data_manufacturer_fields = ['country', 'location', 'notice', 'name']
	const fgis_manufacturer_fields = ['foei:CountrySI', 'foei:SettlementSI',
		'foei:UvedSI', 'foei:ManufacturerSI']
	for( const [i, field] of data_fields.entries()) {
		if (field == 'manufacturer') {
			let manufacturer = getValue(fields, fgis_fields[i])
			data[field] = getObjects(manufacturer, data_manufacturer_fields,
				fgis_manufacturer_fields)
		} else {
			data[field] = getValue(fields, fgis_fields[i])
		}
	}
	return data
}

const f = async () => {
	const data = await getData()
	console.log(data[0])
}

f()

module.exports = { getData }
