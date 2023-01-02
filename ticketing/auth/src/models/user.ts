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
//model represents the entire collection of data
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

//an interface that describes the properties
//that a user document(a single user) has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}


//schema: list what properties inside
const userSchema = new mongoose.Schema({
    email: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true
    } 
}, {
    toJSON: {
        //define how to represent these data in JSON
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;

        }
    }
});
//a middleware function in mongoose for password hash
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
//allow typescript to validate the properties when we
//build a new user
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

//model: how to access
//create the model
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);
//do typescript checking with user capsulated inside build user
//improvement: get buildUser as a method inside User
//advantage: don't need to remember a separate function when building a new user
// const buildUser = (attrs: UserAttrs) => {
//     return new User(attrs);
// };

export { User };
