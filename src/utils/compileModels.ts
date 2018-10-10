import { Model } from './mongoose.odm'
import Client from '../oauth2/endpoints/clients_endpoint/schemas'
import User from '../users/schemas'
import Scope from '../oauth2/scopes/schemas'
import AuthorizationCode from '../oauth2/tokens/authorization_code/schemas'
import AccessToken from '../oauth2/tokens/access_token/schemas'
import RefreshToken from '../oauth2/tokens/refresh_token/schemas'
import Errors from '../oauth2/errors/schemas'

/*
 * Here We Compile Our Models From Our Schema.
 * */
const Models: any = {
  Client: Model.createInstanceFor(new Client({ versionKey: false })),
  User: Model.createInstanceFor(new User({ versionKey: false })),
  Scope: Model.createInstanceFor(new Scope({ versionKey: false })),
  AuthorizationCode: Model.createInstanceFor(
    new AuthorizationCode({ versionKey: false }),
  ),
  AccessToken: Model.createInstanceFor(new AccessToken({ versionKey: false })),
  RefreshToken: Model.createInstanceFor(
    new RefreshToken({ versionKey: false }),
  ),
  Error: Model.createInstanceFor(new Errors({ versionKey: false })),
}

export default Models
