import * as assert from 'assert'

class AuthorizationCode {
  /*
    * after create access_token in authorization_code grant type
    * we should expire authorization_code
    * */
  public static expiresAuthorizationCode(request, response, next: () => void) {
    if (!response.locals.authorizationCode) {
      next()
      return
    }
    response.locals.authorizationCode.expires = new Date().getTime()
    response.locals.authorizationCode.save((error, result) => {
      try {
        assert.equal(error, null)
        next()
      } catch (e) {
        response
          .status(500)
          .json({ error: 'error on authorization code expiration' })
      }
    })
  }
}

export default AuthorizationCode
