class Assign_student_teacher_Input extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			student:{},
            user_id:"",
			users:[]
		}
	}
    componentDidMount() {
		var self = this;
		$.get( "/api/user"
		, function( data ) {
			var user = JSON.parse(data);
			self.setState({users:user});
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
		$.post('/api/student_teacher', {
								student:this.props.student,
                                teacher:this.state.teacher_id
								},
			function(returnedData){
				 console.log(returnedData);
				 window.location.replace("/student_profile/" + String(self.props.student));
		});
	}

	render() {

		var options = this.state.users.map((user) => {
		  	return (
				<option value={user.id}>{user.title}</option>
			)
    	});
		return (
			<div>
				<h2>Assign Teacher to Student</h2>
			  	<p>First Name: {this.state.student.firstname} </p>
                <p>Last Name: {this.state.student.lastname} </p>
				<br/>
				<p>Teachers: <select value={this.state.user_id}
							   onChange={(evt) => this.setState({ user_id:evt.target.value })}>
									<option value={-1}></option>
									{options} </select> </p>
			    <p><input type="submit" value="Assign" onClick={(evt) => this.formSubmit(evt)}/></p>

		  </div>
	  );
	}
}

ReactDOM.render(
  <Assign_student_teacher_Input student={student_id}/>,
  document.getElementById('body')
);
