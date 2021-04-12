const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MIRegistrySchema = new Schema(
	{
		fgis_id: {type: Number, required: true},
		registry_number: {type: String, required: true},
		name: {type: String, required: true},
		types: [{type: String}],
		manufacturer_total: {type: String, required: true},
		manufacturer: [ {
			country: {type: String},
			location: {type: String},
			notice: {type: String},
			name: {type: String},
		} ],
		type_description: {type: String},
		verification_document: {type: String},
		procedure: {type: String},
		mi_info: {type: String},
		certificate_life: {type: Date},
		serial_number: {type: String},
		verification_interval: {type: String},
		periodic_verification: {type: String},
		interval_years: {type: Number},
		interval_months: {type: Number},
		mi_status: {type: String},
		publication_date: {type: Date},
		record_number: {type: Number},
		party_verification: {type: String},
		status: {type: String},
	},
	{
		versionKey: false,
	},
)

module.exports = mongoose.model('mi_registry', MIRegistrySchema)
