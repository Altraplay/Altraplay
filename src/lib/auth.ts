import jwt from 'jsonwebtoken'

function GenToken(user: { username: string; password: string }, exp: string) {
	return jwt.sign({ username: user.username, password: user.password }, Bun.env.JWT as string, {
		expiresIn: exp
	})
}

function checkState(token: string, username?: string) {
	try {
		const check = jwt.verify(token, Bun.env.JWT as string)
		let state: 'Owner' | 'LoggedIn' | 'None'
		// @ts-expect-error: come on now
		if (check?.username === username && username) state = 'Owner'
		else if (check) state = 'LoggedIn'
		else state = 'None'
		return state
	} catch (e) {
		console.error(e)
	}
}

export { GenToken, checkState }
