import * as assert from "assert";
import Models from "../../../utils/compileModels";
import {Oauth2ErrorTypes} from "../../errors/Errors";

class AccessTokenMiddleware {
    /*
     * after this middle ware "response.locals.headerAccessToken" has access token model
     * nether has null value.
     *
     * this used for access_token that coming in to the request header.
     * */
    public static validateHeaderAccessToken(request, response, next: Function) {
        let token = response.locals.authorizationHeader.value;
        AccessTokenMiddleware.validate(token, (token) => {
            try {
                assert.notEqual(token, null);
                response.locals.headerAccessToken = token;
                next();
            } catch (e) {
                let error = request.app.get('Oauth2Error').find(Oauth2ErrorTypes.InvalidGrant);
                response.status(error.statusCode).json(error.json);
            }
        })
    }

    public static validateAccessToken(request, response, next: Function) {
        if (!response.locals.accessToken) {
            next();
            return;
        }
        let token = response.locals.accessToken;
        AccessTokenMiddleware.validate(token, (token) => {
            try {
                assert.notEqual(token, null);
                response.locals.accessToken = token;
            } catch (e) {
                response.locals.accessToken = null;
            }
            next();
        });
    }


    /*
     * @return access_token model to callback function
     * */
    private static validate(token, callback: Function) {
        Models.AccessToken.findOne({
            accessToken: token,
            expires: {$gt: new Date().getTime()}
        }, (error, result) => {
            try {
                assert.equal(error, null);
                assert.notEqual(result, null);
                callback(result);
            } catch (e) {
                callback(null);
            }
        });
    }

}

export default AccessTokenMiddleware