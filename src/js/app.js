import React, { Component } from "react";
import ReactDOM from "react-dom";

class Layout extends React.Component{
	constructor(props){
		super(props);
        this.state = {
            username : "",
			isadmin  : false,
			iseval   : false,
			students : []
        };
    }

    componentDidMount(){
        var self = this;
		$.ajax({
			type: 'GET',
		    url: '/api/current_user',

		    dataType: "json",

		    success: function(data){
                if(data){
					var admin = (data.role_label == 'administrator');
					var evalu = admin || (data.role_label == 'evaluator')
                    self.setState({ username : data.username, isadmin: admin, iseval : evalu});
          $.get( "/api/student_teacher", {teacher : data.id}
					, function( data ) {
					self.setState({ students : JSON.parse(data) });
					console.log(data);  //TODO TEMP
					});
                }
		    },
		    error: function (request, status, error) {
		        alert(error);
		    }
		});

    }

	render(){
		return (
		  <div className="container-fluid">
			<div className="row">
			  <div className="col-11 header">
				<form action="/logout">
				  Hello {this.state.username} &bull; <input type="submit" value="Logout"/>
				</form>
			  </div>
			</div>
			<div className="row" id="nav">
			  <div className="col-1 col-sm-2">
			  </div>
			  {this.state.isadmin &&
				<div className="col-md-2 col-3">
				  <a href="admin" className="dropdown-toggle tab" data-toggle="dropdown" data-hover="dropdown"> Admin </a>
				    <ul className="dropdown-menu">
				      <li><a href="/admin">Admin home</a></li>
				      <li><a href="/activitylist">All activities</a></li>
				      <li><a href="/usercreation">Add a user</a></li>
				      <li><a href="/studentcreation">Add a student</a></li>
				    </ul>
				</div>
			  }
			  {this.state.iseval &&
				<div className="col-md-2 col-3">
				  <a href="/eval_landing" className="dropdown-toggle tab" data-toggle="dropdown" data-hover="dropdown"> Evaluator </a>
				    <ul className="dropdown-menu">
				      <li><a href="/eval_landing">Evaluator home</a></li>
				    </ul>
				</div>
			  }

			  <div className="col-md-2 col-3">
				<a href="/teacher_landing" className="dropdown-toggle tab" data-toggle="dropdown" data-hover="dropdown"> Teacher </a>
				  <ul className="dropdown-menu">
				      <li><a href="/teacher_landing">Teacher home</a></li>
				    </ul>
			  </div>
			</div>
			<div className="row">
			  <div className="col-md-2 col-3" id="sidebar">
			  {
			  	this.state.students.length != 0 &&
			  	<div className="row">Your Students</div>
			  }


			  <div className="row">Links</div>
				<div className="row"><a href="/studentlist">Student List</a></div>
				<div className="row"><a href="/userlist">Faculty List</a></div>
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
