import crypto from 'crypto'

function int(min: number, max: number): number {
	let cryptoRandom
	if (typeof window !== 'undefined') {
		cryptoRandom = window.crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32
	} else {
		cryptoRandom = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32
	}
	return Math.floor(cryptoRandom * (max - min + 1)) + min
}

export { int }
