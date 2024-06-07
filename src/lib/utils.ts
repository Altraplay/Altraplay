import sharp, { type FormatEnum } from 'sharp'
import s3Client from './S3'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { randomInt, randomString } from './random'
import pushLogs from './logs'

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

const optimizeImage = async (
	file: Buffer | ArrayBuffer,
	bucketName: string,
	size: string,
	customName?: string
) => {
	try {
		const formats = ['avif', 'webp']
		const fileName = customName || randomString(randomInt(5, 60))

		for (const format of formats) {
			const optimizedImageBuffer = await sharp(file)
				.resize(+size.split('x')[0], +size.split('x')[1])
				.toFormat(format as keyof FormatEnum)
				.toBuffer()

			if (Bun.env.AWS_SECRET_ACCESS_KEY) {
				await s3Client.send(
					new PutObjectCommand({
						Bucket: bucketName,
						Key: `${fileName}.${format}`,
						Body: optimizedImageBuffer,
						ContentType: `image/${format}`
					})
				)
			} else Bun.write(`../../static/${fileName}.${format}`, optimizedImageBuffer)
		}
		return fileName
	} catch (error) {
		pushLogs(`Error optimizing or uploading image: ${error}`)
	}
}

export { abbreviateNumber, formatTime, removeHtmlTags, optimizeImage }
