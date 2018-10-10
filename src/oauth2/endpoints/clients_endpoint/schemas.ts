import * as Mongoose from "mongoose";
import {SchemaInterface} from "../../../utils/mongoose.odm";
import ApplicationTypes from "../../ApplicationTypes";
import Validation from "./validations";

class Client extends Mongoose.Schema implements SchemaInterface {
    constructor(options = {}) {
        super({
            clientId: {
                type: String,
                index: true,
                unique: true,
                trim: true,
                sparse: true,
                dropDups: true,
                required: true
            },
            clientSecret: {
                type: Mongoose.Schema.Types.Mixed,
                required: true,
            },
            clientName: {
                type: String,
                required: true,
            },
            redirectUri: [{
                type: String,
                trim: true,
                maxlength: 2000,
                required: true,
            }],
            grantTypes: [{
                type: String,
                maxlength: 20,
                validate: Validation.GrantType,
                required: true,
            }],
            responseTypes: [{
                type: String,
                maxlength: 20,
                validate: Validation.ResponseType,
                required: true,
            }],
            scopes: [{
                type: Mongoose.Schema.Types.Mixed,
                required: true,
            }],
            userId: {
                type: Mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            preAuthorization: {
                type: Boolean,
                default: false
            },
            applicationType: {
                type: String,
                default: ApplicationTypes.Web,
            }
        }, options);
    }

    public methods = {};

    public toString(): string {
        return 'clients';
    }
}

export default Client