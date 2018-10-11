import { Request, Response } from 'express'
import * as assert from 'assert'
import { TokenTypes } from '../../TokenTypes'

class TokenIntrospection {
  private readonly $introspectionResponse: any = {
    active: false,
    exp: null,
    scopes: null,
    token_type: null,
    client_id: null,
  }

  private readonly $response: Response

  constructor(request: Request, response) {
    this.$response = response
  }

  public static createInstance(request, response) {
    return new TokenIntrospection(request, response)
  }

  public static introspect(request: Request, response: Response) {
    const $this: TokenIntrospection = TokenIntrospection.createInstance(
      request,
      response,
    )
    switch ($this.$response.locals.tokenTypeHint) {
      case null:
        $this.accessToken(() => {
          $this.refreshToken()
        })
        break
      case TokenTypes.AccessToken:
        $this.accessToken(() => {
          $this.$response.status(200).json($this.$introspectionResponse)
        })
        break
      case TokenTypes.RefreshToken:
        $this.refreshToken()
    }
  }

  private accessToken(next: () => void) {
    const accessTokenResponse = this.$introspectionResponse
    const result = this.$response.locals.accessToken
    try {
      assert.notEqual(result, null)
      accessTokenResponse.active = true
      accessTokenResponse.exp = result.expires
      accessTokenResponse.scopes = result.scopes
      accessTokenResponse.token_type = TokenTypes.AccessToken
      accessTokenResponse.client_id = result.client.clientId
      this.$response.status(200).json(accessTokenResponse)
    } catch (e) {
      next()
    }
  }

  private refreshToken() {
    const refreshTokenResponse = this.$introspectionResponse
    const result = this.$response.locals.refreshToken
    try {
      assert.notEqual(result, null)
      refreshTokenResponse.exp = result.expires
      refreshTokenResponse.scopes = result.scopes
      refreshTokenResponse.token_type = TokenTypes.RefreshToken
      refreshTokenResponse.client_id = result.client.clientId
      this.$response.status(200).json(refreshTokenResponse)
    } catch (e) {
      this.$response.status(200).json(refreshTokenResponse)
    }
  }
}

export default TokenIntrospection
