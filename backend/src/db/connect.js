import mongoose from "mongoose";


const connect = async () => {
    try {
        console.log('Connecting to database.....');
        await mongoose.connect(process.env.MONGO_URI, {}); 
        console.log('Connected to database.....');
    } catch (error) {
        console.error('Failed to connect to MongoDB..... ', error.message);
        process.exit(1);
    }
}

export default connect;