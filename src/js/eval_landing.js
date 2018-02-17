import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactTable from 'react-table'


$(document).ready(function () {
	$.ajax({
    	type: 'GET',
        url: '../api/user',

        dataType: "json",

        success: function(data){
			// render_teacher_table(data);
			render_users_table(data);
        },
        error: function (request, status, error) {
            alert(error);
        }
    });
});

$(document).ready(function () {
	$.ajax({
    	type: 'GET',
        url: '../api/student',

        dataType: "json",

        success: function(data){
			// render_teacher_table(data);
			render_student_table(data);
        },
        error: function (request, status, error) {
            alert(error);
        }
    });
});

const body = (
	  <div>
	  <h2>Welcome Evaluator</h2>
		<p></p>
		<div className="row">
		<div id = "student_list_table" className="column1"></div>
		<div id = "users_list_table" className="column1"></div>
		</div>
		<form action="/studentlist">
		  <input type="submit" value="All Student List" />
		</form>
		<br />
		<form action="logout">
		  <input type="submit" value="Logout" />
		</form>
	  </div>
  	);

ReactDOM.render(
  	body,
 	document.getElementById('body')
);

function render_student_table(data){
	var students = data;
	const columns = [{
		Header: 'Assigned Student List',
		columns: [{
			Header: 'First Name',
			accessor: 'firstname'
		  }, {
			Header: 'Last Name',
			accessor: 'lastname',
		  }]
	}];
	const student_list_table = <ReactTable defaultPageSize={10} data={data} columns={columns} filterable defaultFilterMethod= { (filter, row, column) => String(row[filter.id]).toLowerCase().startsWith(filter.value.toLowerCase())}/>

	ReactDOM.render(
	  	student_list_table,
	 	document.getElementById('student_list_table')
	);
}

function render_users_table(data){
	var users = data;
	const columns = [{
		Header: 'Teacher List',
		columns: [{
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
		  }]
	}];
	const users_list_table = <ReactTable data={data} columns={columns} filterable defaultFilterMethod= { (filter, row, column) => String(row[filter.id]).toLowerCase().startsWith(filter.value.toLowerCase())} defaultPageSize={10}/>

	ReactDOM.render(
	  	users_list_table,
	 	document.getElementById('users_list_table')
	);
}
