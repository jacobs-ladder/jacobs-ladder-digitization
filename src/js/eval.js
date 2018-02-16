import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactTable from 'react-table'


$(document).ready(function () {
	$.ajax({
    	type: 'GET',
        url: '../api/user',

        dataType: "json",

        success: function(data){
			render_eval_table(data);
        },
        error: function (request, status, error) {
            alert(error);
        }
    });
});

const body = (
	  <div>
		<h2>Evaluator List</h2>
		<p>Evaluator Table</p>
		<div id = "eval_list_table"></div>
		<form action="logout">
		  <input type="submit" value="Logout" />
		</form>
	  </div>
  	);

ReactDOM.render(
  	body,
 	document.getElementById('body')
);

function render_eval_table(data){
	var evals = data;
	const columns = [{
		Header: 'First Name',
		id: 'first_name',
        accessor: d => (d.role_label === 'evaluator' ? d.first_name : false ),
	  }, {
		Header: 'Last Name',
		id: 'last_name',
        accessor: d => (d.role_label === 'evaluator' ? d.last_name : false ),
	  }];
	const eval_list_table = <ReactTable data={data} columns={columns} filterable defaultFilterMethod= { (filter, row, column) => String(row[filter.id]).toLowerCase().startsWith(filter.value.toLowerCase())}/>

	ReactDOM.render(
	  	eval_list_table,
	 	document.getElementById('eval_list_table')
	);
}
