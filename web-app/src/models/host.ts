import { Schema, Document, Model, model } from 'mongoose';

export interface IHostModel extends Document {
    url: string;
    hash: string;
    shortHandUrl: string;
}

const hostSchema = new Schema({
    url: String,
    hash: String,
    shortHandUrl: String
});

export const Host: Model<IHostModel> = model('Host', hostSchema) as Model<IHostModel>;
