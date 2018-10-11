import * as assert from 'assert'
import AccessTokenType from './tokens/access_token/AccessToken'
import { Oauth2ErrorTypes } from './errors/Errors'

class AuthorizationHeader {
  public static Bearer = AccessTokenType.Bearer
  public static Basic = 'Basic'
}

class AuthorizationHeaderMiddleware {
  /*
     * request MUST contain header with name "Authorization".
     * */

  public static headerExists(request, response, next: () => void) {
    const header: string = request.header('Authorization')
    try {
      assert.notEqual(typeof header, typeof undefined)
      response.locals.authorizationHeader = header
      next()
    } catch (e) {
      const error = request.app
        .get('Oauth2Error')
        .find(Oauth2ErrorTypes.InvalidRequest)
      response.status(error.statusCode).json(error.json)
    }
  }

  /*
     * request MUST contain Basic authorization header.
     * */
  public static basicAuthorizationRequired(
    request,
    response,
    next: () => void,
  ) {
    try {
      const authorizationHeaderArray = response.locals.authorizationHeader.split(
        ' ',
      )
      assert.equal(authorizationHeaderArray[0], AuthorizationHeader.Basic)
      response.locals.authorizationHeader = {
        identifier: authorizationHeaderArray[0],
        value: authorizationHeaderArray[1],
      }
      next()
    } catch (e) {
      const error = request.app
        .get('Oauth2Error')
        .find(Oauth2ErrorTypes.InvalidRequest)
      response.status(error.statusCode).json(error.json)
    }
  }

  /*
     * Bearer Authorization
     * authorization header value is access_token
     * after this we have access_token in string.
     * */
  public static bearerAuthorizationRequired(
    request,
    response,
    next: () => void,
  ) {
    try {
      const authorizationHeaderArray = response.locals.authorizationHeader.split(
        ' ',
      )
      assert.equal(authorizationHeaderArray[0], AuthorizationHeader.Bearer)
      response.locals.authorizationHeader = {
        identifier: authorizationHeaderArray[0],
        value: authorizationHeaderArray[1],
      }
      next()
    } catch (e) {
      const error = request.app
        .get('Oauth2Error')
        .find(Oauth2ErrorTypes.InvalidGrant)
      response.status(error.statusCode).json(error.json)
    }
  }

  /*
     * Basic client authentication
     * authorization header value is base64
     * base64encode and separate with ":"
     * */
  public static parseBasicAuthorizationHeader(
    request,
    response,
    next: () => void,
  ) {
    const base64ClientCredential = response.locals.authorizationHeader.value
    const base64Buffer: Buffer = new Buffer(base64ClientCredential, 'base64')
    const clientCredentialArray = base64Buffer.toString().split(':')
    let clientCredential: any = {}
    try {
      assert.equal(clientCredentialArray.length, 2)
      clientCredential = {
        clientId: clientCredentialArray[0],
        clientSecret: clientCredentialArray[1],
      }
      response.locals.client = {
        clientId: clientCredential.clientId,
      }
      response.locals.clientCredential = clientCredential
      next()
    } catch (e) {
      response.locals.clientCredential = null
      response.locals.client = null
      const error = request.app
        .get('Oauth2Error')
        .find(Oauth2ErrorTypes.InvalidClient)
      response.status(error.statusCode).json(error.json)
    }
  }
}

export { AuthorizationHeader, AuthorizationHeaderMiddleware }
