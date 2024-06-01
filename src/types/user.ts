export interface User {
	username: string
	name: string
	bio: string
	email: string
	password: string
	followers: bigint
	following: string[]
	profile_picture: string
	banner: string
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
		| 'Mutant Rangers '
		| 'The Content Wizard'
		| 'The Majestic Dou'
		| 'The Majestic Trio '
		| 'The Majestic Squad '
		| 'Technology Demon'
		| 'Gaming Dragon'
	role:
		| 'Super Admin'
		| 'Basic Admin'
		| 'Moderator'
		| 'Premium User'
		| 'Diamond User'
		| 'User'
		| 'Admin'
		| 'Member'
		| 'Advertiser'
	points: bigint
	needs: bigint
	links: string[]
	verified: boolean
	skills: string[]
	language: string[]
	team: string[]
	notifications: Record<string, string>
	is_history_on: boolean
	liked: string[]
	disliked: string[]
	only_visible_to: string
	is_email_verified: boolean
	verification_token: string
	earning: Record<string, string>
	achievements: Record<string, string>
	joined: Date
}
