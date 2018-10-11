import { Router } from 'express'
import TokenEndpoint from './tokenEndpointClass'
import { ContentTypesMiddleware } from '../../ContentTypes'
import { AuthorizationHeaderMiddleware } from '../../AuthorizationHeaders'
import ClientsEndpointMiddleware from '../clients_endpoint/clientsEndpointMiddleware'
import { GrantTypesMiddleware } from '../../GrantTypes'
import { UsersMiddleware } from '../../../users/usersMiddleware'
import RefreshTokenMiddleware from '../../tokens/refresh_token/refreshTokenMiddleware'
import AuthorizationCodeMiddleware from '../../tokens/authorization_code/authorizationCodeMiddleware'
import ScopesMiddleware from '../../scopes/scopesMiddleware'
import AuthorizationCode from '../../tokens/authorization_code/authorizationCodeClass'
import RefreshToken from '../../tokens/refresh_token/refreshTokenClass'

const router: any = Router()

/*
 * Place your routes about token endpoint.
 * */
router.post(
  '/',
  ContentTypesMiddleware.checkWWWForm,
  UsersMiddleware.validateUserApplicant,
  AuthorizationHeaderMiddleware.headerExists,
  AuthorizationHeaderMiddleware.basicAuthorizationRequired,
  AuthorizationHeaderMiddleware.parseBasicAuthorizationHeader,
  ClientsEndpointMiddleware.clientRecognition,
  ClientsEndpointMiddleware.validateClientCredential,
  GrantTypesMiddleware.getGrantType,
  GrantTypesMiddleware.validateToNotBeImplicitGrantType,
  ScopesMiddleware.getBodyScopes,
  ClientsEndpointMiddleware.checkRequestedScopes,
  ScopesMiddleware.getScopeModels,
  GrantTypesMiddleware.isValidGrantType,
  GrantTypesMiddleware.getGrantType,
  GrantTypesMiddleware.isAuthorizationCodeGrantType,
  AuthorizationCodeMiddleware.validateAuthorizationCode,
  AuthorizationCodeMiddleware.validateRedirectUri,
  AuthorizationCode.expiresAuthorizationCode,
  GrantTypesMiddleware.isRefreshTokenGrantType,
  RefreshTokenMiddleware.validateRefreshToken,
  RefreshToken.expiresRefreshToken,
  TokenEndpoint.accessToken,
)

export default router
