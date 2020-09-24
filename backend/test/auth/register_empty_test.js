process.env.NODE_ENV = 'test';

let User = require('../../models/User');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../app');

chai.use(chaiHttp);

describe('Test register on an empty database', () => {
	beforeEach(async () => {
		// Clean the database before all tests
		await User.deleteMany({});
	});

	it('Should post a user with username, password, and email', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.have.own.property('user_id');
				done();
			});
	});

	it('Should not post a user without username', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.empty;
				done();
			});
	});

	it('Should not post a user without email', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.empty;
				done();
			});
	});

	it('Should not post a user without password', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.empty;
				done();
			});
	});

	it('Should not post a user with too shost username', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.empty;
				done();
			});
	});

	it('Should not post a user with too long username', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.empty;
				done();
			});
	});

	it('Should not post a user with username containing special characters', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.empty;
				done();
			});
	});

	it('Should not post a user with username containing special characters', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.empty;
				done();
			});
	});

	it('Should not post a user with too short password', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.empty;
				done();
			});
	});

	it('Should not post a user with invalid email', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.empty;
				done();
			});
	});
});