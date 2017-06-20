import { Schema, Document, Model, model } from 'mongoose';

export interface IUserModel extends Document {
    sharepoint: {
        name: string,
        email: string,
        username: string
    }
}

const userSchema = new Schema({
    sharepoint: {
        name: String,
        email: String,
        username: String
    }
});

export const User: Model<IUserModel> = model('User', userSchema) as Model<IUserModel>;
