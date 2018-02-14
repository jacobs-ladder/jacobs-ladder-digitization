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

const currBody = (
<div>
<div id='student_view'> </div>
<form action="logout">
  <input type="submit" value="Logout" />
</form>
</div>
);



ReactDOM.render(
currBody,
document.getElementById('body')
);

function render_student_view(data){
	//TODO: Render student view with the student object
}
