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

describe('Question API Test', function () {
  let createdQuestionId;

  describe('POST /api/questions', function () {
    it('should create a new question for authorized users', function (done) {
      const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const token = generateValidToken(user, tokenSecret);

      const newQuestion = {
        title: 'New Question',
        complexity: 'Medium',
        category: ['String'],
        description: 'This is a new question.',
      };

      chai.request(app)
        .post('/api/questions/')
        .set('Authorization', `Bearer ${token}`)
        .send(newQuestion)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          createdQuestionId = res.body._id;
          done();
        });
    });

    it('should return an error for missing required fields', function (done) {

      const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const token = generateValidToken(user, tokenSecret);

      const incompleteQuestion = {
        title: 'Incomplete Question',
        // Missing other required fields
      };

      chai.request(app)
        .post('/api/questions/')
        .set('Authorization', `Bearer ${token}`)
        .send(incompleteQuestion)
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });

  describe('GET /api/questions', function () {
    it('should return all questions for authenticated users', function (done) {

        // Choose the token secret based on the environment
        const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const token = generateValidToken(user, tokenSecret);
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

  describe('GET /api/questions/:id', function () {
    it('should return a single question for authenticated users', function (done) {
      const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const token = generateValidToken(user, tokenSecret);

      // Assuming there is at least one question in the database
      chai.request(app)
        .get(`/api/questions/${createdQuestionId}`) // Update with the correct question ID
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });

    it('should return an error for an invalid question ID', function (done) {
      const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const token = generateValidToken(user, tokenSecret);

      const invalidQuestionId = '123';

      chai.request(app)
        .get(`/api/questions/${invalidQuestionId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
      });
    });
  });

  describe('PATCH /api/questions/:id', function () {
    it('should update a question for authorized users', function (done) {
      this.timeout(10000);

      const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const token = generateValidToken(user, tokenSecret);

      // Assuming there is at least one question in the database
      const updatedQuestionData = {
        title: 'Updated Question Title',
      };

      chai.request(app)
        .patch(`/api/questions/${createdQuestionId}`) // Update with the correct question ID
        .set('Authorization', `Bearer ${token}`)
        .send(updatedQuestionData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });
    it('should return an error for updating an invalid question ID', function (done) {
      this.timeout(10000);

      const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const token = generateValidToken(user, tokenSecret);

      const invalidQuestionId = '123';

      const updatedQuestionData = {
        title: 'Updated Question Title',
      };

      chai.request(app)
        .patch(`/api/questions/${invalidQuestionId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedQuestionData)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe('DELETE /api/questions/:id', function () {
    it('should delete a question for authorized users', function (done) {
      const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const token = generateValidToken(user, tokenSecret);

      // Assuming there is at least one question in the database
      chai.request(app)
        .delete(`/api/questions/${createdQuestionId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });

    it('should return an error for deleting an invalid question ID', function (done) {
      this.timeout(10000);

      const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
      const token = generateValidToken(user, tokenSecret);

      const invalidQuestionId = '123';

      chai.request(app)
        .delete(`/api/questions/${invalidQuestionId}`)
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

});