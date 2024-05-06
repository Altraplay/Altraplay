import { Elysia, t } from 'elysia'
import { GenToken, checkState } from '$lib/auth'
import db from '@DB/db'
import mailer from '$lib/mailer'
import pushLogs from '$lib/logs'

import type { User } from '$Types/user'

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
					db
						.query({
							query: `SELECT username, is_email_verified FROM users WHERE username = {username:String}`,
							query_params: {
								username: newUsername
							},
							format: 'JSONEachRow'
						})
						.then(response => response.json()) as unknown as User[],
					db
						.query({
							query: `SELECT email, is_email_verified FROM users WHERE email = {email:String}`,
							query_params: {
								email: email.toLowerCase().replaceAll(' ', '')
							},
							format: 'JSONEachRow'
						})
						.then(response => response.json()) as unknown as User[]
				])

				if (
					existingUsername[0]?.username.toLowerCase() === newUsername &&
					existingUsername[0]?.is_email_verified
				) {
					set.status = 409
					return { err: 'Username or Email already exists' }
				}

				if (existingEmail[0]?.email === email && existingEmail[0]?.is_email_verified) {
					set.status = 409
					return { err: 'Username or Email already exists' }
				}

				if (
					existingUsername[0]?.username.toLowerCase() === newUsername &&
					!existingUsername[0]?.is_email_verified
				) {
					await db.command({
						query: `ALTER TABLE users DELETE WHERE username = {username:String}`,
						query_params: {
							username
						}
					})
				}

				if (
					existingEmail[0]?.email.toLowerCase() === email.toLowerCase() &&
					!existingEmail[0]?.is_email_verified
				) {
					await db.command({
						query: `ALTER TABLE users DELETE WHERE email = {email:String}`,
						query_params: {
							email
						}
					})
				}

				const hash = await Bun.password.hash(password, { algorithm: 'bcrypt', cost: 10 })

				const token = GenToken({ username: newUsername, password: hash }, '1h')

				await db.insert({
					table: 'users',
					values: [
						{
							username: newUsername,
							password: hash,
							name,
							email,
							verification_token: token
						}
					],
					format: 'JSONEachRow'
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

				const res = await db.query({
					query: `SELECT username, email, password FROM users WHERE email = {email:String}`,
					query_params: {
						email: email.toLowerCase().replaceAll(' ', '')
					},
					format: 'JSONEachRow'
				})

				const user = (await res.json()) as unknown as User[]

				if (user.length > 0) {
					const match = await Bun.password.verify(password, user[0]?.password, 'bcrypt')

					if (match) {
						const token = GenToken(
							{ username: user[0]?.username, password: user[0]?.password },
							'1h'
						)

						await db.command({
							query: `ALTER TABLE users UPDATE verification_token = {verification_token:String} WHERE email = {email:String}`,
							query_params: {
								verification_token: token,
								email: email.toLowerCase().replaceAll(' ', '')
							}
						})

						await mailer.emails.send({
							from: `Tech Gunner Industries <onboarding@resend.dev>`,
							to: user[0].email,
							subject: 'Tech Gunner - Security Alert: Suspicious Login Attempt Detected',
							html: `
  
							<div style="max-width: 600px; margin: 0 auto; padding: 20px; background: #09132d; color: #fff; font-family: Arial, sans-serif; border-radius: .8rem;">
								<img src="https://techgunner.com/text-logo.png" width="500px" alt="Tech Gunner Logo" style="margin: 0 auto;">
								<h1 style="text-align: center;">Hello, ${user[0]?.name}!</h1>
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
							Hello, ${user[0]?.name}!
											
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
					const res = await db.query({
						query: `SELECT username, verification_token, password FROM users WHERE username = {username:String}`,
						query_params: {
							username: token.username
						},
						format: 'JSONEachRow'
					})

					const user = (await res.json()) as unknown as User[]
					if (query.token === user[0]?.verification_token) {
						if (user.length > 0) {
							const matchUsername = checkState(query.token, user[0]?.username)

							if (matchUsername?.state === 'Owner') {
								const newToken = GenToken(
									{ username: user[0]?.username, password: user[0]?.password },
									'365d'
								)
								await db.command({
									query: `ALTER TABLE users UPDATE is_email_verified = {is_email_verified:Bool} WHERE username = {username:String}`,
									query_params: {
										is_email_verified: true,
										username: user[0]?.username
									}
								})
								console.log('verified')

								set.status = 201

								return { token: newToken, username: user[0]?.username }
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
