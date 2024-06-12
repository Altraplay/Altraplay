import crypto from 'crypto'

function randomInt(min: number, max: number): number {
	let cryptoRandom: number
	if (typeof window !== 'undefined' && window.crypto) {
		const array = new Uint32Array(1)
		window.crypto.getRandomValues(array)
		cryptoRandom = array[0] / (0xffffffff + 1)
	} else {
		const buffer = crypto.randomBytes(4)
		cryptoRandom = buffer.readUInt32BE(0) / (0xffffffff + 1)
	}
	return Math.floor(cryptoRandom * (max - min + 1)) + min
}

function randomString(
	length: number,
	includeUpper: boolean = false,
	includeLower: boolean = true,
	includeNumber: boolean = false,
	includeSymbols: boolean = false,
	includeSpecial: boolean = false
): string {
	const characters: string[] = []

	if (includeUpper) characters.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
	if (includeLower) characters.push('abcdefghijklmnopqrstuvwxyz')
	if (includeNumber) characters.push('0123456789')
	if (includeSymbols) characters.push("`~!@#$%^&*()-_=+[]{}|;:',.<>/?")
	if (includeSpecial)
		characters.push(
			'☠☮☯♠Ω♤♣♧♢♔♕♚♛⚜★☆✮✯☄☾☽☼☀☁☂☃☻☺☹۞۩εїзƸ̵̡Ӝ̵̨̄ƷξЖЗεжз☎☏¢☚☛☜☞☟☢☣♨✦✧♱♰∞♂♀☿✖✗✘⊗¿¡℃∃∧∠∨∩⊂⊃∪⊥∀ΞΓɐəɘεβɟɥɯɔи๏ɹʁяʌʍ♦♢♔♕♚♛★☆✮✯☄☾✦✧∞♂♀☿❦❧™®©✗✘⊗ʊϟღ回₪✓✔✕✖☢☣☤☥☦☧☨☩☪☫☬☭☹☺☻تヅツッシÜϡ♂♀☿웃유☁☂☃☄☾☽❄☇☈⊙☉℃℉°♪♫♩♬♭♮♯°ø✽✾✿❀❁✎✏✐✑✒⌨☑✓✔☒☓✕✖✗✘✦★☆✰✮✯❇❈❅❄❆╰☆╮Ææ❖℘ℑℜℵ✦✧♱♰♂♀☿❦❧™®©♡♦♢♔♕♚♛★☆✮✯☄☾☽☼☀☁☂☃☻☺☹☮۞۩ε☟☢☣☠☮☯♠♤♣♧♥♨๑❀✿ψ☪☭♪♩♫℘ℑℜℵηαʊϟღツ回₪™©®¿¡☀☂☁┱┲❣✚✪✣✤✥✦❉❦❧❃❂❁❀☢☠☭✓✔✕♪♩♭♪の☆→あஐ≈๑❈➹~｡☀☂✚✪✣✤✥✦❉❦❧❃❂❁❀✄☪☣☢☠☭✓✔✕✖㊚㊛╠¶ஐ©†εïз♪ღ♣♠•±°•ิ.•ஐஇ*×○▫♂•♀◊©¤▲↔™®☎εїз♨☏☆＃♂♡♬♪♭♫♪ﻬஐღ↔¤╬☞♬✞♕☯☭★☆☇☈☊☋☌☍☎☏☐☘☙☟☠☡☢☣☤☥☦☧☨☩☪☫☬☭☮☸☹☺☻☼☽☾☿♀♁♂♃♄♅♇♔♕♖♗♘♙₤₥₦₧₨₪₫€₭₮₯℀℁⅊⅋⅌⅍ⅎ∋∌∍∏∐∑⊂⊃⊄⊅⊆⊇⊈⊉⊊⊋⊌⊼⊽⊾⊿⋀⋁⋂⋃⋄⋅⋆⋇⋈⋉⋊⋋⋌⋍⋎⋏⋐⋑⋒⋓⋔⋲⋳⋴⋵⋶⋷⋸⋹⋺⋻⋼⋽⋾⋿⌀⌁⌂⌃⌄⌅⌆⌇⌈⌉⌊⌋⌗⌘⌡⌢⌣⌤⌥⌦⌧⌨␢☈☊☋☌☍☎☏☘☙☟☠☡☢☣☤☥☦☧☨☩☪☫☬☭☸☹☺☻☼☽☾☿♀♁♂♃♄♅♇♔♕♖♗♘♙♚♛♜♝♞♟☫ªↀↁↂↃ➤➥➦➧➨➚➘➙↼↽↾↿⇀⇁⇂⇃⇄⇅⇆⇇⇈⇉⇊⇋⇌⇍⇎⇏⇐⇑⇒⇓⇔⇕⇖⇗⇘⇙⇚⇛⇜⇝⇞⇟⇠⇡⇢⇣╰☆╮✡❂-‘๑’-⎈™℠©®℗'
		)

	const string: string[] = []

	function isSimilarOrSequential(char: string, prev: string): boolean {
		const similar = 'il1Lo0O'
		const sequential = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
		return (
			(similar.includes(char) && similar.includes(prev)) ||
			(sequential.includes(char) &&
				sequential.includes(prev) &&
				Math.abs(sequential.indexOf(char) - sequential.indexOf(prev)) === 1)
		)
	}

	for (let i = 0; i < length; i++) {
		let randomSetIndex = randomInt(0, characters.length - 1)
		let randomCharIndex = randomInt(0, characters[randomSetIndex].length - 1)
		let char = characters[randomSetIndex][randomCharIndex]

		if (i > 0 && isSimilarOrSequential(char, string[i - 1])) {
			do {
				randomSetIndex = randomInt(0, characters.length - 1)
				randomCharIndex = randomInt(0, characters[randomSetIndex].length - 1)
				char = characters[randomSetIndex][randomCharIndex]
			} while (isSimilarOrSequential(char, string[i - 1]))
		}

		string.push(char)
	}

	for (let i = string.length - 1; i > 0; i--) {
		const j = randomInt(0, i)
		;[string[i], string[j]] = [string[j], string[i]]
	}

	return string.join('')
}

export { randomInt, randomString }
