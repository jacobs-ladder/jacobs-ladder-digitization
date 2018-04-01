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
/******/ 	return __webpack_require__(__webpack_require__.s = 51);
/******/ })
/************************************************************************/
/******/ ({

/***/ 51:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ActivityView = function (_React$Component) {
	_inherits(ActivityView, _React$Component);

	function ActivityView(props) {
		_classCallCheck(this, ActivityView);

		var _this = _possibleConstructorReturn(this, (ActivityView.__proto__ || Object.getPrototypeOf(ActivityView)).call(this, props));

		_this.state = {
			rows: [],
			cols: [],
			grid: [],
			activity: {},
			student: {}
		};
		return _this;
	}

	_createClass(ActivityView, [{
		key: "componentDidMount",
		value: function componentDidMount() {
			var self = this;
			$.get("/api/student_activity", { student: this.props.student,
				activity: this.props.activity,
				student_activity_created: this.props.student_activity_created }, function (dat) {
				var data = JSON.parse(dat);
				console.log(data);
				self.setState({ grid: data.data_grid, rows: data.row_titles, cols: data.column_titles });
			});
			$.get("/api/activity", { activity: this.props.activity }, function (data) {
				self.setState({ activity: JSON.parse(data) });
			});
			$.get("/api/student", { student: this.props.student }, function (data) {
				self.setState({ student: JSON.parse(data) });
			});
		}
	}, {
		key: "formSubmit",
		value: function formSubmit(event) {
			var self = this;
			var data = this.state.rows.map(function (row, rindex) {
				var rowidx = rindex;
				return self.state.grid[rindex].map(function (cell, cindex) {
					return { data: cell.data, row_number: rowidx, column_number: cindex };
				});
			});
			var flat_data = [].concat.apply([], data);
			$.post('/api/student_activity', { student: this.props.student,
				activity: this.props.activity,
				student_activity_created: this.props.student_activity_created,
				data: JSON.stringify(flat_data) }, function (returnedData) {
				console.log(returnedData);
			});
		}
	}, {
		key: "gridChange",
		value: function gridChange(row, col, value) {
			var grd = this.state.grid;
			grd[row][col].data = value;
			this.setState({ grid: grd });
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var self = this;
			var rows = this.state.rows.map(function (row, rindex) {
				var rowidx = rindex;
				var cells = self.state.grid[rindex].map(function (cell, cindex) {
					if (cell.data_type = 'string') {
						return React.createElement(
							"td",
							null,
							React.createElement("input", { type: "text", value: cell.data,
								onChange: function onChange(evt) {
									return _this2.gridChange(rowidx, cindex, evt.target.value);
								} })
						);
					}
					if (cell.data_type = 'numeric') {
						return React.createElement(
							"td",
							null,
							React.createElement(
								"input",
								{ type: "number", step: ".0001", value: cell.data,
									onChange: function onChange(evt) {
										return _this2.gridChange(rowidx, cindex, evt.target.value);
									} },
								">"
							)
						);
					}
				});

				return React.createElement(
					"tr",
					null,
					React.createElement(
						"td",
						null,
						row
					),
					cells
				);
			});

			var head = this.state.cols.map(function (col, index) {

				return React.createElement(
					"th",
					null,
					col
				);
			});

			return React.createElement(
				"div",
				null,
				React.createElement(
					"p",
					null,
					"Title: ",
					this.state.activity.title
				),
				React.createElement(
					"p",
					null,
					"Type of Activity: ",
					this.state.activity.activity_type_label
				),
				React.createElement(
					"p",
					null,
					"Instructions: ",
					this.state.activity.instructions
				),
				React.createElement("br", null),
				React.createElement(
					"p",
					null,
					"Student First Name: ",
					this.state.student.firstname
				),
				React.createElement(
					"p",
					null,
					"Student Last Name: ",
					this.state.student.lastname
				),
				React.createElement("br", null),
				React.createElement(
					"p",
					null,
					"Data Input"
				),
				React.createElement(
					"table",
					null,
					React.createElement(
						"thead",
						null,
						React.createElement(
							"tr",
							null,
							React.createElement("th", null),
							" ",
							head
						)
					),
					React.createElement(
						"tbody",
						null,
						rows
					)
				),
				React.createElement("br", null),
				React.createElement(
					"p",
					null,
					React.createElement("input", { type: "submit", value: "Save Changes", onClick: function onClick(evt) {
							return _this2.formSubmit(evt);
						} })
				)
			);
		}
	}]);

	return ActivityView;
}(React.Component);

var student_activity = React.createElement(ActivityView, { activity: activity_id, student: student_id, student_activity_created: activity_created });

ReactDOM.render(student_activity, document.getElementById('body'));

/***/ })

/******/ });