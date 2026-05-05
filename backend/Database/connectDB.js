import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async()=> {

    try {
        const db_url = process.env.MONGODB_URI;
        
        await mongoose.connect(db_url);
        console.log("Database Successfully Connected ------->");
    } catch (error) {
        console.log("Database Not Connected !!!!!!");
    }

}

export default connectDB;