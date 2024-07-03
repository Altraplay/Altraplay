import db from './orm'

async function push() {
	db.schema({
		users: {
			columns: {
				id: { type: 'text', isPrimaryKey: true },
				username: { type: 'text', index: true },
				name: 'text',
				password: 'text',
				email: { type: 'text', index: true },
				bio: 'text',
				profile_picture: 'text',
				banner: 'text',
				followers: 'list<text>',
				following: 'list<text>',
				interests: 'list<text>',
				points: 'bigint',
				level: 'text',
				needs_for_next_level: 'bigint',
				roles: 'list<text>',
				links: 'list<text>',
				skills: { type: [{ name: 'text', level: 'int' }] },
				languages: { type: [{ name: 'text', level: 'int' }] },
				verified: 'boolean',
				team: { type: [{ user_id: 'text', role: 'text' }] },
				is_email_verified: { type: 'boolean', index: true },
				otp: 'text',
				collect_history: 'boolean',
				blocked: 'list<text>',
				visibility: 'list<text>',
				earning: 'bigint',
				achievements: 'list<text>',
				joined_at: { type: 'timestamp', index: true }
			}
		},
		blogs: {
			columns: {
				id: { type: 'text', isPrimaryKey: true },
				title: 'text',
				content: 'text',
				author: { type: 'text', index: true },
				cover: 'text',
				likes: 'bigint',
				dislikes: 'bigint',
				visibility: 'list<text>',
				slashtags: 'list<text>',
				views: 'bigint',
				created_at: { type: 'timestamp', index: true }
			}
		},
		posts: {
			columns: {
				id: { type: 'text', isPrimaryKey: true },
				caption: 'text',
				url: 'text',
				posted_by: { type: 'text', index: true },
				likes: 'bigint',
				dislikes: 'bigint',
				visibility: 'list<text>',
				slashtags: 'list<text>',
				views: 'bigint',
				created_at: { type: 'timestamp', index: true }
			}
		},
		videos: {
			columns: {
				id: { type: 'text', isPrimaryKey: true },
				title: 'text',
				description: 'text',
				url: { type: 'text', index: true },
				cover: 'text',
				creator: { type: 'text', index: true },
				duration: 'duration',
				likes: 'bigint',
				dislikes: 'bigint',
				visibility: 'list<text>',
				slashtags: 'list<text>',
				views: 'bigint',
				created_at: { type: 'timestamp', index: true }
			}
		},
		messages: {
			columns: {
				id: { type: 'text', isPrimaryKey: true },
				sender: { type: 'text', index: true },
				receiver: { type: 'text', index: true },
				status: 'text',
				type: 'text',
				message: 'text',
				sent_at: { type: 'timestamp', index: true }
			}
		},
		history: {
			columns: {
				id: { type: 'text', isPrimaryKey: true },
				user_id: { type: 'text', index: true },
				type: 'text',
				url: { type: 'text', index: true },
				time: { type: 'timestamp', index: true }
			}
		},
		search_history: {
			columns: {
				id: { type: 'text', isPrimaryKey: true },
				user_id: { type: 'text', index: true },
				query: 'text',
				time: { type: 'timestamp', index: true }
			}
		},
		collections: {
			columns: {
				id: { type: 'text', isPrimaryKey: true },
				owner: { type: 'text', index: true },
				name: 'text',
				description: 'text',
				visibility: 'list<text>',
				urls: 'list<text>',
				created_at: { type: 'timestamp', index: true }
			}
		},
		services: {
			columns: {
				id: { type: 'text', isPrimaryKey: true },
				provider: { type: 'text', index: true },
				title: 'text',
				description: 'text',
				price: 'text',
				created_at: { type: 'timestamp', index: true },
				slashtags: 'list<text>'
			}
		},
		liked_by_user: {
			columns: {
				user_id: { type: 'text', isPrimaryKey: true },
				blogs: 'list<text>',
				posts: 'list<text>',
				comments: 'list<text>',
				videos: 'list<text>'
			},
		},
		disliked_by_user: {
			columns: {
				user_id: { type: 'text', isPrimaryKey: true },
				blogs: 'list<text>',
				posts: 'list<text>',
				comments: 'list<text>',
				videos: 'list<text>'
			},
		},
		comments: {
			columns: {
				id: { type: 'text', isPrimaryKey: true },
				comment: 'text',
				author: 'text',
				likes: 'bigint',
				dislikes: 'bigint',
				comment_on: 'text',
				time: 'timestamp'
			}
		},
		replies: {
			columns: {
				id: { type: 'text', isPrimaryKey: true },
				comment_id: { type: 'text', index: true },
				reply: 'text',
				author: 'text',
				likes: 'bigint',
				dislikes: 'bigint',
				time: 'timestamp'
			}
		},
		notifications: {
			columns: {
				id: { type: 'text', isPrimaryKey: true },
				user_id: { type: 'text', index: true },
				title: 'text',
				link: 'text',
				type: 'text',
				seen: 'boolean',
				date: 'timestamp'
			}
		},
		logged_in_devices: {
			columns: {
				id: { type: 'text', isPrimaryKey: true },
				user_id: { type: 'text', index: true },
				name: 'text',
				ip: 'text'
			}
		},
		credits: {
			columns: {
				id: { type: 'text', isPrimaryKey: true },
				video_id: { type: 'text', index: true },
				user: 'text',
				role: 'text'
			}
		},
		reviews: {
			columns: {
				id: { type: 'text', isPrimaryKey: true },
				service_id: { type: 'text', index: true },
				reviewer: 'text',
				review: 'text',
				rating: 'decimal',
				time: 'timestamp'
			}
		}
	})
		.then(() => console.log('Tables created'))
		.catch(err => console.error(err))
		.finally(() => process.exit(0))
}

push()
