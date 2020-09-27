import React, { Component } from "react";
import Login from './Login';


class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// Checks whether anyone is logged in
			loggedIn: false
		}
	}

	setLoggedIn() {
		this.setState({
			loggedIn: true
		})
	}

	render() {
		if (!this.state.loggedIn) {
			return <Login 
				login = {() => this.setLoggedIn()}
			/>
		} else {
			return <h1>Welcome!!! Stranger....</h1>
		}
	}
}

export default App;