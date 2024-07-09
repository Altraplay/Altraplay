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
	following: string[]
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
	needs_for_next_level: number
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
	collect_history: boolean
	blocked?: string[]
	visibility: string[]
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
	duration: string
	likes: number
	dislikes: number
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
	created_at: Date
	slashtags: string[]
}

interface LikedByUser {
	user_id: string
	blogs: string[]
	posts: string[]
	comments: string[]
	videos: string[]
}

interface DislikedByUser {
	user_id: string
	blogs: string[]
	posts: string[]
	comments: string[]
	videos: string[]
}

interface Comment {
	id: string
	comment: string
	author: string
	likes: number
	dislikes: number
	comment_on: string
	time: Date
}

interface Reply {
	id: string
	comment_id: string
	reply: string
	author: string
	likes: number
	dislikes: number
	time: Date
}

interface Notification {
	id: string
	user_id: string
	title: string
	link: string
	type: string
	seen: boolean
	date: Date
}

interface LoggedInDevice {
	id: string
	user_id: string
	name: string
	ip: string
}

interface Credit {
	id: string
	video_id: string
	user: string
	role: string
}

interface Review {
	id: string
	service_id: string
	reviewer: string
	review: string
	rating: number
	time: Date
}

export interface Tables {
	users: User
	blogs: Blog
	posts: Post
	videos: Video
	messages: Message
	history: History
	search_history: SearchHistory
	collections: Collection
	services: Service
	liked_by_user: LikedByUser
	disliked_by_user: DislikedByUser
	comments: Comment
	replies: Reply
	notifications: Notification
	logged_in_devices: LoggedInDevice
	credits: Credit
	reviews: Review
}
