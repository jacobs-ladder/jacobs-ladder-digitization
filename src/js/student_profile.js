import React, { Component } from "react";
import ReactDOM from "react-dom";

$(document).ready(function () {
	$.ajax({
    	type: 'GET',
        url: '../api/student?student=' + String(sid),

        dataType: "json",

        success: function(data){
			render_student_view(data);
        },
        error: function (request, status, error) {
            alert(error)
        }
    });
});

const body = (
<div>
<div id='student_view'> </div>
<form action="logout">
  <input type="submit" value="Logout" />
</form>
</div>
);



ReactDOM.render(
body,
document.getElementById('body')
);

function render_student_view(data){
	const student_view = <div>
				<h1>First Name: {data.firstname}</h1>
			   <h1>Last Name: {data.lastname}</h1>
			   </div>

	ReactDOM.render(
	student_view,
	document.getElementById('student_view'),
	);
}
