import { Elysia, t } from 'elysia'
import { GenToken, checkState } from '$lib/auth'
import db from '@DB/orm'
import mailer from '$lib/mailer'
import pushLogs from '$lib/logs'
import { randomString, randomInt } from '$lib/random'
const route = new Elysia({ prefix: '/auth' })
	.post(
		'/sign-up',
		async ({ body, set }) => {
			try {
				// eslint-disable-next-line prefer-const
				let { username, email, password, name } = body

				if (/[`~!@#$%^&*()=+[\]|;:',.<>/?]/.test(username)) {
					set.status = 400
					return {
						err: 'Username cannot contain special characters except for under_scores and hyphens -.'
					}
				}

				if (!name) {
					username = name as string
				}

				const newUsername = `@${username.toLowerCase().replaceAll(' ', '')}`

				const [existingUsername, existingEmail] = await Promise.all([
					db.findMany({
						tables: ['users'],
						where: { users: { username: newUsername } },
						select: { users: ['is_email_verified'] }
					}),
					db.findMany({
						tables: ['users'],
						where: { users: { email: email.toLowerCase().replaceAll(' ', '') } },
						select: { users: ['is_email_verified'] }
					})
				])

				if (
					existingUsername?.users?.some(user => user.is_email_verified) ||
					existingEmail.users?.some(user => user.is_email_verified)
				) {
					set.status = 409
					return { err: 'Username or Email already exists' }
				}

				if (existingUsername?.users?.length > 1) {
					await db.deleteMany({
						tables: ['users'],
						where: { users: { username: newUsername, is_email_verified: false } }
					})
				}

				if (existingEmail?.users?.length > 1) {
					await db.deleteMany({
						tables: ['users'],
						where: {
							users: { email: email.toLowerCase().replaceAll(' ', ''), is_email_verified: false }
						}
					})
				}

				const hash = await Bun.password.hash(password, { algorithm: 'bcrypt', cost: 10 })

				const token = GenToken({ username: newUsername, password: hash }, '1h')

				await db.create({
					table: 'users',
					data: {
						id: randomString(randomInt(10, 85), true, true, true, true, true),
						username: newUsername,
						password: hash,
						name: name as string,
						email,
						verification_token: token,
						followers: 0,
						level: 'Silent Soul',
						points: 0,
						needs: 500,
						is_email_verified: false,
						only_visible_to: 'everyone',
						role: 'User',
						verified: false,
						profile_picture: '',
						banner: '',
						joined: new Date()
					}
				})

				const mail = await mailer.emails.send({
					from: `Tech Gunner Industries <onboarding@resend.dev>`,
					to: email,
					subject: 'Tech Gunner - Complete Sign up',
					html: `
					<div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #09132d; color: #fff; font-family: Arial, sans-serif; border-radius: .8rem;">
					<img src="https://techgunner.com/text-logo.png" width="500px" alt="Tech Gunner Logo" style="margin: 0 auto;">
						<h1 style="text-align: center;">Hi, ${name}!</h1>
						<p>Thank you for signing up for Tech Gunner</p>
						<p>We sent you this email to verify your identity. Please click the link below to complete your registration.</p>
						<div style="text-align: center; margin-top: 20px;">
							<a href="${Bun.env.DOMAIN}/verify?token=${token}" style="display: inline-block; padding: 6px 20px; background-color: #0effbd; color: #09132d; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
						</div>
						<p style="margin-top: 20px;">If you didn't created this account then please ignore this email. The verification link will automatically expire in 1 hour</p>
						<p>Receiving too many emails? Let us know by reporting it by <a href="${Bun.env.DOMAIN}/report" style="color: #fff;">clicking here.</a></p>
						<p style="margin-top: 20px;">Best Regards,<br/>Tech Gunner Industries &copy;</p>
					</div>
					`,
					text: `
                    Hi, ${name}!

                    Thank you for signing up for Tech Gunner
					We sent you this email to verify your identity. Please click the link below to complete your registration.

					${Bun.env.DOMAIN}/verify?token=${token}
					
					If you didn't create this account then please ignore this email. The verification link will automatically expire in 1 hour

					Receiving too many emails? Let us know by reporting it by clicking the link below.
					${Bun.env.DOMAIN}/report
                    
					Best Regards,
                    Tech Gunner Industries ©
                    `
				})
				console.log(JSON.stringify(mail))
				set.status = 204
			} catch (e) {
				set.status = 500
				console.error('Error while registering the user', e)
				pushLogs(`Error while registering the user: ${e}`)
				return { err: "Something went wrong on our server, We'll try to fix it ASAP!" }
			}
		},
		{
			body: t.Object({
				username: t.String({
					maxLength: 35,
					error: 'Username can not be longer then 35 characters'
				}),
				email: t.String({ format: 'email', error: 'Please enter a valid email' }),
				password: t.String({
					minLength: 30,
					error: 'Password must contain 30 or more characters'
				}),
				name: t.Optional(
					t.String({ maxLength: 30, error: 'Name can not be longer than 30 characters' })
				)
			})
		}
	)
	.post(
		'/login',
		async ({ body, set }) => {
			try {
				const { email, password } = body

				const user = await db.findUnique({
					table: 'users',
					where: { email: email.toLowerCase().replaceAll(' ', '') },
					select: ['username', 'email', 'password', 'name']
				})

				if (user) {
					const match = await Bun.password.verify(password, user.password, 'bcrypt')

					if (match) {
						const token = GenToken({ username: user.username, password: user.password }, '1h')

						await db.update({
							table: 'users',
							data: { verification_token: token },
							where: { email: email.toLowerCase().replaceAll(' ', '') }
						})

						await mailer.emails.send({
							from: `Tech Gunner Industries <onboarding@resend.dev>`,
							to: user.email,
							subject: 'Tech Gunner - Security Alert: Suspicious Login Attempt Detected',
							html: `
							<div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #09132d; color: #fff; font-family: Arial, sans-serif; border-radius: .8rem;">
								<img src="https://techgunner.com/text-logo.png" width="500px" alt="Tech Gunner Logo" style="margin: 0 auto;">
								<h1 style="text-align: center;">Hello, ${user.name}!</h1>
								<p>We've detected a suspicious login attempt on your Tech Gunner account.</p>
								<p>If this was you, please confirm the action by clicking the button below:</p>
								<div style="text-align: center; margin-top: 20px;">
									<a href="${Bun.env.DOMAIN}/verify?token=${token}" style="display: inline-block; padding: 5px 20px; background-color: #0effbd; color: #09132d; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Login</a>
								</div>
								<p>If you did not attempted to login, it's possible someone else may be trying to access your account. We recommend taking the following steps:</p>
								<ul style="margin-left: 20px;">
									<li>Change your password immediately.</li>
									<li>Review your account activity for any unauthorized access.</li>
									<li>Contact our support team if you need further assistance.</li>
								</ul>
								<p style="margin-top: 20px;">Best Regards,<br/>Tech Gunner Industries &copy;</p>
							</div>
`,
							text: `
							Hello, ${user.name}!
											
							We've detected a suspicious login attempt on your Tech Gunner account.
											
							If this was you, please confirm the action by clicking the link below:
							${Bun.env.DOMAIN}/verify?token=${token}
											
							If you did not attempted to login, it's possible someone else may be trying to access your account. We recommend taking the following steps:
						
							- Change your password immediately.
							- Review your account activity for any unauthorized access.
							- Contact our support team if you need further assistance.
											
							Best Regards,
							Tech Gunner Industries ©
						`
						})

						set.status = 204
					} else {
						set.status = 400
						return { err: 'The email or password are incorrect' }
					}
				} else {
					set.status = 400
					return { err: 'The email or password are incorrect' }
				}
			} catch (e) {
				set.status = 500
				console.error('An error occurred while logging in the user', e)
				pushLogs(`An error occurred while logging in the user: ${e}`)
				return { err: "Something went wrong on our server, We'll try to fix it ASAP!" }
			}
		},
		{ body: t.Object({ email: t.String(), password: t.String() }) }
	)
	.post(
		'/verify',
		async ({ query, set }) => {
			try {
				const token = checkState(query.token)
				if (token?.username) {
					const user = await db.findUnique({
						table: 'users',
						where: { username: token.username },
						select: ['username', 'verification_token', 'password']
					})

					if (user) {
						if (query.token === user.verification_token) {
							const matchUsername = checkState(query.token, user.username)

							if (matchUsername?.state === 'Owner') {
								const newToken = GenToken(
									{ username: user.username, password: user.password },
									'365d'
								)
								await db.update({
									table: 'users',
									data: { is_email_verified: true },
									where: { username: user.username }
								})
								console.log('verified')

								set.status = 201

								return { token: newToken, username: user.username }
							}
						} else {
							set.status = 'Unauthorized'
							return { err: 'The link is invalid or expired' }
						}
					} else {
						set.status = 'Unauthorized'
						return { err: 'The link is invalid or expired' }
					}
				} else {
					set.status = 'Unauthorized'
					return { err: 'The link is invalid or expired' }
				}
			} catch (e) {
				set.status = 500
				console.error('Something went wrong while verifying the user:', e)
				pushLogs(`Something went wrong while verifying the user: ${e}`)
				return { err: "Something went wrong on our server, We'll try to fix it ASAP!" }
			}
		},
		{
			query: t.Object({
				token: t.String()
			})
		}
	)

export default route
