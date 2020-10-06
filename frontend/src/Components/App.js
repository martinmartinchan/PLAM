import React, { Component } from "react";
import { Route, Switch, withRouter } from 'react-router-dom';
import Config from 'Config';

import Login from './Login/Login';
import Main from './Main/Main';


class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// Checks whether anyone is logged in
			loggedIn: false,
			// Holds the access_token
			access_token: null
		}
	}

	/**First thing to do is to check if someone is logged into this client
	 * and get the access_token if that's the case
	 */
	async componentDidMount() {
		try {
			const response = await fetch(Config.serverURL + '/api/auth/refresh', {
				method: 'POST',
				mode: 'cors',
				credentials: 'include',
				headers: {'Content-Type': 'application/json'}
			});
			const data = await response.json();
			// If refresh is successful, login
			if (data.success) {
				this.setLoggedIn(data.result.access_token);
			} else { // else render login page
				this.props.history.push('/login');
			}
		} catch(err) {
			console.log(err.toString());
		}
	}

	setLoggedIn(access_token) {
		this.setState({
			loggedIn: true,
			access_token: access_token
		}, () => {
			// Always go to home
			this.props.history.push('/');
		})
	}

	render() {
		return <Switch>
			<Route
				path = '/login'
				exact render = {
					() => <Login
						login = {(access_token) => this.setLoggedIn(access_token)}
					/>
				}
			/>
			<Route
				path = '/'
				render = {
					props =>
					<Main
						{...props}
						loggedIn = {this.state.loggedIn}
						access_token = {this.state.access_token}
					/>
				}
			/>
		</Switch>
	}
}

export default withRouter(App);