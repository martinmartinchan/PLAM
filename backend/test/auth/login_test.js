process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');
const app = require('../../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Test auth login', () => {
	before(async () => {
		//Clean the database and Add a user before all tests
		await User.deleteMany({});

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
	});

	it('Expect login success providing the correct username and password', done => {
		const loginInfo = {
			username: "TestUser",
			password: "ABC123"
		}
		chai.request(app)
			.post('/api/auth/login')
			.set('content-type', 'application/json')
			.send(loginInfo)
			.end((req, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.have.ownProperty('access_token');
				expect(res.header).to.have.ownProperty('set-cookie');
				done();
			});
	});

	it('Expect login success providing the correct username in wrong case and password', done => {
		const loginInfo = {
			username: "tEsTuSeR",
			password: "ABC123"
		}
		chai.request(app)
			.post('/api/auth/login')
			.set('content-type', 'application/json')
			.send(loginInfo)
			.end((req, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.have.ownProperty('access_token');
				expect(res.header).to.have.ownProperty('set-cookie');
				done();
			});
	});

	it('Expect login success providing the correct email and password', done => {
		const loginInfo = {
			email: "test@user.com",
			password: "ABC123"
		}
		chai.request(app)
			.post('/api/auth/login')
			.set('content-type', 'application/json')
			.send(loginInfo)
			.end((req, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.have.ownProperty('access_token');
				expect(res.header).to.have.ownProperty('set-cookie');
				done();
			});
	});

	it('Expect login success providing the correct email in wrong case and password', done => {
		const loginInfo = {
			email: "TeSt@usEr.Com",
			password: "ABC123"
		}
		chai.request(app)
			.post('/api/auth/login')
			.set('content-type', 'application/json')
			.send(loginInfo)
			.end((req, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.have.ownProperty('access_token');
				expect(res.header).to.have.ownProperty('set-cookie');
				done();
			});
	});

	it('Expect login failure providing no username or email', done => {
		const loginInfo = {
			password: "ABC123"
		}
		chai.request(app)
			.post('/api/auth/login')
			.set('content-type', 'application/json')
			.send(loginInfo)
			.end((req, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.not.have.ownProperty('access_token');
				expect(res.header).to.not.have.ownProperty('set-cookie');
				done();
			});
	});

	it('Expect login failure providing the both username and email', done => {
		const loginInfo = {
			username: "TestUser",
			email: "test@user.com",
			password: "ABC123"
		}
		chai.request(app)
			.post('/api/auth/login')
			.set('content-type', 'application/json')
			.send(loginInfo)
			.end((req, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.not.have.ownProperty('access_token');
				expect(res.header).to.not.have.ownProperty('set-cookie');
				done();
			});
	});

	it('Expect login failure providing username that does not exist in the database', done => {
		const loginInfo = {
			username: "NoUser",
			password: "ABC123"
		}
		chai.request(app)
			.post('/api/auth/login')
			.set('content-type', 'application/json')
			.send(loginInfo)
			.end((req, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.not.have.ownProperty('access_token');
				expect(res.header).to.not.have.ownProperty('set-cookie');
				done();
			});
	});

	it('Expect login failure providing email that does not exist in the database', done => {
		const loginInfo = {
			email: "NoEmail@where.com",
			password: "ABC123"
		}
		chai.request(app)
			.post('/api/auth/login')
			.set('content-type', 'application/json')
			.send(loginInfo)
			.end((req, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.not.have.ownProperty('access_token');
				expect(res.header).to.not.have.ownProperty('set-cookie');
				done();
			});
	});

	it('Expect login failure providing incorrect password', done => {
		const loginInfo = {
			username: "TestUser",
			password: "ABS123"
		}
		chai.request(app)
			.post('/api/auth/login')
			.set('content-type', 'application/json')
			.send(loginInfo)
			.end((req, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.not.have.ownProperty('access_token');
				expect(res.header).to.not.have.ownProperty('set-cookie');
				done();
			});
	});
});