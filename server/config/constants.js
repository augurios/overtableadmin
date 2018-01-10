
/**
	* @initializing conig file and setting application
	* @constants accodingly
	**/

var config = require('../config/config.js');
var environment = config.environment();

exports.define = function () {
	var constants = {
		host: environment.url_domain,
		basePath: "./public/uploads/",
		supporting_uploads_type: "['PDF','GIF','JPEG','JPG','PNG','png']",
		//publickey: "0e95d56c-3a0b-4833-9c7b-3236ebd96b42",
	};
	return constants;
}
exports.keys = function () {
	var constants = {
		cryptokey: "0e95d56c-3a0b-4833-9c7b-3236ebd96b42",
		sessionkey: "0e95d56c-3a0b-2016Tech-9c7b-3236ebd96b42",
		cipher_key: "e7G5Rhak792q",
	};
	return constants;
}

exports.messages = function () {
	var constants = {
		done: "MESSAGES.DONE",
		actionnotcompleted: "MESSAGES.ACTIONNOTCOMPLETED",
		noSufficientData: "MESSAGES.NOSUFFICIENTDATA",
		nouser: "MESSAGES.NOUSER",
		loginsuccessful: "MESSAGES.LOGINSUCCESS",
		invalidcredentials: "MESSAGES.INVALIDCREDENTIALS",
		loggedout: "MESSAGES.LOGGEDOUT",
		usercreationSuccess: "MESSAGES.USERCREATIONSUCCESS",
		usercreationFailed: "MESSAGES.USERCREATIONFAILED",
		userUpdationSuccess: "MESSAGES.USERUPDATIONSUCCESS",
		unauthorized: "MESSAGES.UNAUTHORIZED",
		forbiddenaccess: "MESSAGES.FORBIDDENACCESS",
		usermailexists: "MESSAGES.USERMAILEXISTS",
		useralreadyexists: "MESSAGES.USERALREADYEXISTS",
		userdelete: "MESSAGES.USERDELETE",
		invalidmail: "MESSAGES.INVALIDMAIL",
		invalidPhone: "MESSAGES.INVALIDPHONE",
		tokenupdated: "MESSAGES.TOKENUPDATED",
		notrequestedchange: "MESSAGES.NOTREQUESTEDCHANGE",
		linkexpired: "MESSAGES.LINKEXPIRED",
		passwordchanged: "MESSAGES.PASSWORDCHANGED",
		cannotchangepassword: "MESSAGES.CANNOTCHANGEPASSWORD",
		forgotmailsent: "MESSAGES.FORGOTMAILSENT",
		forgotmailsenterr: "MESSAGES.FORGOTMAILSENTERR",
	};
	return constants;
}

