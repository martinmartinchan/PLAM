import React, { useState, useEffect, useRef } from 'react';
import Config from 'Config';

import style from './styles/Form.css';

export default function Form(props) {
	// Boolean to keep track of whether user is trying to log in or sign up
	const [signingUp, setSigningUp] = useState(false);
	// Status message displayed at the top of the form
	const [statusMessage, setStatusMessage] = useState('');
	// States to control the form
	const [loginUsername, setLoginUsername] = useState('');
	const [loginPassword, setLoginPassword] = useState('');
	const [signUpUsername, setSignUpUsername] = useState('');
	const [signUpEmail, setsignUpEmail] = useState('');
	const [signUpPassword, setsignUpPassword] = useState('');
	// A ref to keep track of and cancel timeouts that is used for the status
	const timeoutRef = useRef(null);


	const login = async function() {
		try {
			const loginData = {
				username: document.getElementById('loginUsername').value,
				password: document.getElementById('loginPassword').value
			}
			const response = await fetch(Config.serverURL + '/api/auth/login', {
				method: 'POST',
				mode: 'cors',
				credentials: 'include',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(loginData)
			})
			const data = await response.json();
			if (data.success) {
				props.login()
			} else {
				setStatusMessage(data.message);
			}
		} catch(err) {
			setStatusMessage(err.toString());
		}
	}

	const signUp = async function() {
		const singUpData = {
			username: document.getElementById('signUpUsername').value,
			email: document.getElementById('signUpEmail').value,
			password: document.getElementById('signUpPassword').value,
		}
		const response = await fetch(Config.serverURL + '/api/auth/register', {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(singUpData),
			mode: 'cors'
		})
		const data = await response.json();
		if (data.success) {
			setSigningUp(false);
		}
		setStatusMessage(data.message);
	}

	useEffect(() => {
		// If status message was updated to something that is not an empty string
		// Set a timeout switch back the status to an empty string after a while
		if (statusMessage != '') {
			// Cancel any existing timeouts first
			if (timeoutRef.current !== null) {
				clearTimeout(timeoutRef.current);
			}

			timeoutRef.current = setTimeout(() => {
				setStatusMessage('');
			}, Config.Login.timeoutTime);
		}
	}, [statusMessage])

	if (!signingUp) {
		// If not signing up, return login form
		return <div className={style.container}>
			<div className={style.statusMessage}>
				{statusMessage}
			</div>
				<div className={style.formContainer}>
					<div className={style.inputContainerParent}>
						<div className={style.inputContainer}>
							<input
								type='text'
								className={style.loginInput}
								placeholder=' '
								id='loginUsername'
								value={loginUsername}
								onChange={e => setLoginUsername(e.target.value)}
							>
							</input>
							<span className={style.loginInputLabel}>Username</span>
						</div>
					<div className={style.inputContainer}>
						<input
							type='password'
							className={style.loginInput}
							placeholder=' '
							id='loginPassword'
							value={loginPassword}
							onChange={e => setLoginPassword(e.target.value)}
						>
						</input>
						<span className={style.loginInputLabel}>Password</span>
					</div>
				</div>
				<div className={style.buttonContainer}>
					<button className={style.loginButton} onClick={async () => {await login()}}>Login</button>
					<button className={style.loginButton} onClick={() => {setSigningUp(true)}}>Sign up</button>
				</div>
		  </div>
		</div>
	} else {
		// If signing up, return sign up form
		return <div className={style.container}>
			<div className={style.loginFailure}>
				{statusMessage}
			</div>
				<div className={style.formContainer}>
					<div className={style.inputContainerParent}>
						<div className={style.inputContainer}>
							<input
								type='text'
								className={style.loginInput}
								placeholder=' '
								id='signUpUsername'
								value={signUpUsername}
								onChange={e => setSignUpUsername(e.target.value)}
							>
							</input>
							<span className={style.loginInputLabel}>Username</span>
						</div>
					<div className={style.inputContainer}>
						<input
							type='text'
							className={style.loginInput}
							placeholder=' '
							id='signUpEmail'
							value={signUpEmail}
							onChange={e => setsignUpEmail(e.target.value)}
						>
						</input>
						<span className={style.loginInputLabel}>Email</span>
					</div>
					<div className={style.inputContainer}>
						<input
							type='password'
							className={style.loginInput}
							placeholder=' '
							id='signUpPassword'
							value={signUpPassword}
							onChange={e => setsignUpPassword(e.target.value)}
						>
						</input>
						<span className={style.loginInputLabel}>Password</span>
					</div>
				</div>
				<div className={style.buttonContainer}>
					<button className={style.loginButton} onClick={() => {signUp()}}>Sign up</button>
				</div>
		  </div>
		</div>
	}
}