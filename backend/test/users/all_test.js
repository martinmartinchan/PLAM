process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');
const app = require('../../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Test users all', () => {
	before(async () => {
		//Clean the database and Add a user before all tests
		await User.deleteMany({});
	});

	it('Expect endpoint to return an empty array if database is empty', done => {
		chai.request(app)
			.get('/api/users/all')
			.end((req, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.be.instanceOf(Array);
				expect(res.body.result).to.have.length(0);
				done();
			});
	});

	it('Expect endpoint to return an array with one user', async () => {
		const password = "ABC123";
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const firstUser = new User({
			username: "TestUser",
			usernameLowerCase: "testuser",
			email: "test@user.com",
			password: hashedPassword
		});
		await firstUser.save();
		return chai.request(app)
			.get('/api/users/all')
			.then(res => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.be.instanceOf(Array);
				expect(res.body.result).to.have.length(1);
				expect(res.body.result[0].username).to.be.equal('TestUser');
				expect(res.body.result[0].email).to.be.equal('test@user.com');
				expect(res.body.result[0]).to.have.ownProperty('_id');
				expect(res.body.result[0]).to.not.have.ownProperty('password');
				expect(res.body.result[0]).to.not.have.ownProperty('usernameLowerCase');
			});
	});

	it('Expect endpoint to return an array with two users', async () => {
		const password = "ABC123";
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const secondUser = new User({
			username: "AnotherTestUser",
			usernameLowerCase: "anothertestuser",
			email: "anothertest@user.com",
			password: hashedPassword
		});
		await secondUser.save();
		return chai.request(app)
			.get('/api/users/all')
			.then(res => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.be.instanceOf(Array);
				expect(res.body.result).to.have.length(2);
			});
	});
});