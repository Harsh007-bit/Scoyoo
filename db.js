import mongoose from 'mongoose'
let isConnected = false

const connect = async () => {
    if (!isConnected) {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING)
    }
    isConnected = true
}

export default connect;