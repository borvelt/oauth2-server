import * as assert from "assert";
import {Response, Request} from "express";
import Models from "../../../utils/compileModels";
import Config from "../../../configs";

class RefreshTokenMiddleware {

    public static validateRefreshToken(request: Request, response: Response, next: Function) {
        if (!response.locals.refreshToken) {
            next();
            return;
        }
        let token: any = response.locals.refreshToken;
        Models.RefreshToken.findOne({
            refreshToken: token,
            expires: {$gt: new Date().getTime()}
        }, (error, result) => {
            try {
                assert.equal(error, null);
                assert.notEqual(result, null);
                if (response.locals.refreshTokenRequested) {
                    response.locals.newAccessTokenExpires = new Date().getTime()
                        + Config.refreshedAccessTokenAge;
                }
                response.locals.refreshToken = result;
            } catch (e) {
                response.locals.refreshToken = null;
            }
            next();
        });
    }
}

export default RefreshTokenMiddleware