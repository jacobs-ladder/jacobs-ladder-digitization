import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactTable from 'react-table'


$(document).ready(function () {
	$.ajax({
    	type: 'GET',
        url: '../api/activity',

        dataType: "json",

        success: function(data){
			render_activity_table(data);
        },
        error: function (request, status, error) {
            alert(error);
        }
    });
});

const body = (
	  <div>
		<h2>Activity List</h2>
        <a href='/activitycreation'>Add New Activity</a>
		<p></p>
		<a href='/activity_type_creation'>Add New Activity Type</a>
		<div id = "activity_list_table"></div>
		<form action="logout">
		  <input type="submit" value="Logout" />
		</form>
	  </div>
  	);

ReactDOM.render(
  	body,
 	document.getElementById('body')
);

function render_activity_table(data){
	var students = data;
	const columns = [{
		Header: 'Title',
		accessor: 'title'
	  }, {
		Header: 'Instructions',
		accessor: 'instructions',
      }, {
		Header: 'Type',
		accessor: 'activity_type_label',
	  }, {
		Header: '',
		accessor: 'id',
		Cell: ({ value }) => (<a href={"activityedit/" + String(value)}>Edit</a>),
	  }];
	const activity_list_table = <ReactTable data={data} defaultPageSize={10} columns={columns} filterable defaultFilterMethod= { (filter, row, column) => String(row[filter.id]).toLowerCase().startsWith(filter.value.toLowerCase())}/>

	ReactDOM.render(
	  	activity_list_table,
	 	document.getElementById('activity_list_table')
	);
}
