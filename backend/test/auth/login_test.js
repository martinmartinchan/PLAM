process.env.NODE_ENV = 'test';

let User = require('../../models/User');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../app');
const bcrypt = require('bcryptjs');

chai.use(chaiHttp);

describe('Test login', () => {
	before(async () => {
		//Clean the databas and Add a user before all tests
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

	it('Should login providing the correct username and password', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.have.own.property('access_token');
				expect(res.header).to.have.own.property('set-cookie');
				done();
			});
	});

	it('Should login providing the correct username in wrong case and password', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.have.own.property('access_token');
				expect(res.header).to.have.own.property('set-cookie');
				done();
			});
	});

	it('Should login providing the correct email and password', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.have.own.property('access_token');
				expect(res.header).to.have.own.property('set-cookie');
				done();
			});
	});

	it('Should login providing the correct email in wrong case and password', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.have.own.property('access_token');
				expect(res.header).to.have.own.property('set-cookie');
				done();
			});
	});

	it('Should not login providing no username or email', done => {
		const loginInfo = {
			password: "ABC123"
		}
		chai.request(app)
			.post('/api/auth/login')
			.set('content-type', 'application/json')
			.send(loginInfo)
			.end((req, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.not.have.own.property('access_token');
				expect(res.header).to.not.have.own.property('set-cookie');
				done();
			});
	});

	it('Should not login providing the both username and email', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.not.have.own.property('access_token');
				expect(res.header).to.not.have.own.property('set-cookie');
				done();
			});
	});

	it('Should not login providing username that does not exist in the database', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.not.have.own.property('access_token');
				expect(res.header).to.not.have.own.property('set-cookie');
				done();
			});
	});

	it('Should not login providing email that does not exist in the database', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.not.have.own.property('access_token');
				expect(res.header).to.not.have.own.property('set-cookie');
				done();
			});
	});

	it('Should not login providing incorrect password', done => {
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
				expect(res.body).to.have.own.property('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.not.have.own.property('access_token');
				expect(res.header).to.not.have.own.property('set-cookie');
				done();
			});
	});
});