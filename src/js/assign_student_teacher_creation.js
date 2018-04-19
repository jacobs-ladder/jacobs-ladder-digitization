class Assign_student_teacher_Input extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			title:"",
			type:"numbers",
			instructions:""
		}
	}

    componentDidMount(){
		if(this.props.activity != -1){
        	var self = this;
			$.get( "/api/activity", {activity : this.props.activity}
			, function( data ) {
				var activity = JSON.parse(data);
				self.setState({ title : activity.title, type : activity.activity_type_label, instructions : activity.instructions });
			});
		}
    }

	formSubmit(event){
		var columns_and_rows_json = JSON.stringify({
			"columns": this.refs.columns.getColumns(),
			"rows":this.refs.rows.getRows()
		});
		console.log(columns_and_rows_json);
		$.post('../api/activity', { title:this.state.title,
									activity_type:this.state.type,
									instructions:this.state.instructions,
									columns_and_rows : columns_and_rows_json},
			function(returnedData){
                // window.location.href = '/activitylist'
                window.location.replace("/activitylist");
		});
	}

	formSave(event){
		$.put('../api/activity', { activity:this.props.activity,
                                    title:this.state.title,
									activity_type:this.state.type,
									instructions:this.state.instructions},
			function(returnedData){
				console.log(returnedData);
                window.location.href = '/activitylist'
		});
	}

	render() {
		return (
			<div>
				<h2>{this.props.activity == -1 ? "Create" : "Edit"} an Activity</h2>
			  		<p>Title: <input type="text" name="title" value={this.state.title}
									onChange={(evt) => this.setState({ title:evt.target.value }) }/></p>
			  		<p>Type of Activity: <select name="activity_type" value={this.state.type}
									onChange={(evt) => this.setState({ type:evt.target.value }) }>
				  		<option value="numbers">Numbers</option>
				  		<option value="reading">Reading</option>
				  		<option value="motor">Motor</option>
				  		<option value="visual">Visual</option>
					</select></p>
			  	<p>Instructions: <textarea name="instructions"rows="10" cols="50" value={this.state.instructions}
									onChange={(evt) => this.setState({ instructions:evt.target.value }) }></textarea></p>
				{(this.props.activity == -1) &&
					<div>
					<p>Columns and Rows cannot be edited once saved</p>
				  	<ColumnsFieldSet ref="columns" activity={this.props.activity}/>
					<br/>
				  	<RowsFieldSet ref="rows" activity={this.props.activity}/>
					<br/>
					</div>
				}
			    <p><input type="submit" value="Save Activity" onClick={(evt) => {
															if(this.props.activity == -1){
																this.formSubmit(evt);
															} else {
																this.formSave(evt);
															}}}/></p>
		  </div>
	  );
	}
}

ReactDOM.render(
  <Assign_student_teacher_Input/>,
  document.getElementById('body')
);
