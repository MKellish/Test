import LoginView from './login-view';
import CameraView from './camera-view';
import HomeView from './home-view';
import MetadataView from './metadata-view';

/* 
 * viewIDs
 * Holds the viewIDs that map to a given 
 * view component
 */
const viewIDs = {
	homeView: "homeView",
	loginView: "loginView",
	cameraView: "cameraView",
    metadataView: "metadataView",
}

/*
 * viewMap
 * Maps viewIDs to a view component
 */
const viewMap = {
	[viewIDs.homeView]: HomeView,
	[viewIDs.loginView]: LoginView,
	[viewIDs.cameraView]: CameraView,
    [viewIDs.metadataView]: MetadataView,
}

export {
	viewMap,
	viewIDs,
}
