import jwt from 'jsonwebtoken'

function GenToken(user: { username: string; password: string }, exp: string) {
	return jwt.sign({ username: user.username, password: user.password }, Bun.env.JWT as string, {
		expiresIn: exp
	})
}

export { GenToken }
