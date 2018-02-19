import React, { Component } from "react";
import ReactDOM from "react-dom";

var isAdmin = true; //TODO connect to backend (needs to see if the user is an Admin)
var isEval = true; //TODO connect to backend (needs to see if the user is an Evaluator)

var userName = "Valerie Frizzle"; //TODO get user's name


const layout = (
  <div className="container-fluid">
    <div className="row">
      <div className="col-11 header">
        <form action="logout">
          Hello {userName} &bull; <input type="submit" value="Logout"/>
        </form>
      </div>
    </div>
    <div className="row" id="nav">
      <div className="col-1 col-sm-2">
      </div>
      {isAdmin &&
        <div className="col-md-2 col-3">
          <a href="admin" className="dropdown-toggle tab" data-toggle="dropdown" data-hover="dropdown"> Admin </a>
            <ul className="dropdown-menu">
              <li><a href="/admin">Admin Home</a></li>
              <li><a href="/activitylist">All Activities</a></li>
            </ul>
        </div>
      }
      {isEval &&
        <div className="col-md-2 col-3">
          <a href="/eval_landing" className="dropdown-toggle tab" data-toggle="dropdown" data-hover="dropdown"> Evaluator </a>
            <ul className="dropdown-menu">
              <li><a href="/eval_landing">Evaluator Home</a></li>
            </ul>
        </div>
      }

      <div className="col-md-2 col-3">
        <a href="/teacher_landing" className="dropdown-toggle tab" data-toggle="dropdown" data-hover="dropdown"> Teacher </a>
          <ul className="dropdown-menu">
              <li><a href="/teacher_landing">Teacher Home</a></li>
            </ul>
      </div>
    </div>
    <div className="row">
      <div className="col-md-2 col-3" id="sidebar">
        <div className="row"><a href="/studentlist">Students</a></div>
        <div className="row"><a href="/userlist">Users</a></div>
        <div className="row"><a href="/activitylist">Activities</a></div>
      </div>
      <div className="col-md-9 col-9" id="body">
      </div>
    </div>
  </div>
);


ReactDOM.render(
  layout,
  document.getElementById('app')
);
