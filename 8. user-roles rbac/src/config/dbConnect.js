import mongoose from 'mongoose'

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING)
    console.log('\n------------')
    console.log(`Database connected: \nHost: ${connect.connection.host}\nName: ${connect.connection.name}`)
    console.log('------------')
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }
}

export default dbConnect
