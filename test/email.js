process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
chai.use(chaiHttp);

/** Email testss */
describe('Email', () =>{
  describe('SEND email', () => {
    it('it should use \"contact_mihajlo\" api correctly', (done)=>{
      const newEmail = {from: 'unit@test.com',
        message: 'Hey you. I am your unit test!'};
      chai.request(server)
          .post('/contact_mihajlo')
          .send(newEmail)
          .end((err, res) => {
            if (err) done(err);
            checkEmailPositiveRes(newEmail, res);
            done();
          });
    });
  });
});

/**
 * Compare sent and received email
 * @param {Object} sent
 * @param {Object} res
 */
function checkEmailPositiveRes(sent, res) {
  res.should.have.status(200);
  res.body.should.have.property('_id');
  res.body.should.have.property('from').eql(sent.from);
  res.body.should.have.property('message').eql(sent.message);
  res.body.should.have.property('createdAt');
}
