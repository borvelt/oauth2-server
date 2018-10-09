import * as Mongoose from "mongoose";
import {SchemaInterface} from "../../utils/mongoose.odm";

class Errors extends Mongoose.Schema implements SchemaInterface {
    constructor(options = {}) {
        super({
            error: {
                type: String,
                index: true,
                unique: true,
                trim: true,
                sparse: true,
                dropDups: true,
                required: true
            },
            errorDescription: {
                type: String
            },
            code: {
                type: Number
            }
        }, options);
    }

    public methods = {};

    public toString(): string {
        return 'errors';
    }
}

export default Errors