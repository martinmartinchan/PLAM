import React, { Component } from 'react';

import Config from 'Config';
import Header from './Header';
import Home from './Home';

class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: null,
			plantposts: []
		}
	}

	componentDidMount() {
		// Fetch the user information
		fetch(Config.serverURL + '/api/users/token', {
			method: 'GET',
			mode: 'cors',
			credentials: 'include',
			headers: {'Content-Type': 'application/json', 'access_token': this.props.access_token}
		})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				this.setState({
					username: data.result.username
				})
			}
		})
		.catch(err => console.log(err));

		// Fetch the latest 20 plants
		fetch(Config.serverURL + '/api/plantpost/latest?count=20', {
			method: 'GET',
			mode: 'cors',
			credentials: 'include',
			headers: {'Content-Type': 'application/json'}
		})
		.then(response => response.json())
		.then(data => {
			if (data.success) {
				this.setState({
					plantposts: data.result
				})
			} else {
				this.setState({
					plantposts: [],
				})
			}
		})
		.catch(err => console.log(err));
	}

	render() {
		return <div>
			<Header
				username = {this.state.username}
			/>
			<Home
				plantposts = {this.state.plantposts}
			/>
		</div>
	}
}

export default Main