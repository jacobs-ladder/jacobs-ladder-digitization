class assign_activity_student_Input extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			student_id:"",
            activity_id:"",
			activities:[]
		}
	}
    componentDidMount() {
		$.get( "/api/activity"
		, function( data ) {
			var activity = JSON.parse(data);
			self.setState({activities:activity});
		});
    });

	formSubmit(event){
		$.post('/api/student_activity?student=' + String(data.id), {
								student_id:this.state.student_id,
                                activity_id:this.state.activity_id,
								},
			function(returnedData){
				 console.log(returnedData);
		});
	}

	render() {

		var options = this.state.activites.map((activity) => {
		  	return (
				<option value={activity.id}>{activity.title}</option>
			)
    	});
		return (
			<div>
				<h2>Create a new Student</h2>
			  	<p>First Name: <input type="text" name="first_name" value={this.state.first_name}
                                onChange={(evt) => this.setState({ first_name:evt.target.value }) }/></p>
                <p>Last Name: <input type="text" name="last_name" value={this.state.last_name}
                                onChange={(evt) => this.setState({ last_name:evt.target.value }) }/></p>
				<br/>
				<form action="/studentlist">
				  <p><input type="submit" value="Create" onClick={(evt) => this.formSubmit(evt)}/></p>
				</form>


				<select > {options} </select>

		  </div>
	  );
	}

    function render_activity(data){
        <p>Type of Roles: <select name="role_label" value={this.state.roles}
                        onChange={(evt) => this.setState({ roles:evt.target.value }) }>
            <option value="administrator">Administrator</option>
            <option value="evaluator">Evaluator</option>
            <option value="teacher">Teacher</option>
        </select></p>
    	const activity_list_table = <ReactTable data={data} defaultPageSize={10} columns={columns} filterable defaultFilterMethod= { (filter, row, column) => String(row[filter.id]).toLowerCase().startsWith(filter.value.toLowerCase())}/>

    	ReactDOM.render(
    	  	activity_list_table,
    	 	document.getElementById('activity_list_table')
    	);
    }
}

ReactDOM.render(
  <StudentInput />,
  document.getElementById('body')
);
