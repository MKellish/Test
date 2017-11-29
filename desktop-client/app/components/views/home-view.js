import React, { Component } from "react";
import RaisedButton from 'material-ui/RaisedButton';
import Banner from '../common/banner';
import {viewIDs} from './views';
import AddIcon from 'material-ui/svg-icons/content/add-circle';
import ReviewPatientIcon from 'material-ui/svg-icons/action/assignment-ind';
import StartPatientIcon from 'material-ui/svg-icons/action/check-circle';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';


class HomeView extends Component {

	render() {
		return (
			<div>
				<div style={{textAlign: 'center'}}>
					<Paper style={{width: '70%', margin: 'auto', padding: '10px', marginTop: '10px'}}>
					<h1>Pocket Screening Home</h1>
					<Banner
						text="Welcome to Pocket Desktop! Select an option below to get started"
						style={{width: '60%', margin: 'auto', marginBottom: '10px'}}/>

						<List style={{margin: 'auto', width: '200px', }}>
							<ListItem
								primaryText="Start Exam"
								leftIcon={<StartPatientIcon/>}
								onClick={this.props.changeView.bind(this, viewIDs.cameraView)}/>
							<ListItem primaryText="Add Patient" leftIcon={<AddIcon/>} />
							<ListItem primaryText="Review Patient" leftIcon={<ReviewPatientIcon/>}/>
						</List>
					</Paper>
				</div>
			</div>
		)
	}
}

export default HomeView;

/*

 <RaisedButton
 onClick={this.props.changeView.bind(this, viewIDs.cameraView)}
 primary={true}
 label="Start Exam"
 />
 */
