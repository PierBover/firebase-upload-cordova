var App = {
	initialize: function () {
		if (typeof cordova !== 'undefined') {
			document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
		} else {
			this.onDeviceReady();
		}
	},

	onDeviceReady: function () {
		UserInterface.initialize();
		// App.initializeFirebase();
		App.initializeFilepicker();
		UserInterface.log('App ready!');
	},

	initializeFirebase: function () {
		UserInterface.log('Initliazing Firebase!');
		var config = {
			apiKey: "AIzaSyCE7abAnl2V3KF3o-yiCAmmveh6YqFbqQk",
			authDomain: "test-upload-cordova.firebaseapp.com",
			databaseURL: "https://test-upload-cordova.firebaseio.com",
			storageBucket: "test-upload-cordova.appspot.com",
			messagingSenderId: "145818825267"
		};
		firebase.initializeApp(config);
	},

	initializeFilepicker: function () {
		UserInterface.log('Initliazing Filepicker!');
		this.filepickerClient = filestack.init('AQ6gQpRu3TkC41Imi2sRcz', { policy: 'policy', signature: 'signature' });
	},
};

// ********************************************************************

var UserInterface = {
	initialize: function () {
		this.$log = $('#log');

		// this.$inputFile = $('#input-file');
		// this.$inputFile.on('change', function() {
		// 	UserInterface.log('File for Firebase received!');
		// 	FileController.uploadFirebase(this.files);
		// });

		this.$inputFilepicker = $('#input-filepicker');
		this.$inputFilepicker.on('change', function() {
			UserInterface.log('File for Filepicker received!');
			FileController.uploadFilestack(this.files);
		});
	},

	log: function (message) {
		var date = new Date();
		var hours = date.getHours();
		var minutes = "0" + date.getMinutes();
		var seconds = "0" + date.getSeconds();
		var humanTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
		this.$log.append(document.createTextNode(message + ' ' + humanTime + '\n'));
	},
}

// ********************************************************************

var FileController = {
	uploadFirebase: function (files) {
		var file = files[0];
		UserInterface.log('Uploading ' + file.name);
		var uploadTask = firebase.storage().ref().child(file.name).put(file);

		uploadTask.on('state_changed', snapshot => {
			UserInterface.log('Uploading: ' + ((snapshot.bytesTransferred / snapshot.totalBytes) * 100) + '%' );
		}, error => {
			console.log(error);
			UserInterface.log('UPLOADING ERROR!');
			UserInterface.log(error.toString())
		}, () => {
			UserInterface.log('Upload complete!');
		})
	},

	uploadFilestack: function (files) {
		var file = files[0];
		console.log(file);
		UserInterface.log('Uploading ' + file.name);

		var options = {
			onProgress: function (event) {
				UserInterface.log('Uploading to Filestack...');
			}
		};

		App.filepickerClient.upload(files[0], options).then(() => {
			UserInterface.log('File uploaded to Filestack!');
		}).catch((error) => {
			console.log(error);
			UserInterface.log(error.toString());
		});
	},
}

App.initialize();