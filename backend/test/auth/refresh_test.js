process.env.NODE_ENV = 'test';

let User = require('../../models/User');

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../app');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
chai.use(chaiHttp);

describe('Test refresh', () => {
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
		const test_refresh_token = jwt.sign({ _id: firstUser._id }, process.env.REFRESH_SECRET, { expiresIn: 2592000 });
		this.test_refresh_token = test_refresh_token;
		this.user_id = firstUser._id;
	});

	it('Should refresh with correct cookie header sent', done => {
		chai.request(app)
			.post('/api/auth/refresh')
			.set('content-type', 'application/json')
			.set('Cookie', 'refresh=' + this.test_refresh_token)
			.send()
			.end((req, res) => {
				expect(res).to.have.status(200);
				expect(res.body.success).to.be.true;
				expect(res.body).to.have.own.property('message');
				expect(res.body.result).to.have.own.property('access_token');
				const verified = jwt.verify(res.body.result.access_token, process.env.ACCESS_SECRET, (err, decoded) => {
					expect(decoded._id.toString()).to.equal(this.user_id.toString());
					done();
				});
			});
	});

	it('Should not refresh with no cookie header sent', done => {
		chai.request(app)
			.post('/api/auth/refresh')
			.set('content-type', 'application/json')
			.send()
			.end((req, res) => {
				expect(res).to.have.status(400);
				expect(res.body.success).to.be.false;
				expect(res.body).to.have.own.property('message');
				expect(res.body.result).to.not.have.own.property('access_token');
				done();
			});
	});

	it('Should not refresh with incorrect refresh token in header', done => {
		chai.request(app)
			.post('/api/auth/refresh')
			.set('content-type', 'application/json')
			.set('Cookie', 'refresh=' + 'SomethingThatIsNotTheJSONWebRefreshToken')
			.send()
			.end((req, res) => {
				expect(res).to.have.status(401);
				expect(res.body.success).to.be.false;
				expect(res.body).to.have.own.property('message');
				expect(res.body.result).to.not.have.own.property('access_token');
				done();
			});
	});
});