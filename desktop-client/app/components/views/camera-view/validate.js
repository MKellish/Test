// @flow 
import React, { Component, PropTypes } from "react";
import ReactDom from "react-dom";
import { Button } from "react-photonkit" 
import { subviewKeys } from './view-keys';
const { ipcRenderer } = require('electron')


class ValidateView extends Component {

	renderValidateButtons = () => {
		const buttonStyle = {
			height: '40px',
			width: '90px',
			margin: '10px',
		}
		return (
			<div>
				<Button
					text="YES"
					glyph="check"
					style={buttonStyle}
					onClick={ () => {
						this.props.changeView(subviewKeys.IMAGE_NOTES, {
							dataURI: this.props.previousViewData.dataURI,
						})
					}}/>

				<Button
					text="NO"
					glyph="cancel"
					onClick={() => this.props.changeView(subviewKeys.ACQUIRE, {})}
					style={buttonStyle}/>
			</div>
        );
	}

	render() {
		return (
		<div>
			<h3>Is this the image you wanted?</h3>
			{this.renderValidateButtons()}
			<div>
				<img style={{width:'95%'}} src={this.props.previousViewData.dataURI} />
			</div>
			{this.renderValidateButtons()}

		</div>

		);
	}
}

ValidateView.propTypes = {
	previousViewData: PropTypes.object.isRequired,
	changeView: PropTypes.func.isRequired,
}

export default ValidateView;
