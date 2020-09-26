import React, { Component } from "react";

import style from '../styles/login.css';

class Login extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <div className={style.container}>
			<div className={style.topDiv}>
				<div className={style.title}>
					PLAM
				</div>
			</div>
			<div className={style.bottomDiv}>
				<div className={style.formContainer}>
				</div>
			</div>
		</div>
	}
}

export default Login;
