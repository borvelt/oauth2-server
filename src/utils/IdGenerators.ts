import * as uuid from 'uuid'

class IdGenerators {
  private static tokenGenerator() {
    return uuid.v4()
  }

  public static clientId() {
    return (new Date().getTime() + Math.random())
      .toString()
      .replace('.', '')
      .split('')
      .reverse()
      .join('')
  }

  public static authorizationCode() {
    return IdGenerators.tokenGenerator()
  }

  public static accessToken() {
    return IdGenerators.tokenGenerator()
  }

  public static refreshToken() {
    return IdGenerators.tokenGenerator()
  }
}

export default IdGenerators
