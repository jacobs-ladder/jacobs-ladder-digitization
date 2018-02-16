import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactTable from 'react-table'


$(document).ready(function () {
	$.ajax({
    	type: 'GET',
        url: '../api/user',

        dataType: "json",

        success: function(data){
			render_teacher_table(data);
        },
        error: function (request, status, error) {
            alert(error);
        }
    });
});

const body = (
	  <div>
		<h2>Teacher List</h2>
		<p>Teacher Table</p>
		<div id = "teacher_list_table"></div>
		<form action="logout">
		  <input type="submit" value="Logout" />
		</form>
	  </div>
  	);

ReactDOM.render(
  	body,
 	document.getElementById('body')
);

function render_teacher_table(data){
	var teachers = data.filter(d => d.role_label === 'teacher');
	const columns = [{
		Header: 'First Name',
        accessor: "first_name",
	  }, {
		Header: 'Last Name',
		accessor: 'last_name',
	  }];
	const teacher_list_table = <ReactTable data={teachers} columns={columns} filterable defaultFilterMethod= { (filter, row, column) => String(row[filter.id]).toLowerCase().startsWith(filter.value.toLowerCase())}/>

	ReactDOM.render(
	  	teacher_list_table,
	 	document.getElementById('teacher_list_table')
	);
}
