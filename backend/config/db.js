import mongoose from "mongoose";

const connectDB = async () => {

    try {
        const con = await mongoose.connect(process.env.MONGO_URI);
        console.log(`CONNECTED WITH MONGO DB SUCCESSFULLY: ${con.connection.host}`);
    } catch (error) {
        console.log(`MONGO DB CONNECTION ERROR: ${error.message}`);
        process.exit(1);
    }
    
}

export default connectDB;