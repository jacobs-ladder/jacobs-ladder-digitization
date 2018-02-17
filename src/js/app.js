import React, { Component } from "react";
import ReactDOM from "react-dom";

var isAdmin = true; //TODO connect to backend (needs to see if the user is an Admin)
var isEval = true; //TODO connect to backend (needs to see if the user is an Evaluator)


const layout = (
  <div className="container-fluid">
    <div className="row" id="nav">
      <div className="col-1 col-sm-2">
      </div>
      {isAdmin &&
        <div className="col-md-2 col-3 navA">
          <a href="admin" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown"> Admin </a>
            <ul className="dropdown-menu">
              <li><a href="/admin">Home</a></li>
              <li><a href="#">Another action</a></li>
            </ul>
        </div>
      }
      {isEval &&
        <div className="col-md-2 col-3 navA">
          <a href="/eval_landing"> Evaluator </a>
        </div>
      }

      <div className="col-md-2 col-3 navA">
        <a href="/teacher"> Teacher </a>
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
