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
			title: "",
			type: "numbers",
			instructions: ""
		};
		return _this;
	}

	_createClass(Assign_student_teacher_Input, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			if (this.props.activity != -1) {
				var self = this;
				$.get("/api/activity", { activity: this.props.activity }, function (data) {
					var activity = JSON.parse(data);
					self.setState({ title: activity.title, type: activity.activity_type_label, instructions: activity.instructions });
				});
			}
		}
	}, {
		key: "formSubmit",
		value: function formSubmit(event) {
			var columns_and_rows_json = JSON.stringify({
				"columns": this.refs.columns.getColumns(),
				"rows": this.refs.rows.getRows()
			});
			console.log(columns_and_rows_json);
			$.post('../api/activity', { title: this.state.title,
				activity_type: this.state.type,
				instructions: this.state.instructions,
				columns_and_rows: columns_and_rows_json }, function (returnedData) {
				// window.location.href = '/activitylist'
				window.location.replace("/activitylist");
			});
		}
	}, {
		key: "formSave",
		value: function formSave(event) {
			$.put('../api/activity', { activity: this.props.activity,
				title: this.state.title,
				activity_type: this.state.type,
				instructions: this.state.instructions }, function (returnedData) {
				console.log(returnedData);
				window.location.href = '/activitylist';
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
					this.props.activity == -1 ? "Create" : "Edit",
					" an Activity"
				),
				React.createElement(
					"p",
					null,
					"Title: ",
					React.createElement("input", { type: "text", name: "title", value: this.state.title,
						onChange: function onChange(evt) {
							return _this2.setState({ title: evt.target.value });
						} })
				),
				React.createElement(
					"p",
					null,
					"Type of Activity: ",
					React.createElement(
						"select",
						{ name: "activity_type", value: this.state.type,
							onChange: function onChange(evt) {
								return _this2.setState({ type: evt.target.value });
							} },
						React.createElement(
							"option",
							{ value: "numbers" },
							"Numbers"
						),
						React.createElement(
							"option",
							{ value: "reading" },
							"Reading"
						),
						React.createElement(
							"option",
							{ value: "motor" },
							"Motor"
						),
						React.createElement(
							"option",
							{ value: "visual" },
							"Visual"
						)
					)
				),
				React.createElement(
					"p",
					null,
					"Instructions: ",
					React.createElement("textarea", { name: "instructions", rows: "10", cols: "50", value: this.state.instructions,
						onChange: function onChange(evt) {
							return _this2.setState({ instructions: evt.target.value });
						} })
				),
				this.props.activity == -1 && React.createElement(
					"div",
					null,
					React.createElement(
						"p",
						null,
						"Columns and Rows cannot be edited once saved"
					),
					React.createElement(ColumnsFieldSet, { ref: "columns", activity: this.props.activity }),
					React.createElement("br", null),
					React.createElement(RowsFieldSet, { ref: "rows", activity: this.props.activity }),
					React.createElement("br", null)
				),
				React.createElement(
					"p",
					null,
					React.createElement("input", { type: "submit", value: "Save Activity", onClick: function onClick(evt) {
							if (_this2.props.activity == -1) {
								_this2.formSubmit(evt);
							} else {
								_this2.formSave(evt);
							}
						} })
				)
			);
		}
	}]);

	return Assign_student_teacher_Input;
}(React.Component);

ReactDOM.render(React.createElement(Assign_student_teacher_Input, null), document.getElementById('body'));

/***/ })

/******/ });