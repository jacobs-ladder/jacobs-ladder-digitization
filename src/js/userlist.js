import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactTable from 'react-table'

$(document).ready(function () {
	$.ajax({
    	type: 'GET',
        url: '../api/user',

        dataType: "json",

        success: function(data){
			render_users_table(data);
        },
        error: function (request, status, error) {
            alert(error);
        }
    });
});

const body = (
	  <div>
		<h2>All Users</h2>
		<div id = "users_list_table"></div>
		<form action="logout">
		  <input type="submit" value="Logout" />
		</form>
	  </div>
  	);

ReactDOM.render(
  	body,
 	document.getElementById('body')
);

function render_users_table(data){
	var users = data;
	const columns = [{
		Header: 'First Name',
		accessor: 'first_name'
	  }, {
		Header: 'Last Name',
		accessor: 'last_name',
	  }, {
		Header: 'By Role',
		accessor: 'role_label',
		id: 'role',
		Cell: ({ value }) => (value),
		filterMethod: (filter, row) => {
			if (filter.value === 'all') {
				return true;
			}
			if (filter.value === 'administrator') {
				return row[filter.id] == 'administrator';
			}
			if (filter.value === 'teacher') {
				return row[filter.id] == 'teacher';
			}
			if (filter.value === 'evaluator') {
				return row[filter.id] == 'evaluator';
			}
		},
		Filter: ({ filter, onChange }) =>
                    <select
                      onChange={event => onChange(event.target.value)}
                      style={{ width: "100%" }}
                      value={filter ? filter.value : "all"}
                    >
                      <option value="all">Show All</option>
                      <option value="administrator">administrator</option>
					  <option value="evaluator">evaluator</option>
					  <option value="teacher">teacher</option>
                    </select>
	  }];
	const users_list_table = <ReactTable data={users} defaultPageSize={10} columns={columns} filterable defaultFilterMethod= { (filter, row, column) => String(row[filter.id]).toLowerCase().startsWith(filter.value.toLowerCase())}/>

	ReactDOM.render(
	  	users_list_table,
	 	document.getElementById('users_list_table')
	);
}
