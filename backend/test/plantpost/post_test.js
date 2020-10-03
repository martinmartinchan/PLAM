process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const PlantPost = require('../../models/PlantPost');
const app = require('../../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Test plantpost post', () => {
	before(async () => {
		//Clean the database and Add a user before all tests
		await User.deleteMany({});
		await PlantPost.deleteMany({});

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
		this.user_id = firstUser._id;
	});

	it('Expect post to be posted if access token is provided and post is formatted corectly', done => {
		const newPlantPost = {
			title: 'Test post'
		}
		chai.request(app)
			.post('/api/plantpost')
			.set('Content-type', 'Application/json')
			.set('access_token', this.test_access_token)
			.send({ post: newPlantPost })
			.end((req, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result.owner).to.be.equal(this.user_id.toString());
				expect(res.body.result.title).to.be.equal('Test post');
				done();
			});
	});

	it('Expect post to not be posted if access token incorrect', done => {
		const newPlantPost = {
			title: 'Test post'
		}
		chai.request(app)
			.post('/api/plantpost')
			.set('Content-type', 'Application/json')
			.set('access_token', this.test_access_token + 'abc')
			.send({ post: newPlantPost })
			.end((req, res) => {
				expect(res).to.have.status(401);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				done();
			});
	});

	it('Expect post to not be posted if there is no title', done => {
		const newPlantPost = {
			description: 'Test post'
		}
		chai.request(app)
			.post('/api/plantpost')
			.set('Content-type', 'Application/json')
			.set('access_token', this.test_access_token)
			.send({ post: newPlantPost })
			.end((req, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				done();
			});
	});

	it('Expect post to be posted without additional fields that does not belong to a plant post', done => {
		const newPlantPost = {
			title: 'Test post',
			randomThing: 'Lets test it out!'
		}
		chai.request(app)
			.post('/api/plantpost')
			.set('Content-type', 'Application/json')
			.set('access_token', this.test_access_token)
			.send({ post: newPlantPost })
			.end((req, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.not.have.ownProperty('randomThing');
				done();
			});
	});

	it('Expect post to be posted with description and image added', done => {
		const newPlantPost = {
			title: 'Test post',
			description: 'This is a test post',
			image: 'Somewhere lies a nice plant image',
			randomThing: 'Lets test it out!'
		}
		chai.request(app)
			.post('/api/plantpost')
			.set('Content-type', 'Application/json')
			.set('access_token', this.test_access_token)
			.send({ post: newPlantPost })
			.end((req, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result.title).to.be.equal('Test post');
				expect(res.body.result.description).to.be.equal('This is a test post');
				expect(res.body.result.image).to.be.equal('Somewhere lies a nice plant image');
				expect(res.body.result).to.not.have.ownProperty('randomThing');
				done();
			});
	});
});