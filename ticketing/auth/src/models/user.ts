//define mongoose user model
import mongoose from "mongoose";
import { Password } from "../services/password";

//let typescript help us check properties
//an interface that describes the properties
//that are required to create a new User
interface UserAttrs {
    email: string;
    password: string;
}

//tell typescript there's a build function
//an interface that describes the propersties
//that a User model has 
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

//an interface that describes the properties
//that a user document(a single user) has
interface UserDoc extends mongoose.Document {
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
//a middleware function in mongoose
//called everytime we want to save a user into database
userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const ps = <string>(this.get('password'));
        const hashed = await Password.toHash(ps);
        this.set('password', hashed);
    }
    done();

});
//type script don't understand this
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

//model: how to access
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
//do typescript checking with user capsulated inside build user
//improvement: get buildUser as a method inside User
//advantage: don't need to remember a separate function when building a new user
// const buildUser = (attrs: UserAttrs) => {
//     return new User(attrs);
// };

export { User };
