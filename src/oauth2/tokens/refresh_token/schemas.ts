import * as Mongoose from 'mongoose'
import { SchemaInterface } from '../../../utils/mongoose.odm'
import AccessTokenType from '../access_token/AccessToken'
import Config from '../../../configs'

class RefreshToken extends Mongoose.Schema implements SchemaInterface {
  constructor(options = {}) {
    super(
      {
        refreshToken: {
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
          default: Date.now() + Config.refreshTokenAge,
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
    return 'refresh_tokens'
  }
}

export default RefreshToken
