import mongoose from 'mongoose'
const Schema = mongoose.Schema

const VisitShema = new Schema( {
    visit_id: {type: Number, required: true},
    date: {type: Date, required: true},
    count_number: {type: String, required: false},
    auto_id: {type: Number, required: true},
    start_mileage: {type: Number, required: true},
    end_mileage: {type: Number, required: true},
    start_volume: {type: Number, required: true},
    fill: {type: Number, required: false},
    standard: {type: Number, required: true},
}, )

const Visits = mongoose.model('visits', VisitSchema)

export { Visits }
