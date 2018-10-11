import * as Mongoose from 'mongoose'
import { SchemaInterface } from '../../../utils/mongoose.odm'
import AccessTokenType from './AccessToken'
import Config from '../../../configs'

class AccessToken extends Mongoose.Schema implements SchemaInterface {
  constructor(options = {}) {
    super(
      {
        accessToken: {
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
        expires: {
          type: Number,
          default: Date.now() + Config.accessTokenAge,
        },
        scopes: {
          type: Mongoose.Schema.Types.Mixed,
        },
        type: {
          type: String,
          default: AccessTokenType.Bearer,
        },
      },
      options,
    )
  }

  public methods = {}

  public toString(): string {
    return 'access_tokens'
  }
}

export default AccessToken
