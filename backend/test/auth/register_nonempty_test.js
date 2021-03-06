
process.env.NODE_ENV = 'test';

let User = require('../../models/User');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../app');

chai.use(chaiHttp);

describe('Test auth register with an existing user', () => {
	beforeEach(async () => {
		//Clean the databas and Add a user before all tests
		await User.deleteMany({});
		const firstUser = new User({
			username: "TestUser",
			usernameLowerCase: "testuser",
			email: "test@user.com",
			password: "ABC123"
		});
		await firstUser.save();
	});

	it('Expect user posted with another name and another email', done => {
		user = {
			username: "TestUser2",
			email: "Test@User2.com",
			password: "ABC123"
		}
		chai.request(app)
			.post('/api/auth/register')
			.set('content-type', 'application/json')
			.send(user)
			.end((req, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.have.ownProperty('user_id');
				done();
			});
	});

	it('Expect no user posted using an existing name', done => {
		user = {
			username: "TestUser",
			email: "Test@User2.com",
			password: "ABC123"
		}
		chai.request(app)
			.post('/api/auth/register')
			.set('content-type', 'application/json')
			.send(user)
			.end((req, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.empty;
				done();
			});
	});

	it('Expect no user posted using an existing name in with different case', done => {
		user = {
			username: "testuser",
			email: "Test@User2.com",
			password: "ABC123"
		}
		chai.request(app)
			.post('/api/auth/register')
			.set('content-type', 'application/json')
			.send(user)
			.end((req, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.empty;
				done();
			});
	});

	it('Expect no user posted using an existing email', done => {
		user = {
			username: "TestUser2",
			email: "Test@User.com",
			password: "ABC123"
		}
		chai.request(app)
			.post('/api/auth/register')
			.set('content-type', 'application/json')
			.send(user)
			.end((req, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.empty;
				done();
			});
	});

	it('Expect no user posted using an existing email with different case', done => {
		user = {
			username: "TestUser2",
			email: "test@user.com",
			password: "ABC123"
		}
		chai.request(app)
			.post('/api/auth/register')
			.set('content-type', 'application/json')
			.send(user)
			.end((req, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.empty;
				done();
			});
	});
});