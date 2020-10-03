process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');
const PlantPost = require('../../models/PlantPost');
const app = require('../../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Test plantpost latest', () => {
	before(async () => {
		//Clean the database
		await User.deleteMany({});
		await PlantPost.deleteMany({});

		// Add user
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
		this.user_id = firstUser._id;

		// Add 5 new posts
		let newPlantPost;
		for (let i = 1; i <= 5; i++) {
			newPlantPost = new PlantPost({
				title: 'Post ' + i.toString(),
				owner: this.user_id
			});
			await newPlantPost.save();
		}
	});

	it('Expect request to return all 5 posts if no count is passed', done => {
		chai.request(app)
			.get('/api/plantpost/latest')
			.end((req, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.be.instanceOf(Array);
				expect(res.body.result).to.have.length(5);
				expect(res.body.result[0].title).to.be.equal('Post 5');
				expect(res.body.result[1].title).to.be.equal('Post 4');
				expect(res.body.result[2].title).to.be.equal('Post 3');
				expect(res.body.result[3].title).to.be.equal('Post 2');
				expect(res.body.result[4].title).to.be.equal('Post 1');
				done();
			});
	});

	it('Expect request to return all posts if count is greater than number of posts in the database', done => {
		chai.request(app)
			.get('/api/plantpost/latest?count=20')
			.end((req, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.be.instanceOf(Array);
				expect(res.body.result).to.have.length(5);
				expect(res.body.result[0].title).to.be.equal('Post 5');
				expect(res.body.result[1].title).to.be.equal('Post 4');
				expect(res.body.result[2].title).to.be.equal('Post 3');
				expect(res.body.result[3].title).to.be.equal('Post 2');
				expect(res.body.result[4].title).to.be.equal('Post 1');
				done();
			});
	});

	it('Expect request to return the latest 3 posts count is set to 3', done => {
		chai.request(app)
			.get('/api/plantpost/latest?count=3')
			.end((req, res) => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.be.instanceOf(Array);
				expect(res.body.result).to.have.length(3);
				expect(res.body.result[0].title).to.be.equal('Post 5');
				expect(res.body.result[1].title).to.be.equal('Post 4');
				expect(res.body.result[2].title).to.be.equal('Post 3');
				done();
			});
	});

	it('Expect request to be failed if count not a number ', done => {
		chai.request(app)
			.get('/api/plantpost/latest?count=3s')
			.end((req, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				done();
			});
	});

	it('Expect request to be failed if count is not an integer', done => {
		chai.request(app)
			.get('/api/plantpost/latest?count=3.5')
			.end((req, res) => {
				expect(res).to.have.status(400);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.false;
				done();
			});
	});

	it('Expect request to return empty array if database is empty and count is not set', async () => {
		await PlantPost.deleteMany({});

		return chai.request(app)
			.get('/api/plantpost/latest')
			.then(res => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.be.instanceOf(Array);
				expect(res.body.result).to.have.length(0);
			});
	});

	it('Expect request to return empty array if database is empty and count is set', async () => {
		await PlantPost.deleteMany({});

		return chai.request(app)
			.get('/api/plantpost/latest?count=5')
			.then(res => {
				expect(res).to.have.status(200);
				expect(res.body).to.have.ownProperty('message');
				expect(res.body.success).to.be.true;
				expect(res.body.result).to.be.instanceOf(Array);
				expect(res.body.result).to.have.length(0);
			});
	});

});