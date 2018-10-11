import * as assert from 'assert'
import Models from '../../utils/compileModels'
import { Oauth2ErrorTypes } from '../errors/Errors'

class ScopesMiddleware {
  /*
     * check scopes that defined as a mandatory scopes
     * clients have to request them.
     * */
  public static checkMandatoryScopes(request, response, next: () => void) {
    const requestedScopes: string[] = response.locals.scopes.split(' ')
    let mandatoryScopes: any[]
    Models.Scope.find({ isDefault: true }, (error, result) => {
      try {
        assert.equal(error, null)
        assert.notEqual(result, null)
        mandatoryScopes = result
      } catch (e) {
        mandatoryScopes = []
      }
      for (const mscope of mandatoryScopes) {
        if (requestedScopes.indexOf(mscope.name) === -1) {
          const oauth2Error = request.app
            .get('Oauth2Error')
            .find(Oauth2ErrorTypes.InvalidRequest)
          response.status(oauth2Error.statusCode).json(oauth2Error.json)
          return
        }
      }
      next()
    })
  }

  /*
     * @return scopes model.
     *
     * */
  public static getScopeModels(request, response, next: Function) {
    if (!response.locals.scopes) {
      next()
      return
    }
    let requestedScopes: any[]
    if (typeof response.locals.scopes === 'string') {
      requestedScopes = response.locals.scopes.split(' ')
    } else {
      requestedScopes = response.locals.scopes
    }
    const query: any = { $or: [] }
    for (const scope in requestedScopes) {
      if (requestedScopes.hasOwnProperty(scope)) {
        const scopeName: string = requestedScopes[scope]
        query.$or.push({ name: scopeName })
      }
    }
    Models.Scope.find(query, (error, result) => {
      try {
        assert.equal(error, null)
        response.locals.scopes = result
      } catch (e) {
        response.locals.scopes = null
      }
      next()
    })
  }

  /*
     * @return scopes that request from body.
     * */
  public static getBodyScopes(request, response, next: Function) {
    try {
      assert.notEqual(typeof request.body.scope, typeof undefined)
      response.locals.scopes = request.body.scope
    } catch (e) {
      response.locals.scopes = null
    }
    next()
  }

  /*
     * @return requested scopes from query params.
     * */
  public static getQueryScopes(request, response, next: Function) {
    try {
      assert.notEqual(typeof request.query.scope, typeof undefined)
      response.locals.scopes = request.query.scope
    } catch (e) {
      response.locals.scopes = null
    }
    next()
  }
}

export default ScopesMiddleware
