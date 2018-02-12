import React, { Component } from "react";
import ReactDOM from "react-dom";

var activityList = "";

$(document).ready(function () {

    $.ajax({
        type: 'GET',
        url: '../api/activity',  //TODO this doesn't work

        dataType: "json",
        // success: function (data) {
        //     // do something with the json here
        //     this.student=data;

        success: function(data){

          $(data).each(function(){
                activityList = activityList + "<li>Title: " + this.title + " Description: " + this.description + "</li>";
            });
        },
        error: function (request, status, error) {

            alert(error);
        }
    });
});

const currBody = (
  <div>
	<h2>Activity List</h2>

	  <div className="col-md-4 col-4">
	    <ul id="activities"></ul>
	  </div>


	<form action="logout">
	  <input type="submit" value="Logout" />
	</form>
  </div>
  );



ReactDOM.render(
  currBody,
  document.getElementById('body')
);

