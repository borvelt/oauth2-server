import * as assert from 'assert'

class TokenTypes {
  public static AccessToken = 'access_token'
  public static RefreshToken = 'refresh_token'

  public static toArray() {
    return [TokenTypes.AccessToken, TokenTypes.RefreshToken]
  }
}

/*
 * Token type hints are not mandatory.
 * they just help us to find token better.
 * */

class TokenTypesMiddleware {
  public static checkTokenTypeHint(request, response, next: () => void) {
    try {
      assert.notEqual(
        TokenTypes.toArray().indexOf(request.body.token_type_hint),
        -1,
      )
      response.locals.tokenTypeHint = request.body.token_type_hint
    } catch (e) {
      response.locals.tokenTypeHint = null
    }
    next()
  }

  public static isRefreshToken(request, response, next: () => void) {
    try {
      assert.equal(TokenTypes.RefreshToken, response.locals.tokenTypeHint)
      response.locals.refreshToken = request.body.token
    } catch (e) {
      response.locals.refreshToken = null
    }
    next()
  }

  public static isAccessToken(request, response, next: () => void) {
    try {
      assert.equal(TokenTypes.AccessToken, response.locals.tokenTypeHint)
      response.locals.accessToken = request.body.token
    } catch (e) {
      response.locals.accessToken = null
    }
    next()
  }

  /*
     * Maybe client don't know or may forget to tell us which token has sent.
     * */
  public static isUnknown(request, response, next: () => void) {
    try {
      assert.equal(response.locals.tokenTypeHint, null)
      response.locals.accessToken = request.body.token
      response.locals.refreshToken = request.body.token
    } catch (e) {
      // empty block
    }
    next()
  }
}

export { TokenTypes, TokenTypesMiddleware }
