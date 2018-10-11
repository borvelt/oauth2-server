import * as Mongoose from 'mongoose'
import { SchemaInterface } from '../../../utils/mongoose.odm'
import Config from '../../../configs'

class AuthorizationCode extends Mongoose.Schema implements SchemaInterface {
  constructor(options = {}) {
    super(
      {
        authorizationCode: {
          type: String,
          maxlength: 40,
          index: true,
          unique: true,
          trim: true,
          sparse: true,
          dropDups: true,
          required: true,
        },
        client: {
          type: Mongoose.Schema.Types.Mixed,
          required: true,
        },
        user: {
          type: Mongoose.Schema.Types.Mixed,
        },
        redirectUri: {
          type: String,
          maxlength: 2000,
        },
        expires: {
          type: Number,
          default: Date.now() + Config.authorizationCodeAge,
        },
        scopes: {
          type: Mongoose.Schema.Types.Mixed,
        },
        state: {
          type: String,
        },
      },
      options,
    )
  }

  public methods = {}

  public toString(): string {
    return 'authorization_codes'
  }
}

export default AuthorizationCode
