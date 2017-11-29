import React, { Component, PropTypes } from "react";

class ThumbnailArray extends Component {

	state = {
		currentSelection: 0,
	}

	onSelect = index => {
		this.setState({currentSelection: index}, () => {
			this.props.onSelect(index); 
		});
	}

	render() {
		return (
			<div>
			{
				this.props.images.map( (image, index) => {
						return (
						<img
							key={image /*TODO: make a better key*/} 
							src={image}
							onClick={() => {this.onSelect(index)}}
							style={
								{
									maxWidth: this.props.maxThumbnailWidth,
									inlineBlock: this.props.isHorizontalLayout ? 'true':'false',
									margin: '10px',
									border: (this.props.displaySelectBorders && this.state.currentSelection == index) ? '2px solid black':'',
									height: this.props.maxHeight,
								}
							}/>
						);
				})
			}
			</div>
		);
	}

}

ThumbnailArray.propTypes = {
	images: PropTypes.array.isRequired, // array of image data uris
	isHorizontalLayout: PropTypes.bool, 
	maxThumbnailWidth: PropTypes.string,
	onSelect: PropTypes.func,
	displaySelectBorders: PropTypes.bool,
	maxHeight: PropTypes.string,
}

ThumbnailArray.defaultProps = {
	maxThumbnailWidth: '300px',
	isHorizontalLayout: false,
}

export default ThumbnailArray;