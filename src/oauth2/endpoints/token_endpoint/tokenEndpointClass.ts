import {Request, Response} from "express";
import * as assert from "assert";
import Models from "../../../utils/compileModels";
import IdGenerators from "../../../utils/IdGenerators";
import Config from "../../../configs";
import {GrantTypes} from "../../GrantTypes";
import RefreshToken from "../../tokens/refresh_token/refreshTokenClass";
import {Oauth2ErrorTypes} from "../../errors/Errors";

class TokenEndpoint {

    private $data: any;
    private $request;
    private $response;

    constructor(request:Request, response:Response) {
        this.$request = request;
        this.$response = response;
        this.$data = {
            accessToken: IdGenerators.accessToken(),
            client: this.$response.locals.client,
            user: this.$response.locals.user,
        };
    }

    public static createInstance(request:Request, response: Response) {
        return new TokenEndpoint(request, response);
    }


    /*
     * HTTP redirect for Implicit grant type.
     * */
    private presentAccessTokenImplicitGrantType() {
        let redirectString = this.$data.redirectUri + '/#access_token='
            + this.$data.accessToken + "&state=" + this.$data.state
            + "&expires=" + this.$data.expires + "&token_type=" + this.$data.type;
        this.$response.redirect(302, redirectString);
    }


    /*
     * return access token and refresh token.
     * */
    private presentAccessTokenAuthorizationCodeGrantType() {
        if (Config.refreshTokenAvailable) {
            RefreshToken.create(this.$request, this.$response, (refreshToken) => {
                this.$response.status(200).json({
                    access_token: this.$data.accessToken,
                    token_type: this.$data.type,
                    expires: this.$data.expires,
                    refreshToken: refreshToken.refreshToken
                });
            });
        } else {
            this.$response.status(200).json({
                access_token: this.$data.accessToken,
                token_type: this.$data.type,
                expires: this.$data.expires
            });
        }
    }

    /*
     * return only access_token in client credential grant type
     * */
    private AccessTokenClientCredentialGrantType() {
        this.$response.status(200).json({
            access_token: this.$data.accessToken,
            token_type: this.$data.type,
            expires: this.$data.expires
        });
    }

    /*
     * request coming to this method
     * */
    public static accessToken(request, response) {
        let $this: TokenEndpoint = TokenEndpoint.createInstance(request, response);
        /*
        * create callbacks
        * depend on request type this callbacks will evaluate and run after access_token create.
        * */
        let authorizationCodeGrantTypeCallback: Function = () => {
        };
        let implicitGrantTypeCallback: Function = () => {
        };
        let refreshTokenGrantTypeCallback: Function = () => {
        };
        let clientCredentialsGrantTypeCallback: Function = () => {
        };
        switch ($this.$response.locals.grantType) {
            case GrantTypes.AuthorizationCode:
                $this.$data.scopes = $this.$response.locals.authorizationCode.scopes;
                authorizationCodeGrantTypeCallback = () => {
                    $this.presentAccessTokenAuthorizationCodeGrantType();
                };
                break;
            case GrantTypes.Implicit:
                $this.$data.scopes = $this.$response.locals.scopes;
                implicitGrantTypeCallback = () => {
                    $this.$data.redirectUri = $this.$request.query.redirect_uri;
                    $this.$data.state = $this.$request.query.state;
                    $this.presentAccessTokenImplicitGrantType();
                };
                break;
            case GrantTypes.ClientCredentials:
                $this.$data.scopes = $this.$response.locals.scopes;
                clientCredentialsGrantTypeCallback = () => {
                    $this.AccessTokenClientCredentialGrantType();
                };
                break;
            case GrantTypes.RefreshToken:
                try {
                    assert.notEqual($this.$response.locals.refreshToken, null);
                } catch (e) {
                    let error = request.app.Oauth2Error.find(Oauth2ErrorTypes.InvalidRequest);
                    $this.$response.status(error.statusCode).json(error.json);
                    return;
                }
                $this.$data.scopes = $this.$response.locals.refreshToken.scopes;
                $this.$data.expires = response.locals.newAccessTokenExpires;
                refreshTokenGrantTypeCallback = () => {
                    $this.presentAccessTokenAuthorizationCodeGrantType();
                };
                break;
            default:
                response.status(200).json({error: true});
                return;
                break;
        }
        (new Models.AccessToken($this.$data)).save((error, result) => {
            try {
                assert.equal(error, null);
                $this.$data = result;
                authorizationCodeGrantTypeCallback();
                implicitGrantTypeCallback();
                refreshTokenGrantTypeCallback();
                clientCredentialsGrantTypeCallback();
            } catch (e) {
                response.status(200).json({error: e.toString()});
            }
        });
    }

}

export default TokenEndpoint