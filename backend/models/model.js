import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        default: "https://media.istockphoto.com/id/529371821/vector/traffic-road-sign-vector.jpg?s=612x612&w=0&k=20&c=Hzt-7g0bHL80MPyoB2HT0XNMMP-kxWACzDzlpk9_58k="
    },
})

const User = mongoose.model('User', userSchema);

export default User;