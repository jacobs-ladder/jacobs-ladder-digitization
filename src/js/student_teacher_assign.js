import React, { Component } from "react";
import ReactDOM from "react-dom";

$(document).ready(function () {
	$.ajax({
    	type: 'GET',
        url: '../api/student?student=' + String(sid),

        dataType: "json",

        success: function(data){
			get_assigned_students(data);
        },
        error: function (request, status, error) {
            alert(error)
        }
    });
});

const body = (
<div>
<div id='student_view'> </div>
<div id='student_info'> </div>
</div>
);



ReactDOM.render(
body,
document.getElementById('body')
);


function get_assigned_students(data){
		render_student_view(data);

		$.ajax({
	    	type: 'GET',
	        url: '../api/student_teacher?student=' + String(data.id),

	        dataType: "json",

	        success: function(data){
				render_student_table(data);
	        },
	        error: function (request, status, error) {
	            alert(error);
	        }
	    });
}

function render_student_view(data){
	const spanStyle = {
		color: 'blue',
	};
	const h1Style = {
		textAlign: 'center',
	};

	const student_view = <div>
		<h1 style=
			{h1Style}><span style={spanStyle}>{data.firstname} {data.lastname}</span>&#39; Teacher Assignment</h1>
			<p></p>
			<p></p>
			<p></p>
		</div>

	ReactDOM.render(
	student_view,
	document.getElementById('student_view'),
	);
}

function render_student_table(data) {
	const spanStyle = {
		color: 'green',
		fontSize: 25,
	};

	const student_info = <div>
		<p><b>Primary Teacher:   <span style={spanStyle}>{data[0] != null ? data[0].first_name : ""} {data[0] != null ? data[0].last_name : ""}</span></b></p>
		// <p><b>Secondary Teacher:   <span style={spanStyle}>{data[1] != null ? data[1].first_name : ""} {data[1] != null ? data[1].last_name : ""}</span></b></p>
		<p><b>Evaluator: </b></p>
		<p><b>Temps: </b></p>
		<p></p>
		<p></p>
		</div>
	ReactDOM.render(
	student_info,
	document.getElementById('student_info'),
	);
}
