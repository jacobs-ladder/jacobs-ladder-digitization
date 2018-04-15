class StudentInput extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			first_name:"",
            last_name:""
		}
	}

	formSubmit(event){
		$.post('/api/student', {
								first_name:this.state.first_name,
                                last_name:this.state.last_name,
								},
			function(returnedData){
				 console.log(returnedData);
		});
	}

	render() {
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

		  </div>
	  );
	}
}

ReactDOM.render(
  <StudentInput />,
  document.getElementById('body')
);
