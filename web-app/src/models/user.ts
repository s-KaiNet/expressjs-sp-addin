import { Schema, Document, Model, model } from 'mongoose';

export interface IUserModel extends Document {
    sharepoint: {
        loginName: string,
        email: string,
        displayName: string
    }
}

const userSchema = new Schema({
    sharepoint: {
        loginName: String,
        email: String,
        displayName: String
    }
});

export const User: Model<IUserModel> = model('User', userSchema) as Model<IUserModel>;
