import * as assert from "assert";
import Models from "../utils/compileModels";
import HashMaker from "../utils/hashMaker";

class UsersMiddleware {
    public static validateUserApplicant(request, response, next: Function) {
        Models.User.findOne({username: 'borvelt@gmail.com'}, (error, result) => {
            try {
                assert.notEqual(null, result);
                assert.equal(null, error);
                HashMaker.check('#user', result.secret, (password_result) => {
                    try {
                        assert(password_result);
                        response.locals.user = result;
                        next();
                    } catch (e) {
                        response.status(401).json({error: 'unauthenticated user'});
                    }
                });
            } catch (e) {
                response.status(401).json({error: 'unauthenticated user'});
            }
        });
    }
}

export {UsersMiddleware}