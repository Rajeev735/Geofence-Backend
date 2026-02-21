import mongoose from "mongoose";




const connectDB = async () => {
    const database = await mongoose.connect(process.env.DBURL as string, {
    })
    console.log("DB connected")
    return database;
}
export default connectDB