import React, { Component } from "react";
import style from '../styles/login.css';
import Config from 'Config';

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

	async login() {
		try {
			const loginData = {
				username: document.getElementById('username').value,
				password: document.getElementById('password').value
			}
			const response = await fetch(Config.serverURL + '/api/auth/login', {
				method: 'POST',
				mode: 'cors',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(loginData)
			})
			const data = await response.json();
			if (data.success) {
				this.props.login()
			} else {
				this.showFailedLoginMessage(data.message);
			}
		} catch(err) {
			this.showFailedLoginMessage(err.toString());
		}
	}

	showFailedLoginMessage(message) {
		this.setState({
			loginFailed: true,
			loginFailMessage: message
		}, () => {
			setTimeout(() => {
				this.setState({
					loginFailed: false,
					loginFailMessage: ''
				})
			}, 3000)
		})
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
					<div className={style.loginFailure}>
						{this.state.loginFailMessage}
					</div>
					<div className={style.formContainer}>
						<div className={style.inputContainerParent}>
							<div className={style.inputContainer}>
								<input type='text' className={style.loginInput} placeholder=' ' id='username'></input>
								<span className={style.loginInputLabel}>Username</span>
							</div>
							<div className={style.inputContainer}>
								<input type='password' className={style.loginInput} placeholder=' ' id='password'></input>
								<span className={style.loginInputLabel}>Password</span>
							</div>
						</div>
						<div className={style.buttonContainer}>
							<button className={style.loginButton} onClick={async () => {await this.login()}}>Login</button>
							<button className={style.loginButton}>Sign up</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	}
}

export default Login;
