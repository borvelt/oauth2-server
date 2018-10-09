import * as Mongoose from "mongoose";
import {SchemaInterface} from "../utils/mongoose.odm";

class User extends Mongoose.Schema implements SchemaInterface {
    constructor(options = {}) {
        super({
            username: {
                type: String,
                index: true,
                unique: true,
                trim: true,
                sparse: true,
                dropDups: true,
                required: true
            },
            secret: {
                type: Mongoose.Schema.Types.Mixed,
                required: true,
            },
            firstName: {
                type: String,
                trim: true,
                maxlength: 2000
            },
            lastName: {
                type: String,
                maxlength: 20
            },
        }, options);
    }

    public methods = {};

    public toString(): string {
        return 'users';
    }
}

export default User