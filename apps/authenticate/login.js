/**
* Handle Authentication tasks
*/
class Authenticate {
  /**
  * Do nothing for now
  */
  constructor() {}

  // eslint-disable-next-line valid-jsdoc
  /**
   * Authenticate user
   * @param {String} user
   * @param {String} pass
   * @param {String} type
   */
  login({user, pass, type}) {
    console.log(user);
    console.log(pass);
    console.log(type);
    return true;
  }
}

module.exports = {Authenticate};
