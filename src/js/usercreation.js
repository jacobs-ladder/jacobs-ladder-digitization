class ActivityInput extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			username:"",
			roles:"",
			first_name:"",
            last_name:"",
			password:"",
			email_address:"",
		}
	}

	formSubmit(event){
		$.post('../api/user', { username:this.state.username,
									role_label:this.state.roles,
									first_name:this.state.first_name,
                                    last_name:this.state.last_name,
									password:this.state.password,
									email_address:this.state.email_address,
									},
			function(returnedData){
				 console.log(returnedData);
		});
	}

	render() {
		return (
			<div>
				<h2>Create an User</h2>
			  		<p>User Name: <input type="text" name="username" value={this.state.username}
									onChange={(evt) => this.setState({ username:evt.target.value }) }/></p>
					<p>Password: <input type="text" name="password" value={this.state.password}
									onChange={(evt) => this.setState({ password:evt.target.value }) }/></p>
					<p>Email: <input type="text" name="email_address" value={this.state.email_address}
									onChange={(evt) => this.setState({ email_address:evt.target.value }) }/></p>
			  		<p>Type of Roles: <select name="role_label" value={this.state.roles}
									onChange={(evt) => this.setState({ roles:evt.target.value }) }>
				  		<option value="administrator">Administrator</option>
				  		<option value="evaluator">Evaluator</option>
				  		<option value="teacher">Teacher</option>
					</select></p>
			  	<p>First Name: <input type="text" name="first_name" value={this.state.first_name}
                                onChange={(evt) => this.setState({ first_name:evt.target.value }) }/></p>
                <p>Last Name: <input type="text" name="last_name" value={this.state.last_name}
                                onChange={(evt) => this.setState({ last_name:evt.target.value }) }/></p>

				<br/>

				<br/>
			  	<p><input type="submit" value="Create an User" onClick={(evt) => this.formSubmit(evt)}/></p>
		  </div>
	  );
	}
}

ReactDOM.render(
  <ActivityInput />,
  document.getElementById('body')
);
