import React, { Component } from 'react';
import Config from 'Config';

class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
			plantposts: []
		}
	}

	async componentDidMount() {
		const response = await fetch(Config.serverURL + '/api/plantpost/latest?count=20', {
			method: 'GET',
			mode: 'cors',
			credentials: 'include',
			headers: {'Content-Type': 'application/json'}
		});
		const data = await response.json();
		if (data.success) {
			this.setState({
				plantposts: data.result
			})
		} else {
			this.setState({
				plantposts: [],
			})
		}
	}

	render() {
		const renderedPlantposts = [];
		this.state.plantposts.forEach(post => {
			renderedPlantposts.push(
				<div key={post._id}>
					{post.title}
				</div>
			)
		});
		return <div>
			{renderedPlantposts}
		</div>
	}
}

export default Home;