import React, { Component, PropTypes } from "react";
import Banner from "../../common/banner";
import {Card} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import { subviewKeys } from './view-keys';
import ThumbnailArray from './capture-view/thumbnail-array';
const { ipcRenderer } = require('electron');


class ImageNotesView extends Component {

    state = {
    	patientID: '',
        notes: '',
		selectedImageIndex: 0,
    };

    onTextChange = (key, event) => {
        this.setState({[key]: event.target.value});
    };

    onSave = isDefault => {
		const data = {
			dataURI: this.props.previousViewData.dataURI,
			images: this.props.previousViewData.images,
			patientID: this.state.patientID,
			notes: this.state.notes,
		};
		const saveMessageType = isDefault ? 'imageSaveDefault' : 'imageSave';
		ipcRenderer.send(saveMessageType, data);
		ipcRenderer.on(`${saveMessageType}Reply`, (event, err) => {
			if (err) {
				alert('DID NOT SAVE. Problem saving image or creating dirs. Error: ' + err)
			} else {
				this.props.changeView(subviewKeys.ACQUIRE, {});
			}
		});
	};

	onThumbnailSelect = index => {
		this.setState({selectedImageIndex: index});
	}

    render() {
        return (
            <div>
                <Banner
                    text="Please enter any image notes, observations, or general comments here."
                    style={{marginTop: '20px', marginBottom: '20px', width: '450px'}}
                />
                <div className="row center-md">
                    <div className="col-md-8">
                    <img
                        src={this.props.previousViewData.images[this.state.selectedImageIndex]}
						style={{width: '85%', margin: '15px'}}
                        />
					<ThumbnailArray 
						images={this.props.previousViewData.images} 
						isHorizontalLayout={true} 
						maxThumbnailWidth={"150px"}
						displaySelectBorders={true}
						onSelect={this.onThumbnailSelect}/>
                    </div>
                    <div className="col-md-4">
                        <Card style={{padding: '10px', margin: '10px', marginRight: '30px'}}>
                            <h3> Exam Notes </h3>
                        <TextField
                            hintText="PatientID"
                            floatingLabelText="Patient ID"
                            value={this.state.patientID}
                            onChange={e => this.onTextChange('patientID', e)}/> <br />
                        <TextField
                            hintText="Enter multiline notes here"
                            floatingLabelText="Notes"
							multiLine={true}
                            style={{textAlign: 'left'}}
                            value={this.state.notes}
							onChange={e => this.onTextChange('notes', e)}/> <br />
                            <FlatButton
                                label="Save"
                                primary={true}
                                onClick={() => this.onSave(true)}/>
							<FlatButton
								label="Save Custom..."
								secondary={true}
								onClick={() => this.onSave(false)}/>
                        </Card>

                    </div>
                </div>
            </div>
        );

    }

}

export default ImageNotesView;
