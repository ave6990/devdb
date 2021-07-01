import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ConditionSchema = new Schema(
	{
		date: {type: String, required: true},
		location: {type: String, required: true},
		temperature: {type: Number, required: true},
		hummidity: {type: Number, required: true},
		pressure: {type: Number, required: true},
		other: {type: String},
	},
	{
		versionKey: false,
	},
)

const Condition = mongoose.model('condition', ConditionSchema)

export { Condition }
