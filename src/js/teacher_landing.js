import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactTable from 'react-table'


$(document).ready(function () {
	$.ajax({
    	type: 'GET',
        url: '../api/current_user',

        dataType: "json",

        success: function(data){
			get_assigned_students(data);
        },
        error: function (request, status, error) {
            alert(error);
        }
    });
});

const body = (
	  <div>
			<h2>Welcome Teacher</h2>
			<div id = "student_list_table"></div>
			<p><a href="/studentlist" className="fake-button">Full Student List</a></p>
	  </div>
  	);

ReactDOM.render(
  	body,
 	document.getElementById('body')
);

function get_assigned_students(data){
		$.ajax({
	    	type: 'GET',
	        url: '../api/student_teacher?teacher=' + String(data.id),

	        dataType: "json",

	        success: function(data){
				render_student_table(data);
	        },
	        error: function (request, status, error) {
	            alert(error);
	        }
	    });
}

function render_student_table(data){
	var students = data;
	const columns = [{
		Header: 'Assigned Student Table',
		columns: [{
			Header: 'First Name',
			accessor: 'firstname'
		  }, {
			Header: 'Last Name',
			accessor: 'lastname',
		}, {
  			Header: '',
  			accessor: 'id',
  			Cell: ({ value }) => (<a href={"student_teacher_assign/" + String(value)}>View</a>),
  	  	}]
	}];
	const student_list_table = <ReactTable data={students} defaultPageSize={10} columns={columns} filterable defaultFilterMethod= { (filter, row, column) => String(row[filter.id]).toLowerCase().startsWith(filter.value.toLowerCase())}/>

	ReactDOM.render(
	  	student_list_table,
	 	document.getElementById('student_list_table')
	);
}
