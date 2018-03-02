import React, { Component } from "react";
import ReactDOM from "react-dom";

class Layout extends React.Component {
	render(){

        
		return (
		  <div className="container-fluid">
			<div className="row">
			  <div className="col-11 header">
				<form action="logout">
				  Hello {"username"} &bull; <input type="submit" value="Logout"/>
				</form>
			  </div>
			</div>
			<div className="row" id="nav">
			  <div className="col-1 col-sm-2">
			  </div>
			  {true &&
				<div className="col-md-2 col-3">
				  <a href="admin" className="dropdown-toggle tab" data-toggle="dropdown" data-hover="dropdown"> Admin </a>
				    <ul className="dropdown-menu">
				      <li><a href="/admin">Home</a></li>
				      <li><a href="/activitylist">All Activities</a></li>
				    </ul>
				</div>
			  }
			  {true &&
				<div className="col-md-2 col-3">
				  <a href="/eval_landing" className="dropdown-toggle tab" data-toggle="dropdown" data-hover="dropdown"> Evaluator </a>
				    <ul className="dropdown-menu">
				      <li><a href="/eval_landing">Home</a></li>
				      <li><a href="#">Another action</a></li>
				    </ul>
				</div>
			  }

			  <div className="col-md-2 col-3">
				<a href="/teacher_landing" className="dropdown-toggle tab" data-toggle="dropdown" data-hover="dropdown"> Teacher </a>
				  <ul className="dropdown-menu">
				      <li><a href="/teacher_landing">Home</a></li>
				      <li><a href="#">Another action</a></li>
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
	}
}


ReactDOM.render(
  <Layout />,
  document.getElementById('app')
);
