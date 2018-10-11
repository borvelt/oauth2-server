import { GrantTypes } from '../../GrantTypes'
import { ResponseTypes } from '../../ResponseTypes'

/*
 * this class and methods run on client save.
 * (onSave)
 * */
class Validation {
  public static GrantType = {
    validator(v) {
      return GrantTypes.toArray().indexOf(v) !== -1
    },
    message: 'Invalid value for GrantType',
  }

  public static ResponseType = {
    validator(v) {
      return (
        [
          ResponseTypes.Code,
          ResponseTypes.IdToken,
          ResponseTypes.Token,
        ].indexOf(v) !== -1
      )
    },
    message: 'Invalid value for ResponseType',
  }
}

export default Validation
