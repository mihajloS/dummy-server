const jwt = require('../../jwt/jwt');
const log = require('../../logger').logger;
const Router = require('express').Router;
const router = new Router();

/**
* Authenticate and respond with JWT token
* or error
* @param {Object} req
* @param {Object} res
*/
router.route('/jwt').post(async (req, res) => {
  // FIXME creating false positive scenario
  const fakeuser = {
    username: 'Mihajlo',
    password: 'password',
    id: 1,
  };

  try {
    const token = await jwt.signToken(fakeuser);
    res.json({token});
  } catch (err) {
    log.info('err: ' + err);
    res.status(401);
    res.json('Authentication error');
  }
});

router.route('/jwt/test').post(async (req, res) => {
  try {
    const data = await jwt.validateToken(req);
    res.json(data);
  } catch (err) {
    log.error('Token validate: ' + err);
    res.status(401);
    res.json('Invalid token');
  }
});

module.exports = router;
