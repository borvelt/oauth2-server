import * as assert from "assert";
import Models from "../../../utils/compileModels";
import {Oauth2ErrorTypes} from "../../errors/Errors";


class AuthorizationCodeMiddleware {
    /*
     * @return "response.locals.authorizationCode" with AuthorizationCode model.
     * */
    public static validateAuthorizationCode(request, response, next) {
        if (!response.locals.authorizationCode) {
            next();
            return;
        }
        let receivedAuthorizationCode = response.locals.authorizationCode;
        Models.AuthorizationCode.findOne({
            authorizationCode: receivedAuthorizationCode,
            expires: {$gt: new Date().getTime()}
        }, (error, result) => {
            try {
                assert.equal(error, null);
                assert.notEqual(result, null);
                response.locals.authorizationCode = result;
                next();
            } catch (e) {
                response.locals.authorizationCode = null;
                let error = request.app.get('Oauth2Error').find(Oauth2ErrorTypes.InvalidRequest);
                response.status(error.statusCode).json(error.json);
            }
        })
    }

    /*
     * validate requested redirect_uri and authorizationCode redirect_uri
     * */
    public static validateRedirectUri(request, response, next) {
        if (!response.locals.authorizationCode) {
            next();
            return;
        }
        try {
            assert.equal(request.body.redirect_uri, response.locals.authorizationCode.redirectUri);
            next();
        } catch (e) {
            let error = request.app.get('Oauth2Error').find(Oauth2ErrorTypes.InvalidRequest);
            response.status(error.statusCode).json(error.json);
        }
    }
}

export default AuthorizationCodeMiddleware