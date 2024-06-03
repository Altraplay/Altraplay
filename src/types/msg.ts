export interface Message {
	id: string
	sender: string
	receiver: string
	message: string
	read: boolean
	reply_of: string
	edited: boolean
	sent_at: Date
}
