require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const jwt = require('jsonwebtoken');

const { expect } = chai;
chai.use(chaiHttp);


// Example user object
const user = {
    user_id: '123',
    username: 'example_user',
    email: 'example@example.com',
    account_type: 'admin',
  };

const generateValidToken = (user, secret) => {
const accessToken = jwt.sign(user, secret, {
    expiresIn: '7d',
});

return accessToken;
};

describe('API Test', function () {

  describe('GET /api/questions', function () {

    it('should return all questions for authenticated users', function (done) {
        this.timeout(10000);

        // Choose the token secret based on the environment
        const tokenSecret = process.env.NODE_ENV === 'test-ci'
        ? 'serect.AUTH_TOKEN'
        : process.env.ACCESS_TOKEN_SECRET;
        const token = generateValidToken(user, tokenSecret);
        
        //console.log(token);
        chai.request(app)
        .get('/api/questions/')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            done();
        });
    });

  });

});