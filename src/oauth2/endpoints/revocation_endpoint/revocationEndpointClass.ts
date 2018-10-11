import * as assert from 'assert'
import { Response, Request } from 'express'
import { TokenTypes } from '../../TokenTypes'

class RevocationEndpoint {
  private readonly $response: Response
  private $token: any

  constructor(request: Request, response: Response) {
    this.$response = response
  }

  public static createInstance(request: Request, response: Response) {
    return new RevocationEndpoint(request, response)
  }

  /*
     * revoke requested token
     * access_token, refresh token, or undefined type
     *
     * */
  public static revoke(request, response) {
    const $this: RevocationEndpoint = RevocationEndpoint.createInstance(
      request,
      response,
    )
    switch ($this.$response.locals.tokenTypeHint) {
      case null:
        $this.isAccessToken(() => {
          $this.isRefreshToken()
        })
        break
      case TokenTypes.AccessToken:
        $this.$token = response.locals.accessToken
        $this.revokeToken()
        break
      case TokenTypes.RefreshToken:
        $this.$token = response.locals.refreshToken
        $this.revokeToken()
    }
  }

  /*
     * revoke preparation if token is accessToken
     * */
  private isAccessToken(next: () => void) {
    this.$token = this.$response.locals.accessToken
    try {
      assert.notEqual(this.$token, null)
      this.revokeToken()
    } catch (e) {
      next()
    }
  }

  /*
     * revoke preparation if token is refresh_token
     * */
  private isRefreshToken() {
    this.$token = this.$response.locals.refreshToken
    this.revokeToken()
  }

  /*
     * revocation process
     * */
  private revokeToken() {
    try {
      assert.notEqual(this.$token, null)
      this.$token.expires = new Date().getTime()
      this.$token.save(error => {
        try {
          assert.equal(error, null)
          this.$response.status(200).json({})
        } catch (e) {
          this.$response.header('Retry-After', '5min')
          this.$response.status(500).json({ error: 'server_error' })
        }
      })
    } catch (e) {
      this.$response.status(200).json({})
    }
  }
}

export default RevocationEndpoint
