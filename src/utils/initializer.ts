import Models from './compileModels'
import { Connection } from './mongoose.odm'
import HashMaker from './hashMaker'

function initialize() {
  Connection.establish()

  try {
    new Models.Scope({
      name: 'home_ctrl',
      description: "Let's Control Your Home",
      isDefault: true,
    }).save()

    //kitchen scopes
    new Models.Scope({
      name: 'change_ref_temp',
      description:
        'Change your refrigerator Temperature. You Can not turn it off!',
    }).save()

    new Models.Scope({
      name: 'change_oven_temp',
      description: 'Change your Oven Temperature',
    }).save()

    new Models.Scope({
      name: 'turn_on_off_washer',
      description:
        "Change Your Washer Status, You Can Turn Washer On Only If It's Full Or 1/2.",
    }).save()

    //other
    new Models.Scope({
      name: 'view_CCTV_backyard',
      description: 'View CCTV That Installed In BackYard',
    }).save()

    new Models.Scope({
      name: 'view_CCTV_yard',
      description: 'View CCTV That Installed In Yard, You Can See Main Door.',
    }).save()

    new Models.Scope({
      name: 'turn_on_off_AC',
      description: "Take Control of Air Conditioning, It's Good for Dads.",
    }).save()

    console.log('scopes insertion done')
  } catch (e) {
    console.log(e.toString())
  }

  try {
    HashMaker.make('#user', secret => {
      new Models.User({
        username: 'borvelt@gmail.com',
        secret: secret,
        age: 23,
        firstName: 'Mohamad',
        lastName: 'Taheri',
      }).save((error, result) => {
        try {
          HashMaker.make('#client', secret => {
            new Models.Client({
              clientId: '123456789',
              clientSecret: secret,
              clientName: 'homectrl Kitchen',
              redirectUri: ['http://localhost:3000/homectrl/kitchen'],
              grantTypes: [
                'authorization_code',
                'refresh_token',
                'implicit',
                'client_credentials',
              ],
              responseTypes: ['code', 'token'],
              scopes: [
                {
                  name: 'home_ctrl',
                  description: "Let's Control Your Home",
                  isDefault: true,
                },
                {
                  name: 'change_oven_temp',
                  description: 'Change your Oven Temperature',
                },
                {
                  name: 'change_ref_temp',
                  description:
                    'Change your refrigerator Temperature. You Can not turn it off!',
                },
                {
                  name: 'turn_on_off_washer',
                  description:
                    "Change Your Washer Status, You Can Turn Washer On Only If It's Full Or 1/2.",
                },
              ],
              userId: result.id,
              preAuthorization: false,
            }).save()
            new Models.Client({
              clientId: '987654321',
              clientSecret: secret,
              clientName: 'homectrl OtherThings',
              redirectUri: ['http://localhost:3000/homectrl/other'],
              grantTypes: [
                'authorization_code',
                'refresh_token',
                'implicit',
                'client_credentials',
              ],
              responseTypes: ['code', 'token'],
              scopes: [
                {
                  name: 'home_ctrl',
                  description: "Let's Control Your Home",
                  isDefault: true,
                },
                {
                  name: 'view_CCTV_backyard',
                  description: 'View CCTV That Installed In BackYard',
                },
                {
                  name: 'view_CCTV_yard',
                  description:
                    'View CCTV That Installed In Yard, You Can See Main Door.',
                },
                {
                  name: 'turn_on_off_AC',
                  description:
                    "Take Control of Air Conditioning, It's Good for Dads.",
                },
              ],
              userId: result.id,
              preAuthorization: false,
            }).save()
          })
          console.log('clients insertion done')
        } catch (e) {
          console.log(e.toString())
        }
      })
    })
    console.log('user insertion done')
  } catch (e) {
    console.log(e.toString())
  }

  try {
    new Models.Error({
      error: 'invalid_request',
      errorDescription:
        'The request is missing a required parameter, includes an ' +
        'unsupported parameter value (other than grant type) repeats a parameter, includes ' +
        'multiple credentials utilizes more than one mechanism for authenticating the client, ' +
        'or is otherwise malformed.',
      code: 400,
    }).save()
    new Models.Error({
      error: 'invalid_client',
      errorDescription:
        'client authentication failed (e.g., unknown client, no client authentication ' +
        'included, or unsupported authentication method).  The authorization server MAY return an HTTP ' +
        '401 (Unauthorized) status code to indicate which HTTP authentication schemes are supported.  ' +
        'If the client attempted to authenticate via the "Authorization" request header field, the ' +
        'authorization server MUST respond with an HTTP 401 (Unauthorized) status code and include ' +
        'the "WWW-Authenticate" response header field matching the authentication scheme used by the ' +
        'client.',
      code: 400,
    }).save()
    new Models.Error({
      error: 'invalid_grant',
      errorDescription:
        'The provided authorization grant (e.g., authorization code, resource owner ' +
        'credentials) or refresh token is invalid, expired, revoked, does not match the redirection URI ' +
        'used in the authorization request, or was issued to another client.',
      code: 400,
    }).save()
    new Models.Error({
      error: 'unauthorized_client',
      errorDescription:
        'The authenticated client is not authorized to use this authorization grant type.',
      code: 400,
    }).save()
    new Models.Error({
      error: 'unsupported_grant_type',
      errorDescription:
        'The authorization grant type is not supported by the authorization server.',
      code: 400,
    }).save()
    new Models.Error({
      error: 'invalid_scope',
      errorDescription:
        'The requested scope is invalid, unknown, malformed, or exceeds the scope ' +
        'granted by the resource owner.',
      code: 400,
    }).save()
    console.log('errors imported')
  } catch (e) {
    console.log(e.toString())
  }
}

export default initialize
