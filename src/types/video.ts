export interface Video {
	id: string
	title: string
	url: string
	creator: string
	description: string
	cover: string
	likes: number
	dislikes: number
	views: number
	comments?: {
		who: string
		msg: string
		date: Date
		replies?: {
			who: string
			msg: string
			date: Date
		}[]
	}[]
	tags: string[]
	visible_to: string[]
	categories: string[]
	published_at: Date
}
