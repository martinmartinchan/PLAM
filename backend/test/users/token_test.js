process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const app = require('../../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Test users id', () => {
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
		const test_access_token = jwt.sign({ _id: firstUser._id }, process.env.ACCESS_SECRET, { expiresIn: 3600 });
		this.test_access_token = test_access_token;
	});

	it('Expect user to be returned if access token is passed in the header', done => {
		chai.request(app)
			.get('/api/users/token')
			.set('access_token', this.test_access_token)
			.end((req, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result.username).to.be.equal('TestUser');
				expect(res.body.result.email).to.be.equal('test@user.com');
				expect(res.body.result).to.have.ownProperty('_id');
				expect(res.body.result).to.not.have.ownProperty('password');
				expect(res.body.result).to.not.have.ownProperty('usernameLowerCase');
				done();
			});
	});

	it('Expect no user to be returned if no access token is passed in the header', done => {
		chai.request(app)
			.get('/api/users/token')
			.end((req, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.an('object').that.is.empty;
				done();
			});
	});

	it('Expect no user to be returned if incorrect access token is passed in the header', done => {
		chai.request(app)
			.get('/api/users/token')
			.set('access_token', this.test_access_token + 'abc')
			.end((req, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.an('object').that.is.empty;
				done();
			});
	});

	it('Expect no user to be returned if user was deleted but token remains', async () => {
		await User.deleteMany({});

		return chai.request(app)
			.get('/api/users/token')
			.set('access_token', this.test_access_token)
			.then((res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				expect(res.body.result).to.be.an('object').that.is.empty;
			});
	});
});