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
/******/ 	return __webpack_require__(__webpack_require__.s = 55);
/******/ })
/************************************************************************/
/******/ ({

/***/ 55:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Assign_student_teacher_Input = function (_React$Component) {
	_inherits(Assign_student_teacher_Input, _React$Component);

	function Assign_student_teacher_Input(props) {
		_classCallCheck(this, Assign_student_teacher_Input);

		var _this = _possibleConstructorReturn(this, (Assign_student_teacher_Input.__proto__ || Object.getPrototypeOf(Assign_student_teacher_Input)).call(this, props));

		_this.state = {
			student: {},
			user_id: "",
			users: []
		};
		return _this;
	}

	_createClass(Assign_student_teacher_Input, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			var self = this;
			$.get("/api/user", function (data) {
				var user = JSON.parse(data);
				self.setState({ users: user });
			});
			$.get("/api/student?student=" + String(this.props.student), function (data) {
				var student = JSON.parse(data);
				console.log(data);
				self.setState({ student: student });
			});
		}
	}, {
		key: "formSubmit",
		value: function formSubmit(event) {
			var self = this;
			$.post('/api/student_teacher', {
				student: this.props.student,
				teacher: this.state.teacher_id
			}, function (returnedData) {
				console.log(returnedData);
				window.location.replace("/student_profile/" + String(self.props.student));
			});
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var options = this.state.users.map(function (user) {
				return React.createElement(
					"option",
					{ value: user.id },
					user.title
				);
			});
			return React.createElement(
				"div",
				null,
				React.createElement(
					"h2",
					null,
					"Assign Teacher to Student"
				),
				React.createElement(
					"p",
					null,
					"First Name: ",
					this.state.student.firstname,
					" "
				),
				React.createElement(
					"p",
					null,
					"Last Name: ",
					this.state.student.lastname,
					" "
				),
				React.createElement("br", null),
				React.createElement(
					"p",
					null,
					"Teachers: ",
					React.createElement(
						"select",
						{ value: this.state.user_id,
							onChange: function onChange(evt) {
								return _this2.setState({ user_id: evt.target.value });
							} },
						React.createElement("option", { value: -1 }),
						options,
						" "
					),
					" "
				),
				React.createElement(
					"p",
					null,
					React.createElement("input", { type: "submit", value: "Assign", onClick: function onClick(evt) {
							return _this2.formSubmit(evt);
						} })
				)
			);
		}
	}]);

	return Assign_student_teacher_Input;
}(React.Component);

ReactDOM.render(React.createElement(Assign_student_teacher_Input, { student: student_id }), document.getElementById('body'));

/***/ })

/******/ });