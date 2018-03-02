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


var activity_input = React.createElement(
  "div",
  null,
  React.createElement(
    "h2",
    null,
    "Create an Activity"
  ),
  React.createElement(
    "form",
    { action: "#", id: "activity_form" },
    React.createElement(
      "p",
      null,
      "Title: ",
      React.createElement("input", { type: "text", name: "title", id: "activity_title" })
    ),
    React.createElement(
      "p",
      null,
      "Type of Activity: ",
      React.createElement(
        "select",
        { name: "activity_type", id: "activity_type" },
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
      React.createElement("textarea", { name: "instructions", id: "activity_instructions", rows: "10", cols: "30" })
    ),
    React.createElement(
      "p",
      null,
      React.createElement("input", { type: "submit", value: "Create Activity" })
    )
  )
);

ReactDOM.render(activity_input, document.getElementById('body'));

var rows_columns = { "columns": [{
    "title": "first column title (test activity)",
    "number": 1,
    "data_type": "numeric"
  }, {
    "title": "second column title (test activity)",
    "number": 1,
    "data_type": "numeric"
  }, {
    "title": "third column title (test activity)",
    "number": 1,
    "data_type": "numeric"
  }],
  "rows": [{
    "title": "first row title (test activity)",
    "number": 1
  }, {
    "title": "second row title (test activity)",
    "number": 1
  }]
};

$("#activity_form").submit(function (event) {
  event.preventDefault();
  var columnsrows = JSON.stringify({ "columns": [{
      "title": "first column title (test activity)",
      "number": 1,
      "data_type": "numeric"
    }, {
      "title": "second column title (test activity)",
      "number": 1,
      "data_type": "numeric"
    }, {
      "title": "third column title (test activity)",
      "number": 1,
      "data_type": "numeric"
    }],
    "rows": [{
      "title": "first row title (test activity)",
      "number": 1
    }, {
      "title": "second row title (test activity)",
      "number": 1
    }]
  });
  console.log(columnsrows);
  $.post('../api/activity', { title: $("#activity_title").val(),
    activity_type: $('#activity_type').val(),
    instructions: $('#activity_instructions').val(),
    columns_and_rows: columnsrows }, function (returnedData) {
    console.log(returnedData);
  });
});

/***/ })

/******/ });