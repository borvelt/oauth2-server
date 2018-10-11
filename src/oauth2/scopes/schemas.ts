import * as Mongoose from 'mongoose'
import { SchemaInterface } from '../../utils/mongoose.odm'

class Scope extends Mongoose.Schema implements SchemaInterface {
  constructor(options = {}) {
    super(
      {
        name: {
          type: String,
          index: true,
          unique: true,
          trim: true,
          sparse: true,
          dropDups: true,
          required: true,
        },
        description: {
          type: String,
        },
        claims: [
          {
            type: String,
          },
        ],
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
      options,
    )
  }

  public methods = {}

  public toString(): string {
    return 'scopes'
  }
}

export default Scope
