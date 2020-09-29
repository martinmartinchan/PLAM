import React, { useState } from 'react';
import style from './styles/Form.css';

export default function Form(props) {

	// Boolean to keep track of whether user is trying to log in or sign up
	const [signingUp, setSigningUp] = useState(false);
	const [loginFailMessage, setloginFailMessage] = useState('');

	if (!signingUp) {
		// If not signing up, return login form
		return <div className={style.container}>
			<div className={style.loginFailure}>
				{loginFailMessage}
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
					<button className={style.loginButton} onClick={() => {setSigningUp(true)}}>Sign up</button>
				</div>
		  </div>
		</div>
	} else {
		// If signing up, return sign up form
		return <div>Lets sign up</div>
	}
}