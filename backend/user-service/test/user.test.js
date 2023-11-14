require('dotenv').config();

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../postgresql');
const jwt = require('jsonwebtoken');
const pool = require("../database");

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


describe('User API Test', function () {
    // Before running the tests, empty the database
    before((done) => {
        const truncateQuery = 'TRUNCATE TABLE accounts RESTART IDENTITY;'; // Replace with the appropriate SQL to truncate your table

        pool.query(truncateQuery, (err, result) => {
        if (err) {
            console.error('Error truncating table:', err);
            done(err);
        } else {
            console.log('Table truncated successfully.');
            done();
        }
        });
    });

    describe('User Registration API', () => {
        it('should register a new user', (done) => {
        const newUser = {
            username: 'testuser',
            email: 'test@example.com',
            password: 'testpassword',
        };
    
        chai
            .request(app)
            .post('/api/users/register')
            .send(newUser)
            .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message').to.equal('Account Created!');
            expect(res.body.data).to.deep.equal(newUser);
            done();
            });
        });
    
        it('should handle duplicate email registration', (done) => {
        const existingUser = {
            username: 'existinguser',
            email: 'test@example.com', // Use the same email as in the previous test
            password: 'existingpassword',
        };
    
        chai
            .request(app)
            .post('/api/users/register')
            .send(existingUser)
            .end((err, res) => {
            expect(err).to.be.null;
            expect(res).to.have.status(401);
            expect(res.body).to.have.property('message').to.equal('Email already exists');
            done();
            });
        });
    });

    describe('Fetch User Info API', () => {
        // Assuming you have a variable to store the access token globally
        const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const token = generateValidToken(user, tokenSecret);

        it('should fetch user info by user ID', (done) => {
          const userIdToFetch = '1'; // Replace with an actual user ID from your database
      
          chai
            .request(app)
            .post(`/api/users/fetch/${userIdToFetch}`)
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
              expect(err).to.be.null;
              expect(res).to.have.status(200);
              expect(res.body).to.have.property('message').to.equal('User found');
              expect(res.body).to.have.property('user');
              // Add more assertions based on the expected response
              console.log("result",res.body);
              done();
            });
        });
      
        it('should handle non-existent user ID', (done) => {
            const nonExistentUserId = '999'; // Replace with a non-existent user ID
            const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
            const token = generateValidToken(user, tokenSecret);
        
            chai
                .request(app)
                .post(`/api/users/fetch/${nonExistentUserId}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error').to.equal('Account not found');
                done();
                });
        });
      });
    
    describe('Delete User API', () => {
        it('should delete a user by email', (done) => {
            const tokenSecret = process.env.ACCESS_TOKEN_SECRET;
            const token = generateValidToken(user, tokenSecret);
            const userToDelete = {
                email: 'test@example.com',
            };
            chai
                .request(app)
                .post('/api/users/delete')
                .set('Authorization',`Bearer ${token}`) 
                .send(userToDelete)
                .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message').to.equal('Deleted successful');
                expect(res.body.data).to.deep.equal(userToDelete);
                done();
                });
        });
    });
});

