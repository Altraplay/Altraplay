import jwt from 'jsonwebtoken'

function GenToken(user: { id: string; verified: boolean, }, exp: string) {
	return jwt.sign({ id: user.id, verified: user.verified }, Bun.env.JWT!, {
		expiresIn: exp
	})
}

function checkState(token: string, id?: string) {
	try {
		const check = jwt.verify(token, Bun.env.JWT!) as { id: string; verified: boolean }
		let state: 'Owner' | 'LoggedIn' | 'None'
		if (check?.id === id && id) state = 'Owner'
		else if (check) state = 'LoggedIn'
		else state = 'None'
		return { state, id: check?.id }
	} catch (e) {
		console.error('Error while decoding JWT', e)
	}
}

export { GenToken, checkState }
