import * as assert from 'assert'
import Models from '../../../utils/compileModels'
import HashMaker from '../../../utils/hashMaker'
import { Oauth2ErrorTypes } from '../../errors/Errors'

class ClientsEndpointMiddleware {
  /*
     * validate current client
     * create client object.
     * */
  public static clientRecognition(request, response, next) {
    let clientId: string = request.query.client_id
    if (!clientId) {
      clientId = response.locals.client.clientId
    }
    Models.Client.findOne({ clientId }, (error, result) => {
      try {
        assert.equal(null, error)
        assert.notEqual(null, result)
        response.locals.client = result
        next()
      } catch (e) {
        const oauthError = request.app
          .get('Oauth2Error')
          .find(Oauth2ErrorTypes.InvalidClient)
        response.status(oauthError.statusCode).json(oauthError.json)
      }
    })
  }

  /*
     * validate client credential
     * */
  public static validateClientCredential(request, response, next: () => void) {
    HashMaker.check(
      response.locals.clientCredential.clientSecret,
      response.locals.client.clientSecret,
      result => {
        try {
          assert(result)
          next()
        } catch (e) {
          const error = request.app
            .get('Oauth2Error')
            .find(Oauth2ErrorTypes.InvalidClient)
          response.status(error.statusCode).json(error.json)
        }
      },
    )
  }

  /*
     * check requested scope with scopes that client can request.
     * @return string of scopes separate with space ' '
     * */
  public static checkRequestedScopes(request, response, next: () => void) {
    if (!response.locals.scopes) {
      next()
      return
    }
    const requestedScopesArray: any[] = response.locals.scopes.split(' ')
    const permittedScopes: any[] = []
    try {
      for (const scope of response.locals.client.scopes) {
        if (requestedScopesArray.indexOf(scope.name) !== -1) {
          permittedScopes.push(scope.name)
        }
      }
      response.locals.scopes = permittedScopes.join(' ')
    } catch (e) {
      response.locals.scopes = ''
    }
    next()
  }

  /*
     * validate requested redirect_uri and client redirect_uris.
     * this just check or interrupt
     * */

  public static validateClientRedirectUri(request, response, next: () => void) {
    try {
      assert.notEqual(
        -1,
        response.locals.client.redirectUri.indexOf(request.query.redirect_uri),
      )
      next()
    } catch (e) {
      const error = request.app
        .get('Oauth2Error')
        .find(Oauth2ErrorTypes.InvalidRequest)
      response.status(error.statusCode).json(error.json)
    }
  }
}

export default ClientsEndpointMiddleware
