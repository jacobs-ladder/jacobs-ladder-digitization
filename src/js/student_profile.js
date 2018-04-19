import React, { Component } from "react";
import ReactDOM from "react-dom";
import ReactTable from 'react-table'


class AssignedActivities extends React.Component{
	constructor(props){
		super(props);
        this.state = {
            activities:[]
        };
    }

    componentDidMount(){
        var self = this;
		$.ajax({
			type: 'GET',
		    url: '../api/student_activity?student=' + this.props.studentid,

		    dataType: "json",

		    success: function(data){
                if(data){
                    self.setState({ activities : data});
                }
		    },
		    error: function (request, status, error) {
		        alert(error);
		    }
		});
    }

	render(){
		const columns = [{
			Header: 'Title',
			accessor: 'activity.title'
		}, {
			Header: 'Type',
			accessor: 'activity.activity_type_label',
		}, {
			Header: 'Created',
			accessor: 'student_activity_created',
			Cell: ({ value }) => (<div>{value.substring(0,10)}</div>),
		}, {
			Header: 'View',
			Cell: ({ row }) => (<a href={"/student_activity/" + String(this.props.studentid) + "/"+ String(row._original.activity.id) + "/" + String(row._original.student_activity_created)}>View</a>),
		}];
		return (
			<ReactTable
				data={this.state.activities}
				defaultPageSize={10}
				columns={columns}
				filterable
				defaultFilterMethod= { (filter, row, column) => String(row[filter.id]).toLowerCase().startsWith(filter.value.toLowerCase())}
			/>
		);
	}
}

$(document).ready(function () {
	$.ajax({
    	type: 'GET',
        url: '../api/student?student=' + String(sid),

        dataType: "json",

        success: function(data){
			get_assigned_students(data);
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
	const student_view = (
		<div>
		   	<h1>{data.firstname} {data.lastname}</h1>
			<a href= {'/assign_student_teacher_creation/' + String(sid)}>Assign a Teacher</a>
			<div id='student_info'> </div>
			<h3>Assigned Activities</h3>
			<a href={'/assign_activity_student/' + String(sid)}>Assign New Activity</a>
			<AssignedActivities studentid={data.id} />
		</div>
	);

	ReactDOM.render(
	student_view,
	document.getElementById('student_view'),
	);
}

function get_assigned_students(data){
		// render_student_view(data);

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

function render_student_table(data) {

	const student_info = <div>
		<p>Primary Teacher:   {data[0] != null ? data[0].first_name : ""} {data[0] != null ? data[0].last_name : ""}</p>
		<p>Evaluator: </p>
		<p>Temps: </p>
		<p></p>
		<p></p>
		</div>
	ReactDOM.render(
	student_info,
	document.getElementById('student_info'),
	);
}
