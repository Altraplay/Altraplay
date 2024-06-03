export interface Blog {
	id: string
	title: string
	author: string
	content: string
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
	images?: string[]
	visible_to: string[]
	categories: string[]
	published_at: Date
}
