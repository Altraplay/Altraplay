interface Comment {
	id: string
	comment: string
	author: string
	likes: number
	dislikes: number
	time: Date
	replies: {
		id: string
		reply: string
		author: string
		likes: number
		dislikes: number
		time: Date
	}[]
}

interface User {
	id: string
	username: string
	name: string
	password: string
	email: string
	bio?: string
	profile_picture: string
	banner: string
	followers: string[]
	following?: string[]
	interests: string[]
	points: number
	level:
		| 'The Cosmic Lion'
		| 'King of Content'
		| 'Neon Ninja'
		| 'Electric Knight'
		| 'The Blazing Beacon'
		| 'Dashing Diamond'
		| 'Legion of Content'
		| 'Silent Soul'
		| 'Neon Dragon'
		| 'The Blazing Souls of Creators'
		| 'Cyber Soul'
		| 'Mutant Rangers'
		| 'The Content Wizard'
		| 'The Majestic Dou'
		| 'The Majestic Trio'
		| 'The Majestic Squad'
		| 'Technology Demon'
		| 'Gaming Dragon'
	needs_for_next_level: string
	roles: [
		'Super Admin' | 'Moderator' | 'Premium User' | 'Diamond User' | 'User' | 'Admin' | 'Advertiser'
	]
	links: string[]
	skills?: {
		name: string
		level: number
	}[]
	languages?: {
		name: string
		level: number
	}[]
	verified: boolean
	team: {
		user_id: string
		role: string
	}[]
	is_email_verified: boolean
	otp?: string
	notifications?: {
		id: string
		title: string
		link: string
		type: string
		seen: boolean
		date: Date
	}[]
	collect_history: boolean
	liked?: {
		blogs: string[]
		posts: string[]
		comments: string[]
		videos: string[]
	}
	disliked?: {
		blogs: string[]
		posts: string[]
		comments: string[]
		videos: string[]
	}
	blocked?: string[]
	visibility: string[]
	logged_in_devices: {
		name: string
		ip: string
	}[]
	earning?: number
	achievements?: string[]
	joined_at: Date
}

interface Blog {
	id: string
	title: string
	content: string
	author: string
	cover: string
	likes: number
	dislikes: number
	comments?: Comment[]
	visibility: string[]
	slashtags: string[]
	views: number
	created_at: Date
}

interface Post {
	id: string
	caption: string
	url: string
	posted_by: string
	likes: number
	dislikes: number
	comments?: Comment[]
	visibility: string[]
	slashtags: string[]
	views: number
	created_at: Date
}

interface Video {
	id: string
	title: string
	description: string
	url: string
	cover: string
	creator: string
	credits: {
		user: string
		role: string
	}[]
	duration: string
	likes: number
	dislikes: number
	comments?: Comment[]
	visibility: string[]
	slashtags: string[]
	views: number
	created_at: Date
}

interface Message {
	id: string
	sender: string
	receiver: string
	status: string
	type: string
	message: string
	sent_at: Date
}

interface History {
	id: string
	user_id: string
	type: string
	url: string
	time: Date
}

interface SearchHistory {
	id: string
	user_id: string
	query: string
	time: Date
}

interface Collection {
	id: string
	owner: string
	name: string
	description: string
	visibility: string[]
	urls: string[]
	created_at: Date
}

interface Service {
	id: string
	provider: string
	title: string
	description: string
	price: string
	reviews: {
		reviewer: string
		review: string
		rating: number
		time: Date
	}[]
	created_at: Date
	slashtags: string[]
}

export interface Tables {
	users: User
	blogs: Blog
	posts: Post
	videos: Video
	messages: Message
	histories: History
	search_histories: SearchHistory
	collections: Collection
	services: Service
}
