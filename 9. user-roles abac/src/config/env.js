import dotenv from 'dotenv'

dotenv.config()

export const PORT = process.env.PORT ?? 8001
export const jwtSecret = process.env.JWT_SECRET ?? 'Secret_message'
