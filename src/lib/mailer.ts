import { Resend } from 'resend'

const resend = new Resend(Bun.env.RESEND)

export default resend
