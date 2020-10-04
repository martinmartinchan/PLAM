import React, { Component } from "react";

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

	login(access_token) {
		this.props.login(access_token)
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
						login = {(access_token) => this.login(access_token)}
					/>
				</div>
			</div>
		</div>
	}
}

export default Login;
