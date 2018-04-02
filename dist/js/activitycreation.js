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
/******/ 	return __webpack_require__(__webpack_require__.s = 48);
/******/ })
/************************************************************************/
/******/ ({

/***/ 48:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ColumnsFieldSet = function (_React$Component) {
	_inherits(ColumnsFieldSet, _React$Component);

	function ColumnsFieldSet(props) {
		_classCallCheck(this, ColumnsFieldSet);

		var _this = _possibleConstructorReturn(this, (ColumnsFieldSet.__proto__ || Object.getPrototypeOf(ColumnsFieldSet)).call(this, props));

		_this.state = {
			columns: [{ title: "", type: "numeric" }]
		};

		_this.add = _this.add.bind(_this);
		return _this;
	}

	_createClass(ColumnsFieldSet, [{
		key: "add",
		value: function add() {
			this.setState({ columns: this.state.columns.concat({ title: "", type: "numeric" }) });
		}
	}, {
		key: "remove",
		value: function remove(index) {
			this.setState({ columns: this.state.columns.filter(function (s, sidx) {
					return index !== sidx;
				}) });
		}
	}, {
		key: "titleChange",
		value: function titleChange(index, value) {
			var columns = this.state.columns;
			columns[index].title = value;
			this.setState({ columns: columns });
		}
	}, {
		key: "typeChange",
		value: function typeChange(index, value) {
			var columns = this.state.columns;
			columns[index].type = value;
			this.setState({ columns: columns });
		}
	}, {
		key: "getColumns",
		value: function getColumns() {
			return this.state.columns.map(function (column, index) {
				return {
					"title": column.title,
					"number": index,
					"data_type": column.type
				};
			});
		}
	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			if (this.props.activity != -1) {
				var self = this;
				$.get("/api/activity", { activity: this.props.activity }, function (data) {
					var activity = JSON.parse(data);
					self.setState({ columns: activity.columns.map(function (col) {
							return { title: col[0], type: col[1] };
						}) });
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _this2 = this;

			var columns = this.state.columns.map(function (column, index) {
				return React.createElement(
					"div",
					{ key: index },
					React.createElement("br", null),
					"Title: ",
					React.createElement("input", { type: "text", value: column.title,
						onChange: function onChange(evt) {
							return _this2.titleChange(index, evt.target.value);
						} }),
					React.createElement(
						"span",
						null,
						"  "
					),
					"Type: ",
					React.createElement(
						"select",
						{ name: "input_type", value: column.type,
							onChange: function onChange(evt) {
								return _this2.typeChange(index, evt.target.value);
							} },
						React.createElement(
							"option",
							{ value: "numeric" },
							"Numeric"
						),
						React.createElement(
							"option",
							{ value: "boolean" },
							"Checkbox"
						),
						React.createElement(
							"option",
							{ value: "string" },
							"Text"
						),
						React.createElement(
							"option",
							{ value: "timestamp" },
							"Time"
						)
					),
					React.createElement(
						"span",
						null,
						"  "
					),
					React.createElement(
						"button",
						{ onClick: function onClick() {
								return _this2.remove(index);
							} },
						"Remove"
					)
				);
			});

			return React.createElement(
				"div",
				null,
				React.createElement(
					"p",
					null,
					"Columns"
				),
				React.createElement(
					"button",
					{ onClick: this.add },
					"Add Column"
				),
				" ",
				React.createElement("br", null),
				React.createElement(
					"div",
					null,
					columns
				)
			);
		}
	}]);

	return ColumnsFieldSet;
}(React.Component);

var RowsFieldSet = function (_React$Component2) {
	_inherits(RowsFieldSet, _React$Component2);

	function RowsFieldSet(props) {
		_classCallCheck(this, RowsFieldSet);

		var _this3 = _possibleConstructorReturn(this, (RowsFieldSet.__proto__ || Object.getPrototypeOf(RowsFieldSet)).call(this, props));

		_this3.state = {
			rows: [""]
		};

		_this3.add = _this3.add.bind(_this3);
		return _this3;
	}

	_createClass(RowsFieldSet, [{
		key: "add",
		value: function add() {
			this.setState({ rows: this.state.rows.concat("") });
		}
	}, {
		key: "remove",
		value: function remove(index) {
			this.setState({ rows: this.state.rows.filter(function (s, sidx) {
					return index !== sidx;
				}) });
		}
	}, {
		key: "titleChange",
		value: function titleChange(index, value) {
			var rows = this.state.rows;
			rows[index] = value;
			this.setState({ rows: rows });
		}
	}, {
		key: "getRows",
		value: function getRows() {
			return this.state.rows.map(function (row, index) {
				return {
					"title": row,
					"number": index
				};
			});
		}
	}, {
		key: "componentDidMount",
		value: function componentDidMount() {
			if (this.props.activity != -1) {
				var self = this;
				$.get("/api/activity", { activity: this.props.activity }, function (data) {
					var activity = JSON.parse(data);
					self.setState({ rows: activity.rows });
				});
			}
		}
	}, {
		key: "render",
		value: function render() {
			var _this4 = this;

			var rows = this.state.rows.map(function (row, index) {
				return React.createElement(
					"div",
					{ key: index },
					React.createElement("br", null),
					"Title: ",
					React.createElement("input", { type: "text", value: row,
						onChange: function onChange(evt) {
							return _this4.titleChange(index, evt.target.value);
						} }),
					React.createElement(
						"span",
						null,
						"  "
					),
					React.createElement(
						"button",
						{ onClick: function onClick() {
								return _this4.remove(index);
							} },
						"Remove"
					)
				);
			});

			return React.createElement(
				"div",
				null,
				React.createElement(
					"p",
					null,
					"Rows"
				),
				React.createElement(
					"button",
					{ onClick: this.add },
					"Add Row"
				),
				" ",
				React.createElement("br", null),
				React.createElement(
					"div",
					null,
					rows
				)
			);
		}
	}]);

	return RowsFieldSet;
}(React.Component);

var ActivityInput = function (_React$Component3) {
	_inherits(ActivityInput, _React$Component3);

	function ActivityInput(props) {
		_classCallCheck(this, ActivityInput);

		var _this5 = _possibleConstructorReturn(this, (ActivityInput.__proto__ || Object.getPrototypeOf(ActivityInput)).call(this, props));

		_this5.state = {
			title: "",
			type: "numbers",
			instructions: ""
		};
		return _this5;
	}

	_createClass(ActivityInput, [{
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
				console.log(returnedData);
			});
		}
	}, {
		key: "formSave",
		value: function formSave(event) {
			console.log("Not supported yet");
		}
	}, {
		key: "render",
		value: function render() {
			var _this6 = this;

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
							return _this6.setState({ title: evt.target.value });
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
								return _this6.setState({ type: evt.target.value });
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
							return _this6.setState({ instructions: evt.target.value });
						} })
				),
				React.createElement(ColumnsFieldSet, { ref: "columns", activity: this.props.activity }),
				React.createElement("br", null),
				React.createElement(RowsFieldSet, { ref: "rows", activity: this.props.activity }),
				React.createElement("br", null),
				React.createElement(
					"form",
					{ action: "/activitylist" },
					React.createElement(
						"p",
						null,
						React.createElement("input", { type: "submit", value: "Save Activity", onClick: function onClick(evt) {
								if (_this6.props.activity == -1) {
									_this6.formSubmit(evt);
								} else {
									_this6.formSave(evt);
								}
							} })
					)
				)
			);
		}
	}]);

	return ActivityInput;
}(React.Component);

ReactDOM.render(React.createElement(ActivityInput, { activity: activity_id }), document.getElementById('body'));

/***/ })

/******/ });