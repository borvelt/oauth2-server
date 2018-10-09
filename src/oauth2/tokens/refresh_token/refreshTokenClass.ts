import * as assert from "assert";
import IdGenerators from "../../../utils/IdGenerators";
import Models from "../../../utils/compileModels";
import Config from "../../../configs";


class RefreshToken {
    public static create(request, response, callback: Function) {
        if (!Config.refreshTokenAvailable) {
            callback(null);
        }
        let data: any = {
            refreshToken: IdGenerators.refreshToken(),
            client: response.locals.client,
            user: response.locals.user,
        };
        if (response.locals.authorizationCode) {
            data.scopes = response.locals.authorizationCode.scopes;
        } else if (response.locals.refreshToken) {
            data.scopes = response.locals.refreshToken.scopes;
        }
        (new Models.RefreshToken(data)).save((error, result) => {
            try {
                assert.equal(error, null);
                callback(result);
            } catch (e) {
                callback(null);
            }
        });
    }

    public static expiresRefreshToken(request, response, next: Function) {
        if(!response.locals.refreshToken) {
            next();
            return;
        }
        try {
            response.locals.refreshToken.expires = new Date().getTime();
            response.locals.refreshToken.save(error => {
                try {
                    assert.equal(error, null);
                    next();
                } catch (e) {
                    response.status(500).json({error: e.toString()});
                }
            });
        } catch (e) {
            response.status(500).json({error: e.toString()});
        }
    }


}

export default RefreshToken