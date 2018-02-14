import React, { Component } from "react";
import ReactDOM from "react-dom";

$(document).ready(function () {

    $.ajax({
        type: 'GET',
        url: '../api/student',  //TODO this doesn't work?

        dataType: "json",
        // success: function (data) {
        //     // do something with the json here
        //     this.student=data;

        success: function(data){

          $(data).each(function(){
                $('#studentListTable').append('<tbody><tr><td>' + this.firstname + '</td><td>' + this.lastname + '</td></tr></tbody>')
            });
        },
        error: function (request, status, error) {

            alert(error);
        }
    });
});

const currBody = (
<div>
<h2>Teacher Name</h2>

  <table id="studentListTable">
  <thead>
    <tr>
      <th>Student List</th>
    </tr>
  </thead>

  </table>


<form action="logout">
  <input type="submit" value="Logout" />
</form>
</div>
);



ReactDOM.render(
currBody,
document.getElementById('body')
);
