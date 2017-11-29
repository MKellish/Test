import React, { Component, PropTypes } from "react";
import ReactDom from "react-dom";
import { Button } from "react-photonkit" 

import CaptureView from './camera-view/capture-view';
import ValidateView from './camera-view/validate';
import ImageNotesView from './camera-view/image-notes-view';

import ContentSwitcher from '../content-switcher'; 
import {subviewKeys} from './camera-view/view-keys';

const CAPTURE_SUBVIEWS = {
	[subviewKeys.ACQUIRE]: CaptureView, // Acquisition View
	[subviewKeys.VALIDATE]: ValidateView, // Validate image view
	[subviewKeys.IMAGE_NOTES]: ImageNotesView, // Image Notes View
}

class CameraView extends Component {

	render() {
		return (
		<div>
			{
				/*
				 * ContentSwitcher renders the subviews for the CameraView
				 * flow, and allows those subviews to switch between each other 
				 * as needed (while passing data between the views).
				 *
				 * TODO(suyashkumar): This may be too much magic, may be worth 
				 * removing the abstraction and maing the logic plainer (even though
				 * this may lead to repitition in the future). 
				 */
			
			}
			<ContentSwitcher 
				viewMap={CAPTURE_SUBVIEWS}
				defaultViewKey={subviewKeys.ACQUIRE} /> 

		</div>
		)

	}
}

export default CameraView;
