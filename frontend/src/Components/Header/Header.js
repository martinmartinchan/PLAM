import React, { Component } from 'react';
import Config from 'Config';

class Header extends Component {
	constructor(props) {
		super(props)
		this.state = {
			username: null,
		}
	}

	async componentDidMount() {
		const response = await fetch(Config.serverURL + '/api/users/token', {
			method: 'GET',
			mode: 'cors',
			credentials: 'include',
			headers: {'Content-Type': 'application/json', 'access_token': this.props.access_token}
		});
		const data = await response.json();
		if (data.success) {
			this.setState({
				username: data.result.username
			})
		}
	}

	render() {
		return <div>
			Welcome to PLAM {this.state.username}
		</div>
	}
}

export default Header;