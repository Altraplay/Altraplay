import { Elysia, t } from 'elysia'
import { GenToken } from '$lib/auth'
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

export default route
