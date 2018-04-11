/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 50);
/******/ })
/************************************************************************/
/******/ ({

/***/ 50:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserInput = function (_React$Component) {
	_inherits(UserInput, _React$Component);

	function UserInput(props) {
		_classCallCheck(this, UserInput);

		var _this = _possibleConstructorReturn(this, (UserInput.__proto__ || Object.getPrototypeOf(UserInput)).call(this, props));

		_this.state = {
			username: "",
			roles: "",
			first_name: "",
			last_name: "",
			password: "",
			email_address: ""
		};
		return _this;
	}

	_createClass(UserInput, [{
		key: "formSubmit",
		value: function formSubmit(event) {
			$.post('../api/user', { username: this.state.username,
				role_label: this.state.roles,
				first_name: this.state.first_name,
				last_name: this.state.last_name,
				password: this.state.password,
				email_address: this.state.email_address
			}, function (returnedData) {
				console.log(returnedData);
			});
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			return React.createElement(
				"div",
				null,
				React.createElement(
					"h2",
					null,
					"Create an User"
				),
				React.createElement(
					"p",
					null,
					"User Name: ",
					React.createElement("input", { type: "text", name: "username", value: this.state.username,
						onChange: function onChange(evt) {
							return _this2.setState({ username: evt.target.value });
						} })
				),
				React.createElement(
					"p",
					null,
					"Password: ",
					React.createElement("input", { type: "text", name: "password", value: this.state.password,
						onChange: function onChange(evt) {
							return _this2.setState({ password: evt.target.value });
						} })
				),
				React.createElement(
					"p",
					null,
					"Email: ",
					React.createElement("input", { type: "text", name: "email_address", value: this.state.email_address,
						onChange: function onChange(evt) {
							return _this2.setState({ email_address: evt.target.value });
						} })
				),
				React.createElement(
					"p",
					null,
					"Type of Roles: ",
					React.createElement(
						"select",
						{ name: "role_label", value: this.state.roles,
							onChange: function onChange(evt) {
								return _this2.setState({ roles: evt.target.value });
							} },
						React.createElement(
							"option",
							{ value: "administrator" },
							"Administrator"
						),
						React.createElement(
							"option",
							{ value: "evaluator" },
							"Evaluator"
						),
						React.createElement(
							"option",
							{ value: "teacher" },
							"Teacher"
						)
					)
				),
				React.createElement(
					"p",
					null,
					"First Name: ",
					React.createElement("input", { type: "text", name: "first_name", value: this.state.first_name,
						onChange: function onChange(evt) {
							return _this2.setState({ first_name: evt.target.value });
						} })
				),
				React.createElement(
					"p",
					null,
					"Last Name: ",
					React.createElement("input", { type: "text", name: "last_name", value: this.state.last_name,
						onChange: function onChange(evt) {
							return _this2.setState({ last_name: evt.target.value });
						} })
				),
				React.createElement("br", null),
				React.createElement("br", null),
				React.createElement(
					"form",
					{ action: "/userlist" },
					React.createElement(
						"p",
						null,
						React.createElement("input", { type: "submit", value: "Create an User", onClick: function onClick(evt) {
								return _this2.formSubmit(evt);
							} })
					)
				)
			);
		}
	}]);

	return UserInput;
}(React.Component);

ReactDOM.render(React.createElement(UserInput, null), document.getElementById('body'));

/***/ })

/******/ });