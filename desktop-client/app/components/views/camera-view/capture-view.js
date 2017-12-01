import React, { Component, PropTypes } from "react";
import ReactDom from "react-dom";
import { Button } from "react-photonkit"
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CameraIcon from 'material-ui/svg-icons/action/camera-enhance';
import RefreshIcon from 'material-ui/svg-icons/action/cached';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import StopSquare from 'material-ui/svg-icons/av/stop';
import RepeatIcon from 'material-ui/svg-icons/av/repeat';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import WebCamera from 'webcamjs';
import { subviewKeys } from './view-keys';
import ThumbnailArray from './capture-view/thumbnail-array';


class CaptureView extends Component {

	constructor(props) {
		super(props);
		var oldImages = (this.props.previousViewData.capturedImages == null) ? [] : this.props.previousViewData.capturedImages;
		this.state = {
			cameraID: '',
			cameras: [],
			cameraLoading: false,
			images: oldImages,
			cameraAttached: '',
			secondsElapsed: 0,
			height: window.innerHeight,
			width: window.innerWidth,
		};
		this.getCameras();
	}

	getSeconds = () => {
		return ('0' + this.state.secondsElapsed % 60).slice(-2);
	}

	getMinutes = () => {
		return Math.floor(this.state.secondsElapsed / 60);
	}

	handleStartClick = () => {
		var _this = this;

		this.incrementer = setInterval(function () {
			_this.setState({
				secondsElapsed: (_this.state.secondsElapsed + 1)
			})
		}, 1000)
	}

	handleStopClick = () => {
		clearInterval(this.incrementer);
	}

	handleResetClick = () => {
		clearInterval(this.incrementer);
		this.setState({
			secondsElapsed: 0
		})
	}

	updateDimensions = () => {
		this.setState({width: window.innerWidth, height: window.innerHeight});
		this.getCameras();
	}

	componentWillMount() {
		this.updateDimensions();
	}

	componentDidMount(){
		window.addEventListener('keypress', this.handleKeyPress);
		window.addEventListener("resize", this.updateDimensions);
		//console.log('Listening for key press (b)...')
	}

	componentWillUnmount(){
		window.removeEventListener('keypress', this.handleKeyPress);
		window.removeEventListener("resize", this.updateDimensions);
		//console.log('Not listening for key press...')
	}

	onCameraLoaded = () => {
    this.setState({cameraLoading: false});
    //console.log("DONE LOADING");
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
				//console.log(cameras);
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
				this.setState({cameraAttached: "Pocket Colposcope connected"});
				this.setState({cameraID: cameras[items].deviceId});
				return cameras[items].deviceId;
			}
		}
		this.setState({cameraAttached: 'Pocket Colposcope disconnected. Plug in USB cable.'});
		this.setState({cameraID: ''});
		return "";
	};

	startCamera = cameraID => {
    if (cameraID == "") {
			WebCamera.reset();
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
			WebCamera.params.width = this.state.height*0.8*4/3;
			WebCamera.params.height = this.state.height*0.8;
			WebCamera.hooks['load'] = [this.onCameraLoaded];
			WebCamera.hooks['error'] = [this.handleWebcamJSError];

			WebCamera.cameraID = cameraID;
			WebCamera.attach("#camera");
		}
	};

	snap = () => {
		WebCamera.snap( (data_uri) => {
			var imagesCopy = this.state.images.slice();
			imagesCopy.unshift(data_uri);
			this.setState({images: imagesCopy});
			// this.props.changeView(subviewKeys.IMAGE_NOTES, {dataURI: data_uri});
		});
	};

	handleKeyPress = event => {
		if(event.key === 'b'){
			//console.log('Image capture triggered by foot switch');
			this.snap();
		}
	};

	handleCameraDropDownSelect = (event, index, value) => {
		this.startCamera(value);
	};

	toImageNotesView = () => {
		this.props.changeView(subviewKeys.IMAGE_NOTES, {images: this.state.images.slice().reverse()}); // go to next view, send along images
	}

	render() {
		return (
			<div style={{textAlign: 'center'}}>
			<div className="row center-md" style={{paddingTop: '0px'}}>
			{ /* Camera Control Panel */ }
				<div className="col-md-3" style={{borderRight: '2px solid #e5e5e5'}}>
					<h3>Camera Control Panel</h3>
					<div style={{lineHeight: '50px', marginBottom: '10px', textAlign: 'center'}}>
						<p style={{lineHeight: '20px'}}>{this.state.cameraAttached}</p>
						<FlatButton
							style={{display: 'inline-block', verticalAlign: 'middle'}}
							icon={<RefreshIcon/>}
							label={'Refresh'}
							onClick={this.getCameras}
						/>
					</div>
					<div>
						<FloatingActionButton onClick={this.snap}>
							<CameraIcon />
						</FloatingActionButton>
					</div>
					{/* Image thumbnails */}
					<div style={{height: '250px', marginTop: '20px', overflow: 'auto'}}>
						<ThumbnailArray images={this.state.images} maxThumbnailWidth={'200px'}/>
					</div>
					{/* Acetic Acid Timer */}
					<div style={{paddingBottom: '10px', margin: '10px', borderTop: '2px solid #e5e5e5'}}>
						<h3>Acetic Acid Timer</h3>
						<div className="row-center-md">
							<div className="col-md-7" style={{display: 'inline-block'}}>
								<h1>{this.getMinutes()}:{this.getSeconds()}</h1>
							</div>
							<div className="col-md-5" style={{display: 'inline-block'}}>
								<RaisedButton style={{marginBottom: '3px'}} labelPosition="before" labelColor= '#009900' icon={<PlayArrow/>} backgroundColor="white" label="Start" onClick={this.handleStartClick}/>
								<RaisedButton style={{marginBottom: '3px'}} labelPosition="before" labelColor= '#f9152f' icon={<StopSquare/>} backgroundColor="white" label="Stop" onClick={this.handleStopClick}/>
								<RaisedButton style={{marginBottom: '3px'}} labelPosition="before" labelColor="#000000" icon={<RepeatIcon/>} backgroundColor="white" label="Reset" onClick={this.handleResetClick}/>
							</div>
						</div>
					</div>
				</div>
				{ /* Imaging Live Feed */ }
				<div style={{display: 'inline-block', marginTop: '10px'}} className="col-md-9">
					{this.state.cameraLoading && <CircularProgress />}
					<div id="camera" style={{margin:'auto', border:'2px solid #e5e5e5'}}>
					</div>
					<RaisedButton
						label="Review Images"
						style={{margin: '10px'}}
						onClick={this.toImageNotesView}
						disabled={this.state.images == 0}
						secondary
					/>
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
