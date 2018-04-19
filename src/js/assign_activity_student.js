class ActivityAssignInput extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			student:{},
            activity_id:"",
			activities:[]
		}
	}
    componentDidMount() {
		var self = this;
		$.get( "/api/activity"
		, function( data ) {
			var activity = JSON.parse(data);
			self.setState({activities:activity});
		});
		$.get( "/api/student?student=" + String(this.props.student)
		, function( data ) {
			var student = JSON.parse(data);
			console.log(data)
			self.setState({student:student});
		});
    }

	formSubmit(event){
		var self = this;
		$.post('/api/student_activity', {
								student:this.props.student,
                                activity:this.state.activity_id
								},
			function(returnedData){
				 console.log(returnedData);
				 window.location.replace("/student_profile/" + String(self.props.student));
		});
	}

	render() {

		var options = this.state.activities.map((activity) => {
		  	return (
				<option value={activity.id}>{activity.title}</option>
			)
    	});
		return (
			<div>
				<h2>Assign Activity to Student</h2>
			  	<p>First Name: {this.state.student.firstname} </p>
                <p>Last Name: {this.state.student.lastname} </p>
				<br/>
				<p>Activity: <select value={this.state.activity_id}
							   onChange={(evt) => this.setState({ activity_id:evt.target.value })}>
									<option value={-1}></option>
									{options} </select> </p>
			    <p><input type="submit" value="Assign" onClick={(evt) => this.formSubmit(evt)}/></p>

		  </div>
	  );
	}
}

ReactDOM.render(
  <ActivityAssignInput student={student_id}/>,
  document.getElementById('body')
);
