process.env.NODE_ENV = 'test';

let User = require('../../models/User');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../app');

chai.use(chaiHttp);

describe('Test auth register on an empty database', () => {
	beforeEach(async () => {
		// Clean the database before all tests
		await User.deleteMany({});
	});

	it('Expect user posted with username, password, and email', done => {
		user = {
			username: "TestUser",
			email: "test@user.com",
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

	it('Expect no user posted without username', done => {
		user = {
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

	it('Expect no user posted without email', done => {
		user = {
			username: "TestUser",
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

	it('Expect no user posted without password', done => {
		user = {
			username: "TestUser",
			email: "test@user.com"
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

	it('Expect no user posted with too short of a username', done => {
		user = {
			username: "A",
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

	it('Expect no user posted with too long of a username', done => {
		let longUsername = "";
		for (let i = 0; i < 256; i++) {
			longUsername += "a"
		}
		user = {
			username: longUsername,
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

	it('Expect no user posted with username containing special characters', done => {
		user = {
			username: "TestUser?",
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

	it('Expect no user posted with too short of a password', done => {
		user = {
			username: "TestUser",
			email: "test@user.com",
			password: "ABC12"
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

	it('Expect no user posted with invalid email', done => {
		user = {
			username: "TestUser",
			email: "testuser.com",
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