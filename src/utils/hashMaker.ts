import * as assert from 'assert'
import * as pbkdf2 from 'pbkdf2'

class HashMaker {
  public static make(raw: string, callback) {
    const hash = pbkdf2.pbkdf2Sync(raw, 'salt', 1, 32, 'sha512').toString('hex')
    const opts: any = {
      password: hash,
      salt: 'salt',
    }
    callback(opts)
  }

  public static check(raw: string, secret, callback) {
    let checkResult: boolean
    const hash = pbkdf2
      .pbkdf2Sync(raw, secret.salt, 1, 32, 'sha512')
      .toString('hex')
    try {
      assert.equal(hash, secret.password)
      checkResult = true
    } catch (e) {
      checkResult = false
    }
    if (typeof callback === typeof (x => x)) {
      callback(checkResult)
    }
  }
}

export default HashMaker
