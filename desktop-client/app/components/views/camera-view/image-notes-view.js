import React, { Component, PropTypes } from "react";
import Banner from "../../common/banner";
import {Card} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { subviewKeys } from './view-keys';
import {viewMap, viewIDs} from '../../views/views';
import ThumbnailArray from './capture-view/thumbnail-array';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
const { ipcRenderer } = require('electron');

class ImageNotesView extends Component {

  state = {
    patientID: '',
    notes: '',
    selectedImageIndex: 0,
    saveLoc: '',
    examSaveMessage: '',
    examSaved: false,
    images: this.props.previousViewData.images,
    height: window.innerHeight,
    width: window.innerWidth
  };

  onTextChange = (key, event) => {
    this.setState({[key]: event.target.value});
  };

  onSave = isDefault => {
    const data = {
      dataURI: this.props.previousViewData.dataURI,
      images: this.state.images,
      patientID: this.state.patientID,
      notes: this.state.notes,
    };

    const saveMessageType = isDefault ? 'imageSaveDefault' : 'imageSave';
    ipcRenderer.send(saveMessageType, data);
    ipcRenderer.on(`${saveMessageType}Reply`, (event, err) => {
      if (err) {
        alert('DID NOT SAVE. Problem saving image or creating dirs. Error: ' + err)
        this.setState({examSaved: false});
      } else {
        this.setState({examSaved: true});
        this.setState({images: []});
        //this.props.changeView(subviewKeys.ACQUIRE, {});
      }
    });
  };

  onThumbnailSelect = index => {
    this.setState({selectedImageIndex: index});
  }

  onBackSelect = () => {
    this.props.changeView(subviewKeys.ACQUIRE, {capturedImages: this.state.images})
  }

  updateDimensions = () => {
    this.setState({width: window.innerWidth, height: window.innerHeight});
    console.log("width x height is" + this.state.width + this.state.height);
  }

  componentWillMount() {
    this.updateDimensions();
  }

  componentDidMount(){
    window.addEventListener("resize", this.updateDimensions);
    //console.loading('Listening for key press (b)...')
  }

  componentWillUnmount(){
    window.removeEventListener("resize", this.updateDimensions);
    //console.log('Not listening for key press...')
  }

  render() {
    return (
      <div>
        <div className="row center-md">
          <div className="col-md-1">
            <RaisedButton
              style={{marginTop: '10px', position: 'absolute', left: '10px'}}
              label="Back"
              icon={<ArrowBack />}
              onClick={() => this.onBackSelect()}
              />
          </div>
          <div className="col-md-7">
            <img
              src={this.state.images[this.state.selectedImageIndex]}
              style={{width: this.state.height*0.67*4/3, height: this.state.height*0.67, margin: '10px'}}
              />
            <div className="row">
              <div className="col-md-12">
                <div style={{height: '100%', width: '100%', overflowX: 'scroll', whiteSpace: 'nowrap', overflowY: 'hidden'}}>
                  <ThumbnailArray
                    images={this.state.images}
                    //isHorizontalLayout={true}
                    maxThumbnailWidth={"15%"}
                    displaySelectBorders={true}
                    onSelect={this.onThumbnailSelect}/>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <Card style={{padding: '10px', margin: '10px', marginRight: '30px'}}>
              <h3> Exam Notes </h3>
              <p>Follow all requirements related to the storage of Protected Health Information (PHI) as established by the health care organization in which this software is being used.</p>
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
              <RaisedButton
                label="Save"
                primary={true}
                onClick={() => this.onSave(true)}
                disabled={this.state.patientID == 0}/>
                <RaisedButton
                label="Save Custom..."
                secondary={true}
                onClick={() => this.onSave(false)}
                disabled={this.state.patientID == 0}/>
            </Card>
            {this.state.examSaved && <p style={{fontSize: '16px'}}>Exam saved <span style={{color: '#0F9D58'}}>{String.fromCharCode(10004)}</span></p>}
          </div>
        </div>
      </div>
    );
  }
}


export default ImageNotesView;
