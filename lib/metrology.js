class RangeConverter {
	constructor(s_min, s_max, d_min, d_max) {
		this.s_min = s_min
		this.s_max = s_max
		this.d_min = d_min
		this.d_max = d_max
	}

	convertTo(val) {
		return (val - this.s_min) * (this.d_max - this.d_min) / (this.s_max - this.s_min) + this.d_min
	}

	convertFrom(val) {
		return (val - this.d_min) * (this.s_max - this.s_min) / (this.d_max - this.d_min) + this.s_min
	}
}

module.exports = { RangeConverter }
