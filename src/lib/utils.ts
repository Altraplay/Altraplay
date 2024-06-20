import crypto from 'crypto'

function abbreviateNumber(value: number) {
	const units = ['', 'K', 'M', 'B', 'T', 'Q', 'QQ']
	const magnitude = Math.floor(Math.log10(Math.abs(value)) / 3)
	const unit = units[magnitude]
	const abbreviated = value / Math.pow(10, magnitude * 3)
	const abbreviatedNumber = abbreviated % 1 === 0 ? abbreviated.toFixed(0) : abbreviated.toFixed(1)

	return abbreviatedNumber + unit
}

function formatTime(date: Date) {
	const currentDate = new Date()
	const targetDate = new Date(date.getTime())

	const difference = targetDate.getTime() - currentDate.getTime()

	const seconds = difference / 1000
	const minutes = seconds / 60
	const hours = minutes / 60
	const days = hours / 24

	const currentYear = currentDate.getUTCFullYear()
	const currentMonth = currentDate.getUTCMonth()
	const currentDay = currentDate.getUTCDate()

	const targetYear = targetDate.getUTCFullYear()
	const targetMonth = targetDate.getUTCMonth()
	const targetDay = targetDate.getUTCDate()

	const yearDifference = targetYear - currentYear
	const monthDifference = targetMonth - currentMonth + yearDifference * 12
	const dayDifference = targetDay - currentDay

	const preciseMonths = monthDifference + dayDifference / 30
	const preciseYears = yearDifference + monthDifference / 12

	const roundedMonths = Math.round(preciseMonths * 10) / 10
	const roundedYears = Math.round(preciseYears * 10) / 10

	const relativeTimeFormatter = new Intl.RelativeTimeFormat(undefined, {
		numeric: 'auto',
		style: 'long'
	})

	if (Math.abs(roundedYears) >= 1) {
		return relativeTimeFormatter.format(roundedYears, 'year')
	} else if (Math.abs(roundedMonths) >= 1) {
		return relativeTimeFormatter.format(roundedMonths, 'month')
	} else if (Math.abs(days) >= 1) {
		return relativeTimeFormatter.format(Math.round(days), 'day')
	} else if (Math.abs(hours) >= 1) {
		return relativeTimeFormatter.format(Math.round(hours), 'hour')
	} else if (Math.abs(minutes) >= 1) {
		return relativeTimeFormatter.format(Math.round(minutes), 'minute')
	} else {
		return relativeTimeFormatter.format(Math.round(seconds), 'second')
	}
}
function removeHtmlTags(text: string): string {
	return text.replace(/<[^>]*>?/gm, '')
}

const encrypt = (text: string, secretKey: string) => {
	try {
		const iv = crypto.randomBytes(16)
		const key = crypto.createHash('sha256').update(secretKey).digest('base64').substr(0, 32)
		const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

		let encrypted = cipher.update(text)
		encrypted = Buffer.concat([encrypted, cipher.final()])
		return iv.toString('hex') + ':' + encrypted.toString('hex')
	} catch (error) {
		console.log(error)
	}
}


export { abbreviateNumber, formatTime, removeHtmlTags, encrypt }
