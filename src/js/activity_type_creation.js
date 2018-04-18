class ActivityTypeInput extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			label:"",
		}
	}
    // componentDidMount() {
	// 	var self = this;
	// 	$.get( "/api/activity"
	// 	, function( data ) {
	// 		var activity = JSON.parse(data);
	// 		self.setState({activities:activity});
	// 	});
	// 	$.get( "/api/student?student=" + String(this.props.student)
	// 	, function( data ) {
	// 		var student = JSON.parse(data);
	// 		console.log(data)
	// 		self.setState({student:student});
	// 	});
    // }

	formSubmit(event){
		var self = this;
		console.log(this.state.label)
		$.post('/api/activity_type', { label: this.state.label },
			function(returnedData){
				 console.log(returnedData);
				 window.location.replace("/activitylist");
		});
	}

	render() {
		//
		// var options = this.state.activities.map((activity) => {
		//   	return (
		// 		<option value={activity.id}>{activity.title}</option>
		// 	)
    	// });
		return (
			<div>
				<h2>Add New Activity type</h2>
				<p>Type: <input type="text" name="type" value={this.state.label}
								onChange={(evt) => this.setState({ label:evt.target.value }) }/></p>
			    <p><input type="submit" value="Submit" onClick={(evt) => this.formSubmit(evt)}/></p>

		  </div>
	  );
	}
}

ReactDOM.render(
  <ActivityTypeInput/>,
  document.getElementById('body')
);
