// @flow
import React, { Component, PropTypes } from "react";

/*
 * ContentSwitcher is a component that displays a single component
 * from an input map at a time, and allows for switching between
 * components in the supplied map. It then renders a component
 * based on `viewKey` and injects 
 * `changeView(viewKey: string, nextViewData: object)` 
 * as a prop. The child component can call that function to switch 
 * to another view component contained in the supplied `viewMap` based
 * on a `viewKey`.
 */
class ContentSwitcher extends Component { 
	state = {
		currentViewKey: this.props.defaultViewKey,
		previousViewData: this.props.previousViewData || {},
	}

	/*
	 * changeView is called by a rendered child to switch to 
	 * another view in `viewMap` based on the supplied `viewKey`.
	 *
	 * This function also takes a nextViewData object that is passed
	 * as a prop to the NEXT view to be shown (which is selected by
	 * `viewKey`. 
	 */
	changeView = (viewKey: string, nextViewData: {}) => {
		if (viewKey in this.props.viewMap) {
			this.setState({currentViewKey: viewKey, previousViewData: nextViewData}, () => {
				this.props.onChangeView && this.props.onChangeView(viewKey, nextViewData);
			});
		} else {
			console.error("ERROR, invalid viewKey supplied to ContentSwitcher.");
			console.log("viewMap", this.props.viewMap);
			console.log("viewKey", viewKey)
		}
	}

	render() {
		return (
			<div>
				{
					React.createElement(
						this.props.viewMap[this.state.currentViewKey], 
						{ 
							changeView: this.changeView, 
							specialProps: this.props.specialProps, 
							previousViewData: this.state.previousViewData,
							viewMap: this.props.viewMap
						}
					)
				}
			</div>
		);
	}
}

ContentSwitcher.propTypes = {
	viewMap: PropTypes.object.isRequired,
	defaultViewKey: PropTypes.string.isRequired,
	specialProps: PropTypes.object, 
}

export default ContentSwitcher;
