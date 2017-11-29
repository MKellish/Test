/**
 * ipc
 * This module contains necessary logic to handle all needed
 * interprocess communication between the renderer and the main
 * process.
 *
 * @author Suyash Kumar <suyashkumar2003@gmail.com>
 */

const { ipcMain } = require('electron');
const fse = require('fs-extra');
const path = require('path');
const os = require('os');
var crypto = require('crypto');

const DEFAULT_SAVE_PATH = path.join(
	os.homedir(),
	'Desktop',
	'POCkeT Desktop Exams'
);

function saveImage(filepath, imageURI) {
	var base64Data = imageURI.replace(/^data:image\/jpeg;base64,/, "");
	fse.writeFile(filepath, new Buffer(base64Data, 'base64'));
}

function savePatientData(filepath, data) {
	const examHash = crypto.createHash('md5').update(`${Date.now()}`).digest("hex");

	// Save each image:
	for (i = 0; i < data.images.length; i++) {
		saveImage(path.join(filepath, `image_${i}_${examHash}.jpg`), data.images[i]);
	}

	// Handle Notes:
	fse.writeFile(path.join(filepath, `notes_${examHash}.txt`), data.notes);
}

/* Register IPC Receivers: */

// imageSave receives events when the user is trying to save
// an image and notes to the filesystem with a specified path.
ipcMain.on('imageSave', (event, data) => {
	const {dialog} = require('electron');
	dialog.showOpenDialog(
		{
			title: "Save Patient Exam",
			message: "Select directory to save this patient's notes & image in",
			buttonLabel: "Choose Directory",
			properties:["openDirectory"]

		}, filepath=> {
			try {
				savePatientData(filepath[0], data);
				event.sender.send('imageSaveReply', undefined)
			} catch (err) {
				console.log(err);
				event.sender.send('imageSaveReply', err.message);
			}
		});
});

// imageSaveDefault receives events when the user is trying to save
// an image and notes to the filesystem to the DEFAULT path.
ipcMain.on('imageSaveDefault', (event, data) => {
	const patientSaveFolder = path.join(DEFAULT_SAVE_PATH, data.patientID);
	fse.ensureDir(patientSaveFolder, err => {
		if (err) event.sender.send('imageSaveDefaultReply', err);
		savePatientData(patientSaveFolder, data);
		event.sender.send('imageSaveDefaultReply', undefined);
	});
});
