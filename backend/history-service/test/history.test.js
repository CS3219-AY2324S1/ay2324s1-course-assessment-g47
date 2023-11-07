const chai = require('chai');
const chaiHttp = require('chai-http');
const appForHistory = require('../history'); // Replace with the actual path

chai.use(chaiHttp);
const expect = chai.expect;

describe('Code Attempt API', () => {
    it('should insert code attempt if it does not exist', async () => {
        const response = await chai
            .request(appForHistory)
            .post('/api/history/manage-code-attempt')
            .send({
                currUsername: 'user3@example.com',
                matchedEmail: 'user4@example.com',
                roomId: '789012',
                question: {
                    title: 'Another Question',
                    complexity: 'Medium',
                    category: 'Algorithm',
                    description: 'This is another sample question.',
                    createdAt: '2023-02-01T00:00:00.000Z',
                    updatedAt: '2023-02-01T00:00:00.000Z',
                },
                codeText: 'function add(a, b) { return a + b; }',
                language: 'javascript',
                currDateTime: '2023-02-02T14:30:00.000Z',
            });
    
        expect(response).to.have.status(200);
        expect(response.body).to.deep.equal({
            message: 'Code attempt inserted successfully into the database for storage.',
        });
    });

    it('should update code attempt if it exists', async () => {
        const response = await chai
            .request(appForHistory)
            .post('/api/history/manage-code-attempt')
            .send({
                currUsername: 'user3@example.com',
                matchedEmail: 'user4@example.com',
                roomId: '789012',
                question: {
                    title: 'Sample Question',
                    complexity: 'Easy',
                    category: 'Programming',
                    description: 'This is a sample question.',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                },
                codeText: 'console.log("Hello, World!");',
                language: 'javascript',
                currDateTime: '2023-01-02T12:00:00.000Z',
            });

        expect(response).to.have.status(200);
        expect(response.body).to.deep.equal({
            message: 'Code attempt updated successfully into the database for storage.',
            data: {
                currUsername: 'user3@example.com',
                matchedEmail: 'user4@example.com',
                roomId: '789012',
                question: {
                    title: 'Sample Question',
                    complexity: 'Easy',
                    category: 'Programming',
                    description: 'This is a sample question.',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                },
                codeText: 'console.log("Hello, World!");',
                language: 'javascript',
                currDateTime: '2023-01-02T12:00:00.000Z',
            },
        });
    });
});
    