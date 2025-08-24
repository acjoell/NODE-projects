import { connect } from 'mongoose'

const dbConnect = async () => {
  try {
    const mongoDbConnection = await connect(process.env.CONNECTION_STRING)
    console.log(`Database connected: ${mongoDbConnection.connection.host}`)
  } catch (e) {
    console.log(`Database error: ${e.message}`)
    process.exit(1)
  }
}

export default dbConnect
