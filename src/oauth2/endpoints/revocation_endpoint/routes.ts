import RevocationEndpoint from './revocationEndpointClass'
import { ContentTypesMiddleware } from '../../ContentTypes'
import { AuthorizationHeaderMiddleware } from '../../AuthorizationHeaders'
import ClientsEndpointMiddleware from '../clients_endpoint/clientsEndpointMiddleware'
import { TokenTypesMiddleware } from '../../TokenTypes'
import AccessTokenMiddleware from '../../tokens/access_token/AccessTokenMiddleware'
import RefreshTokenMiddleware from '../../tokens/refresh_token/refreshTokenMiddleware'
import RequestBodyMiddleware from '../../RequestBody'
import { Router } from 'express'

const router: any = Router()

/*
 * Place your routes about token endpoint.
 * */
/*
 * Request for Access Token
 * */
router.post(
  '/',
  ContentTypesMiddleware.checkWWWForm,
  AuthorizationHeaderMiddleware.headerExists,
  AuthorizationHeaderMiddleware.basicAuthorizationRequired,
  AuthorizationHeaderMiddleware.parseBasicAuthorizationHeader,
  ClientsEndpointMiddleware.clientRecognition,
  ClientsEndpointMiddleware.validateClientCredential,
  RequestBodyMiddleware.isTokenFieldExist,
  TokenTypesMiddleware.checkTokenTypeHint,
  TokenTypesMiddleware.isAccessToken,
  TokenTypesMiddleware.isRefreshToken,
  TokenTypesMiddleware.isUnknown,
  AccessTokenMiddleware.validateAccessToken,
  RefreshTokenMiddleware.validateRefreshToken,
  RevocationEndpoint.revoke,
)

export default router
