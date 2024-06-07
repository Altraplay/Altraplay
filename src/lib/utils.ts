function abbreviateNumber(value: number) {
	const units = ['', 'K', 'M', 'B', 'T', 'Q', 'QQ']
	const magnitude = Math.floor(Math.log10(Math.abs(value)) / 3)
	const unit = units[magnitude]
	const abbreviated = value / Math.pow(10, magnitude * 3)
	const abbreviatedNumber = abbreviated % 1 === 0 ? abbreviated.toFixed(0) : abbreviated.toFixed(1)

	return abbreviatedNumber + unit
}

export { abbreviateNumber }
