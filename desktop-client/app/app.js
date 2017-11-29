// @flow
// The wrapper React container for the application
import React, { Component } from "react";
import ReactDom from "react-dom";
import { Window, Content, PaneGroup, Pane, Button } from "react-photonkit";

import ContentSwitcher from './components/content-switcher';

import {viewMap, viewIDs} from './components/views/views';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import HomeIcon from 'material-ui/svg-icons/action/home';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import '../index.scss';
import './css/flexboxgrid.min.css';

class App extends Component {
	state = {
		currentViewID: viewIDs.homeView, 
	}

	changeView = (viewID: string) => {
		this.setState({currentViewID: viewID});
	}

	render() { 
		return (
		<MuiThemeProvider>
		<Window>
			<AppBar
		     	title="Pocket Desktop"
				iconElementLeft={<IconButton><HomeIcon/></IconButton>}
				onLeftIconButtonTouchTap={() => this.setState({currentViewID: viewIDs.homeView})}
				className="header"
				style={{paddingTop: '5px'}}
				/>
			<Content>
			  <PaneGroup>
				<Pane>
					{
						React.createElement(
							viewMap[this.state.currentViewID],
							{changeView: this.changeView}
						)
					}
				</Pane>

			  </PaneGroup>
			</Content> 
		  </Window>
		  </MuiThemeProvider>
		);
	}
}

ReactDom.render(
	<App />,
	document.querySelector("#main")
);
