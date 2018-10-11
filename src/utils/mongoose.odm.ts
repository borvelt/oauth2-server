import * as Mongoose from 'mongoose'

class Connection {
  public static establish(): Mongoose.Connection {
    Mongoose.set('useCreateIndex', true)
    Mongoose.connect(
      'mongodb://127.0.0.1:27017/oauth2',
      { useNewUrlParser: true },
    )
    const db: Mongoose.Connection = Mongoose.connection
    db.on('error', console.error.bind(console, 'connection error:'))
    return db
  }

  public static destroy() {
    Mongoose.connection.close()
  }
}

class Model {
  public static createInstanceFor(schema: any): any {
    return Mongoose.model(schema.toString(), schema)
  }
}

interface SchemaInterface {
  methods: object
  toString(): string
}

export { Connection, Model, SchemaInterface }
