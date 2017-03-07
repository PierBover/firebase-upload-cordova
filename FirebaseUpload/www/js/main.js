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
		App.initializeFirebase();
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
};

// ********************************************************************

var UserInterface = {
	initialize: function () {
		this.$log = $('#log');

		this.$inputFile = $('#input-file');
		this.$inputFile.on('change', function() {
			var file = this.files[0];
			var reader  = new FileReader();

		    reader.addEventListener("load", function () {
				UserInterface.log('File for Firebase received!');
				FileController.uploadFirebase(file,reader.result);
		    }, false);

		    if (file) {
		    	reader.readAsArrayBuffer(file);
		    }
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
	uploadFirebase: function (file, arrayBuffer) {

		UserInterface.log('Uploading ' + file.name);

		var uploadTask = firebase.storage().ref().child(file.name).put(arrayBuffer);

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
}

App.initialize();