import { Request, Response } from 'express'
import * as assert from 'assert'
import Models from '../../../utils/compileModels'
import IdGenerators from '../../../utils/IdGenerators'
import Config from '../../../configs'

class AuthorizationEndPoint {
  /*
     * @return address that user will be redirected to, with authorization code
     * */
  private static makeAuthorizationCodeQueryString(data): string {
    return (
      data.redirectUri +
      '?code=' +
      data.authorizationCode +
      '&state=' +
      data.state
    )
  }

  /*
     * generate authorization code and then redirect user.
     * */

  public static authorizationCode(
    request: Request,
    response: Response,
    next: () => void,
  ) {
    const data = {
      authorizationCode: IdGenerators.authorizationCode(),
      client: response.locals.client,
      expires: Date.now() + Config.authorizationCodeAge,
      redirectUri: request.query.redirect_uri,
      scopes: response.locals.scopes,
      state: request.query.state,
      user: response.locals.user,
    }
    new Models.AuthorizationCode(data).save((error, result) => {
      try {
        assert.equal(error, null)
        response.redirect(
          AuthorizationEndPoint.makeAuthorizationCodeQueryString(result),
        )
      } catch (e) {
        response
          .status(500)
          .json({ error: 'error in authorization code generation.' })
      }
    })
  }
}

export default AuthorizationEndPoint
