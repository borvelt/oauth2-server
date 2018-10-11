import { Router } from 'express'
import TokenIntrospection from './tokenIntrospectionClass'
import { ContentTypesMiddleware } from '../../ContentTypes'
import { AuthorizationHeaderMiddleware } from '../../AuthorizationHeaders'
import AccessTokenMiddleware from '../../tokens/access_token/AccessTokenMiddleware'
import { TokenTypesMiddleware } from '../../TokenTypes'
import RequestBodyMiddleware from '../../RequestBody'
import RefreshTokenMiddleware from '../../tokens/refresh_token/refreshTokenMiddleware'
const router: any = Router()

/*
 * Place your routes about token endpoint.
 * */
/*
 * Request for Access Token Introspection
 * */
router.post(
  '/',
  ContentTypesMiddleware.checkWWWForm,
  AuthorizationHeaderMiddleware.headerExists,
  AuthorizationHeaderMiddleware.bearerAuthorizationRequired,
  AccessTokenMiddleware.validateHeaderAccessToken,
  RequestBodyMiddleware.isTokenFieldExist,
  TokenTypesMiddleware.checkTokenTypeHint,
  TokenTypesMiddleware.isRefreshToken,
  TokenTypesMiddleware.isAccessToken,
  TokenTypesMiddleware.isUnknown,
  AccessTokenMiddleware.validateAccessToken,
  RefreshTokenMiddleware.validateRefreshToken,
  TokenIntrospection.introspect,
)

export default router
