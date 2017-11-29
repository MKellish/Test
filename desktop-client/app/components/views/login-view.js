import React, { Component } from "react";
import ReactDom from "react-dom";
import { Input, Button } from "react-photonkit";
import Banner from '../common/banner';

class LoginView extends Component {

	render() {
		return (
			<div>
				<Banner text="On this page, please enter any relevant image notes."/>
				<h1> Login </h1> 
				<Input placeholder="Email" type="text" /> 
				<Input placeholder="Password" type="password" />
				<Button text="Login" />
			</div>

		)
	}
}

export default LoginView;
