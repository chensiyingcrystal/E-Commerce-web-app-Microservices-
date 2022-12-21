//define mongoose user model
import mongoose from "mongoose";

//let typescript help us check properties
//an interface that describes the properties
//that are required to create a new User
interface UserAttrs {
    email: string;
    password: string;
}


//schema: what properties
const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
//model: how to access
const User = mongoose.model('User', userSchema);
//do typescript checking with user capsulated inside build user
const buildUser = (attrs: UserAttrs) => {
    return new User(attrs);
};



export { User };
