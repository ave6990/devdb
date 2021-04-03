const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MIRegistrySchema = new Schema(
	{
		registry_number: {type: String, required: true},
		name: {type: String, required: ture},
		type: {type: String, required: ture},
		manufacturer_first: {type: String, required: ture},
		manufacturer: [ {
			country: {type: String, required: ture},
			location: {type: String, required: ture},
			notice: {type: String, required: ture},
			name: {type: String, required: ture},
		} ],
		type_description: {type: String, required: ture},
		verification_document: {type: String, required: ture},
		procedure: {type: String, required: ture},
		info: {type: String, required: ture},
		certificate_life: {type: Date, required: ture},
		serial_number: {type: String, required: ture},
		verification_interval: {type: String, required: ture},
		periodic_verification: {type: String, required: ture},
		interval_years: {type: Number, required: ture},
		interval_months: {type: Number, required: ture},
		status: {type: String, required: ture},
	},
	{
		versionKey: false,
	},
)

module.exports = mongoose.model('mi_registry', MIRegistrySchema)
