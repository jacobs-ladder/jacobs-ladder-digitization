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
			accessor: 'title'
		}, {
			Header: 'Type',
			accessor: 'activity_type_label',
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
		   	<p>First Name: {data.firstname}</p>
		   	<p>Last Name: {data.lastname}</p>
			<AssignedActivities studentid={data.id} />
		</div>
	);

	ReactDOM.render(
	student_view,
	document.getElementById('student_view'),
	);
}
