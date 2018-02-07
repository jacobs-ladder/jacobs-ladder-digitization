import React, { Component } from "react";
import ReactDOM from "react-dom";

$(document).ready(function () {
	$.ajax({
    	type: 'GET',
        url: '../api/student',

        dataType: "json",

        success: function(data){
			render_student_table(data);
        },
        error: function (request, status, error) {
            alert(error);
        }
    });
});

const body = (
	  <div>
		<h2>Admin Landing</h2>
		<p>Students Table</p>
		<div id = "student_list_table"></div>
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
	const student_list_table = (
		<table>
			<thead>
			  <tr>
				<th>First Name</th>
				<th>Last Name</th>
			  </tr>
			</thead>
			<tbody>
				{students.map(function(student, key) {
					return (
						<tr key={key}>
							<td>{student.firstname}</td>
							<td>{student.lastname}</td>
						</tr>
					);
				})}
			</tbody>

		</table>
  	);

	ReactDOM.render(
	  	student_list_table,
	 	document.getElementById('student_list_table')
	);
}

