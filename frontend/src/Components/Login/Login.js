import React, { Component } from "react";
import Config from 'Config';

import Form from './Form.js';
import style from './styles/Login.css';

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			// set if login has been failed and message shall be displayed
			loginFailed: false,
			// Message to display when login is failed
			loginFailMessage: ''
		}
	}

	async componentDidMount() {
		try {
			const response = await fetch(Config.serverURL + '/api/auth/refresh', {
				method: 'POST',
				mode: 'cors',
				credentials: 'include',
				headers: {'Content-Type': 'application/json'}
			});
			const data = await response.json();
			if (data.success) {
				this.props.login()
			} // Else do nothing and load the login page
		} catch(err) {
			console.log(err.toString());
		}
	}

	login() {
		this.props.login()
	}

	render() {
		return <div className={style.container}>
			<div className={style.topDiv}>
				<div className={style.title}>
					PLAM
				</div>
			</div>
			<div className={style.bottomDiv}>
				<div className={style.centerWindow}>
					<Form
						login = {() => this.login()}
					/>
				</div>
			</div>
		</div>
	}
}

export default Login;
