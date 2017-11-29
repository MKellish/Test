import React, { Component, PropTypes } from "react";
import ReactDom from "react-dom";
import { Button } from "react-photonkit"
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CameraIcon from 'material-ui/svg-icons/action/camera-enhance';
import RefreshIcon from 'material-ui/svg-icons/action/cached';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import WebCamera from 'webcamjs';
import { subviewKeys } from './view-keys';
import ThumbnailArray from './capture-view/thumbnail-array';


class CaptureView extends Component {

	constructor(props) {
		super(props);
		this.state = {
			cameraID: '',
			cameras: [],
			cameraLoading: false,
			images: [],
		};
		this.getCameras();
	}

    componentDidMount(){
        window.addEventListener('keypress', this.handleKeyPress);
        console.log('Listening for key press (b)...')
    }

    componentWillUnmount(){
        window.removeEventListener('keypress', this.handleKeyPress);
		console.log('Not listening for key press...')
	}

	onCameraLoaded = () => {
    	this.setState({cameraLoading: false});
    	console.log("DONE LOADING");
	};

    handleWebcamJSError = e => {
    	if (e === undefined || e === null) return;
    	console.log(e);
    	switch(e.name) {
			case "ConstraintNotSatisfiedError":
				setTimeout(
					() => alert("The selected camera does NOT appear to be the Pocket Colposcope."),
					20
				);
				break;
			default:
				alert("Pocket Desktop ran into a webcam error: ", e.name);
		}
	};

	getCameras = () => {
		navigator.mediaDevices.enumerateDevices().then(
			(deviceInfo) => {
				const cameras = deviceInfo.filter(element => element.kind == "videoinput");
				console.log(cameras);
				this.setState({cameras}, () => {
					const cameraID = this.findColposcopeDevice(cameras);
					this.startCamera(cameraID);
				});
			}
		)
	};

	findColposcopeDevice = cameras => {
		for (let items in cameras) {
			if (cameras[items].label.indexOf('eb1a:299f') !== -1) {
				return cameras[items].deviceId;
			}
		}
		return "";
	};

	startCamera = cameraID => {
        // Do nothing if camera hasn't changed
		if (cameraID == this.state.cameraID && cameraID != "") {
			return;
		} else if (cameraID == "") {
			alert('No Pocket Colposcope detected.\n' +
				'1. Plug in the Pocket Colposcope\n' +
				'2. Click "OK"');
			this.setState({cameraID: ""});
			this.getCameras();
		} else {
			WebCamera.reset();

			// Reset camera state to loading
			this.setState({cameraLoading: true, cameraID: cameraID});

			// WebCamera Init
			WebCamera.params.jpeg_quallity = 100;
			WebCamera.params.dest_width = 2592;
			WebCamera.params.dest_height = 1944;
			WebCamera.hooks['load'] = [this.onCameraLoaded];
			WebCamera.hooks['error'] = [this.handleWebcamJSError];

			WebCamera.cameraID = cameraID;
			WebCamera.attach("#camera");
		}
	};

	snap = () => {
		WebCamera.snap( (data_uri) =>{ 
			this.setState({images: this.state.images.concat(data_uri)}); 
			// this.props.changeView(subviewKeys.IMAGE_NOTES, {dataURI: data_uri});
		});
	};

    handleKeyPress = event => {
	    if(event.key === 'b'){
	        console.log('Image capture triggered by foot switch');
            this.snap();
        }
    };

    handleCameraDropDownSelect = (event, index, value) => {
    	this.startCamera(value);
	};

	toNextView = () => {
		this.props.changeView(subviewKeys.IMAGE_NOTES, {images: this.state.images}); // go to next view, send along images
	}

	render() {
		const menuItems = this.state.cameras.map( item => {
            return (<MenuItem key={item.deviceId} value={item.deviceId} primaryText={item.label}/>);
        });
		return (
			<div style={{textAlign: 'center'}}>
			<div className="row center-md" style={{paddingTop: '20px'}}>
                { /* Configuration */ }
				<div className="col-md-3" style={{borderRight: '1px solid #e5e5e5'}}>
					<h3>Configuration</h3>
					<div style={{lineHeight: '50px', marginBottom: '10px', textAlign: 'center'}}>
						<DropDownMenu style={{display: 'inline-block', verticalAlign: 'middle'}} value={this.state.cameraID} onChange={this.handleCameraDropDownSelect}>
							{ menuItems }
						</DropDownMenu>
						<FlatButton
							style={{display: 'inline-block', verticalAlign: 'middle'}}
							icon={<RefreshIcon/>}
							onClick={this.getCameras}
						/>

					</div>
					<div>
						<FloatingActionButton onClick={this.snap}>
							<CameraIcon />
						</FloatingActionButton>
						<ThumbnailArray images={this.state.images} maxThumbnailWidth={'200px'}/>
					</div>
				</div>
				{ /* Imaging Live Feed */ }
				<div style={{display: 'inline-block'}} className="col-md-9">
					<h3> Live Feed </h3>
					{this.state.cameraLoading && <CircularProgress />}
					<div id="camera" style={{width: '800px', height: '533px', margin:'auto'}}>
					</div>
					<RaisedButton 
						label="Review Images" 
						style={{margin: '10px'}} 
						onClick={this.toNextView} 
						disabled={this.state.images == 0}
						primary/>
				</div>

			</div>
			</div>
		)
	}

}

CaptureView.propTypes = {
	previousViewData: PropTypes.object.isRequired,
	changeView: PropTypes.func.isRequired,
};

export default CaptureView;
